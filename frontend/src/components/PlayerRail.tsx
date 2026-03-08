import React from 'react';
import type { Player } from '../types/game';
import { WIN_SCORE } from '../types/game';

interface Props {
  players: Player[];
  currentPlayerId: string | null;
  localPlayerId: string | null;
}

export function PlayerRail({ players, currentPlayerId, localPlayerId }: Props) {
  const sorted = [...players].sort((a, b) => b.totalScore - a.totalScore);

  return (
    <div style={styles.rail}>
      {sorted.map((player, rank) => {
        const isActive = player.id === currentPlayerId;
        const isLocal = player.id === localPlayerId;

        return (
          <div
            key={player.id}
            style={{
              ...styles.row,
              background: isActive ? '#eaf4fb' : '#fff',
              borderLeft: isActive ? '4px solid #2980b9' : '4px solid transparent',
            }}
          >
            <span style={styles.rank}>#{rank + 1}</span>
            <span style={styles.name}>
              {player.name}
              {isLocal && <span style={styles.you}> (you)</span>}
            </span>
            {player.isVulnerable && <span style={styles.vuln}>V</span>}
            <span style={styles.score}>{player.totalScore.toLocaleString()}</span>
            <div style={styles.miniBarTrack}>
              <div
                style={{
                  ...styles.miniBarFill,
                  width: `${Math.min(100, (player.totalScore / WIN_SCORE) * 100)}%`,
                  background: isActive ? '#2980b9' : '#95a5a6',
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  rail: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.4rem 0.6rem',
    borderRadius: '4px',
    fontSize: '0.9rem',
  },
  rank: {
    color: '#95a5a6',
    width: '1.5rem',
    flexShrink: 0,
  },
  name: {
    flex: 1,
    fontWeight: 500,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  you: {
    color: '#7f8c8d',
    fontWeight: 'normal',
    fontSize: '0.8rem',
  },
  vuln: {
    background: '#c0392b',
    color: '#fff',
    fontSize: '0.65rem',
    fontWeight: 'bold',
    padding: '1px 4px',
    borderRadius: '3px',
    flexShrink: 0,
  },
  score: {
    fontVariantNumeric: 'tabular-nums',
    fontWeight: 'bold',
    flexShrink: 0,
  },
  miniBarTrack: {
    width: '4rem',
    height: '4px',
    background: '#ecf0f1',
    borderRadius: '2px',
    flexShrink: 0,
  },
  miniBarFill: {
    height: '100%',
    borderRadius: '2px',
    transition: 'width 0.4s ease',
  },
};
