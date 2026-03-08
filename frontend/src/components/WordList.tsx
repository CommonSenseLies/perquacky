import React from 'react';
import type { WordEntry } from '../types/game';
import { MAX_WORDS_PER_LENGTH, MIN_WORD_LENGTH, MAX_WORD_LENGTH } from '../types/game';

interface Props {
  words: WordEntry[];
  isVulnerable: boolean;
}

export function WordList({ words, isVulnerable }: Props) {
  const minLength = isVulnerable ? 4 : MIN_WORD_LENGTH;
  const lengths = Array.from(
    { length: MAX_WORD_LENGTH - minLength + 1 },
    (_, i) => i + minLength
  );

  const byLength = (len: number) => words.filter((w) => w.length === len);

  return (
    <div style={styles.grid}>
      {lengths.map((len) => {
        const group = byLength(len);
        const slots = Array.from({ length: MAX_WORDS_PER_LENGTH });

        return (
          <div key={len} style={styles.group}>
            <div style={styles.groupHeader}>
              {len} letters
              <span style={styles.count}>
                {group.length}/{MAX_WORDS_PER_LENGTH}
              </span>
            </div>
            {slots.map((_, i) => {
              const entry = group[i];
              return (
                <div key={i} style={{ ...styles.slot, ...(entry ? styles.filled : styles.empty) }}>
                  {entry ? (
                    <>
                      <span>{entry.word}</span>
                      <span style={styles.points}>+{entry.score}</span>
                    </>
                  ) : (
                    <span style={styles.placeholder}>—</span>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  grid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.75rem',
  },
  group: {
    minWidth: '120px',
    flex: '1 1 120px',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  groupHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    fontWeight: 'bold',
    fontSize: '0.8rem',
    textTransform: 'uppercase',
    color: '#7f8c8d',
    marginBottom: '2px',
  },
  count: {
    color: '#2980b9',
  },
  slot: {
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.9rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: '1.75rem',
  },
  filled: {
    background: '#d5f5e3',
    color: '#1e8449',
  },
  empty: {
    background: '#f2f3f4',
    color: '#bdc3c7',
  },
  placeholder: {
    fontSize: '0.75rem',
  },
  points: {
    fontSize: '0.75rem',
    color: '#27ae60',
  },
};
