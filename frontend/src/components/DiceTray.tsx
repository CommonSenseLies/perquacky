import React from 'react';
import type { Die } from '../types/game';

interface Props {
  dice: Die[];
}

export function DiceTray({ dice }: Props) {
  return (
    <div style={styles.tray}>
      {dice.map((die) => (
        <div
          key={die.id}
          style={{
            ...styles.die,
            background: die.color === 'red' ? '#c0392b' : '#2c3e50',
            color: '#fff',
          }}
        >
          {die.face}
        </div>
      ))}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  tray: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    padding: '1rem',
    background: '#ecf0f1',
    borderRadius: '8px',
  },
  die: {
    width: '3rem',
    height: '3rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.4rem',
    fontWeight: 'bold',
    borderRadius: '6px',
    boxShadow: '2px 2px 4px rgba(0,0,0,0.4)',
    userSelect: 'none',
  },
};
