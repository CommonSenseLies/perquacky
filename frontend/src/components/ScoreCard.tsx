import React from 'react';
import type { Player, TurnScore } from '../types/game';
import { VULNERABLE_THRESHOLD, WIN_SCORE } from '../types/game';

interface Props {
  player: Player;
  turnScore: TurnScore | null;
  isCurrentTurn: boolean;
}

export function ScoreCard({ player, turnScore, isCurrentTurn }: Props) {
  const progressPct = Math.min(100, (player.totalScore / WIN_SCORE) * 100);
  const vulnerablePct = Math.min(100, (VULNERABLE_THRESHOLD / WIN_SCORE) * 100);

  return (
    <div
      style={{
        ...styles.card,
        borderColor: isCurrentTurn ? '#2980b9' : '#bdc3c7',
      }}
    >
      <div style={styles.header}>
        <span style={styles.name}>{player.name}</span>
        {player.isVulnerable && <span style={styles.vulnerableBadge}>VULNERABLE</span>}
        {isCurrentTurn && <span style={styles.turnBadge}>YOUR TURN</span>}
      </div>

      <div style={styles.score}>{player.totalScore.toLocaleString()}</div>

      {/* Progress bar */}
      <div style={styles.progressTrack}>
        {/* Vulnerable threshold marker */}
        <div style={{ ...styles.thresholdMark, left: `${vulnerablePct}%` }} />
        <div style={{ ...styles.progressFill, width: `${progressPct}%` }} />
      </div>
      <div style={styles.progressLabels}>
        <span>0</span>
        <span style={{ position: 'absolute', left: `${vulnerablePct}%`, transform: 'translateX(-50%)' }}>
          2k
        </span>
        <span>5000</span>
      </div>

      {/* Turn score breakdown */}
      {turnScore && (
        <div style={styles.breakdown}>
          <div style={styles.breakdownRow}>
            <span>Words</span>
            <span>{turnScore.subtotal.toLocaleString()}</span>
          </div>
          {turnScore.groupBonuses
            .filter((b) => b.earned)
            .map((b) => (
              <div key={`${b.lengths[0]}-${b.lengths[1]}`} style={styles.breakdownRow}>
                <span>
                  Bonus ({b.lengths[0]}&amp;{b.lengths[1]})
                </span>
                <span style={{ color: '#27ae60' }}>+{b.points.toLocaleString()}</span>
              </div>
            ))}
          {turnScore.penaltyApplied && (
            <div style={styles.breakdownRow}>
              <span>Penalty</span>
              <span style={{ color: '#c0392b' }}>-500</span>
            </div>
          )}
          <div style={{ ...styles.breakdownRow, fontWeight: 'bold' }}>
            <span>Turn total</span>
            <span>{turnScore.total.toLocaleString()}</span>
          </div>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    border: '2px solid',
    borderRadius: '8px',
    padding: '0.75rem 1rem',
    background: '#fff',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    minWidth: '180px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    flexWrap: 'wrap',
  },
  name: {
    fontWeight: 'bold',
    fontSize: '1rem',
  },
  vulnerableBadge: {
    background: '#c0392b',
    color: '#fff',
    fontSize: '0.65rem',
    padding: '1px 5px',
    borderRadius: '4px',
    fontWeight: 'bold',
  },
  turnBadge: {
    background: '#2980b9',
    color: '#fff',
    fontSize: '0.65rem',
    padding: '1px 5px',
    borderRadius: '4px',
    fontWeight: 'bold',
  },
  score: {
    fontSize: '2rem',
    fontWeight: 'bold',
    fontVariantNumeric: 'tabular-nums',
  },
  progressTrack: {
    position: 'relative',
    height: '6px',
    background: '#ecf0f1',
    borderRadius: '3px',
    overflow: 'visible',
  },
  progressFill: {
    height: '100%',
    background: '#2980b9',
    borderRadius: '3px',
    transition: 'width 0.4s ease',
  },
  thresholdMark: {
    position: 'absolute',
    top: '-3px',
    width: '2px',
    height: '12px',
    background: '#e67e22',
    transform: 'translateX(-50%)',
    zIndex: 1,
  },
  progressLabels: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.65rem',
    color: '#95a5a6',
  },
  breakdown: {
    borderTop: '1px solid #ecf0f1',
    paddingTop: '0.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    fontSize: '0.85rem',
  },
  breakdownRow: {
    display: 'flex',
    justifyContent: 'space-between',
  },
};
