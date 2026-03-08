import React, { useEffect, useState } from 'react';

interface Props {
  /** ISO UTC string from the server */
  endsAt: string;
  onExpired: () => void;
}

export function CountdownTimer({ endsAt, onExpired }: Props) {
  const [secondsLeft, setSecondsLeft] = useState(calcSecondsLeft(endsAt));

  useEffect(() => {
    setSecondsLeft(calcSecondsLeft(endsAt));

    const interval = setInterval(() => {
      const s = calcSecondsLeft(endsAt);
      setSecondsLeft(s);
      if (s <= 0) {
        clearInterval(interval);
        onExpired();
      }
    }, 250);

    return () => clearInterval(interval);
  }, [endsAt, onExpired]);

  const clamped = Math.max(0, secondsLeft);
  const minutes = Math.floor(clamped / 60);
  const seconds = clamped % 60;
  const isUrgent = clamped <= 30;

  return (
    <div
      style={{
        ...styles.timer,
        color: isUrgent ? '#c0392b' : '#2c3e50',
        borderColor: isUrgent ? '#c0392b' : '#bdc3c7',
      }}
    >
      {minutes}:{String(seconds).padStart(2, '0')}
    </div>
  );
}

function calcSecondsLeft(endsAt: string): number {
  return Math.floor((new Date(endsAt).getTime() - Date.now()) / 1000);
}

const styles: Record<string, React.CSSProperties> = {
  timer: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    fontVariantNumeric: 'tabular-nums',
    border: '2px solid',
    borderRadius: '8px',
    padding: '0.25rem 1rem',
    minWidth: '6rem',
    textAlign: 'center',
    transition: 'color 0.3s, border-color 0.3s',
  },
};
