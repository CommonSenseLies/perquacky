import React from 'react';
import type { WordEntry } from '../types/game';
import { GROUP_BONUSES, MAX_WORDS_PER_LENGTH } from '../types/game';

interface Props {
  words: WordEntry[];
  isVulnerable: boolean;
}

export function GroupBonusTracker({ words, isVulnerable }: Props) {
  const countByLength = (len: number) =>
    words.filter((w) => w.length === len).length;

  const isGroupComplete = (len: number) =>
    countByLength(len) === MAX_WORDS_PER_LENGTH;

  const bonuses = isVulnerable
    ? GROUP_BONUSES.filter((b) => b.lengths[0] >= 4)
    : GROUP_BONUSES;

  return (
    <div style={styles.container}>
      <h3 style={styles.heading}>Group Bonuses</h3>
      {bonuses.map((bonus) => {
        const [a, b] = bonus.lengths;
        const earned = isGroupComplete(a) && isGroupComplete(b);
        const aFull = isGroupComplete(a);
        const bFull = isGroupComplete(b);

        return (
          <div
            key={`${a}-${b}`}
            style={{
              ...styles.row,
              background: earned ? '#d5f5e3' : '#f2f3f4',
              color: earned ? '#1e8449' : '#7f8c8d',
            }}
          >
            <span>
              <GroupDot filled={aFull} /> {a}-letter &amp; <GroupDot filled={bFull} /> {b}-letter
            </span>
            <span style={styles.points}>+{bonus.points.toLocaleString()}</span>
            {earned && <span style={styles.badge}>✓</span>}
          </div>
        );
      })}
    </div>
  );
}

function GroupDot({ filled }: { filled: boolean }) {
  return (
    <span
      style={{
        display: 'inline-block',
        width: '0.6rem',
        height: '0.6rem',
        borderRadius: '50%',
        background: filled ? '#27ae60' : '#bdc3c7',
        marginRight: '2px',
        verticalAlign: 'middle',
      }}
    />
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  heading: {
    margin: '0 0 0.4rem',
    fontSize: '0.85rem',
    textTransform: 'uppercase',
    color: '#7f8c8d',
    letterSpacing: '0.05em',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.3rem 0.6rem',
    borderRadius: '4px',
    fontSize: '0.9rem',
  },
  points: {
    marginLeft: 'auto',
    fontWeight: 'bold',
  },
  badge: {
    color: '#27ae60',
    fontWeight: 'bold',
  },
};
