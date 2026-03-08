import React, { useState, useRef } from 'react';

interface Props {
  onSubmit: (word: string) => void;
  disabled: boolean;
  lastRejection: { word: string; reason: string } | null;
}

export function WordInput({ onSubmit, disabled, lastRejection }: Props) {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim().toUpperCase();
    if (trimmed.length >= 3) {
      onSubmit(trimmed);
      setValue('');
      inputRef.current?.focus();
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          ref={inputRef}
          style={styles.input}
          value={value}
          onChange={(e) => setValue(e.target.value.toUpperCase())}
          placeholder="Type a word..."
          disabled={disabled}
          autoFocus
          autoComplete="off"
          spellCheck={false}
        />
        <button type="submit" style={styles.button} disabled={disabled || value.trim().length < 3}>
          Submit
        </button>
      </form>
      {lastRejection && (
        <p style={styles.rejection}>
          &ldquo;{lastRejection.word}&rdquo; — {lastRejection.reason}
        </p>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  form: {
    display: 'flex',
    gap: '0.5rem',
  },
  input: {
    flex: 1,
    padding: '0.5rem 0.75rem',
    fontSize: '1.1rem',
    borderRadius: '4px',
    border: '1px solid #bdc3c7',
    letterSpacing: '0.1em',
  },
  button: {
    padding: '0.5rem 1.25rem',
    fontSize: '1rem',
    background: '#2980b9',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  rejection: {
    color: '#c0392b',
    margin: 0,
    fontSize: '0.9rem',
  },
};
