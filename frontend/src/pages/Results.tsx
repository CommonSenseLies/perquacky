import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { Player } from '../types/game';

interface ResultsState {
  players: Player[];
  winnerId: string;
}

export function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as ResultsState | null;

  if (!state) {
    navigate('/');
    return null;
  }

  const { players, winnerId } = state;
  const sorted = [...players].sort((a, b) => b.totalScore - a.totalScore);
  const winner = players.find((p) => p.id === winnerId);

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Game Over</h1>
      {winner && <p style={styles.winner}>{winner.name} wins!</p>}

      <div style={styles.podium}>
        {sorted.map((player, i) => (
          <div
            key={player.id}
            style={{
              ...styles.row,
              background: player.id === winnerId ? '#fef9e7' : '#fff',
              borderColor: player.id === winnerId ? '#f39c12' : '#ecf0f1',
            }}
          >
            <span style={styles.rank}>
              {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
            </span>
            <span style={styles.name}>{player.name}</span>
            {player.isVulnerable && <span style={styles.vuln}>V</span>}
            <span style={styles.score}>{player.totalScore.toLocaleString()}</span>
          </div>
        ))}
      </div>

      <button style={styles.playAgain} onClick={() => navigate('/')}>
        Play Again
      </button>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f4f6f7',
    fontFamily: 'sans-serif',
    padding: '2rem',
    gap: '1.5rem',
  },
  title: {
    fontSize: '2.5rem',
    margin: 0,
    color: '#2c3e50',
  },
  winner: {
    fontSize: '1.4rem',
    color: '#27ae60',
    margin: 0,
    fontWeight: 'bold',
  },
  podium: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    width: '100%',
    maxWidth: '400px',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 1rem',
    border: '2px solid',
    borderRadius: '8px',
    fontSize: '1rem',
  },
  rank: {
    width: '2rem',
    textAlign: 'center',
    fontSize: '1.3rem',
  },
  name: {
    flex: 1,
    fontWeight: 500,
  },
  vuln: {
    background: '#c0392b',
    color: '#fff',
    fontSize: '0.65rem',
    fontWeight: 'bold',
    padding: '1px 4px',
    borderRadius: '3px',
  },
  score: {
    fontVariantNumeric: 'tabular-nums',
    fontWeight: 'bold',
    fontSize: '1.1rem',
  },
  playAgain: {
    padding: '0.75rem 2.5rem',
    fontSize: '1rem',
    background: '#2980b9',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};
