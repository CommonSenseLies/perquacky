import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/apiService';
import { signalRService } from '../services/signalRService';

export function Lobby() {
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [mode, setMode] = useState<'create' | 'join'>('create');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signalRService.connect();

      if (mode === 'create') {
        const { gameId } = await apiService.createGame(playerName);
        navigate(`/game/${gameId}`);
      } else {
        const { gameId, playerId } = await apiService.joinGame(joinCode.trim(), playerName);
        navigate(`/game/${gameId}`, { state: { playerId } });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
      await signalRService.disconnect();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Perquacky</h1>
      <p style={styles.subtitle}>A classic word dice game</p>

      <div style={styles.card}>
        <div style={styles.tabs}>
          <button
            style={{ ...styles.tab, ...(mode === 'create' ? styles.tabActive : {}) }}
            onClick={() => setMode('create')}
          >
            New Game
          </button>
          <button
            style={{ ...styles.tab, ...(mode === 'join' ? styles.tabActive : {}) }}
            onClick={() => setMode('join')}
          >
            Join Game
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            Your name
            <input
              style={styles.input}
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name"
              required
              maxLength={20}
            />
          </label>

          {mode === 'join' && (
            <label style={styles.label}>
              Game code
              <input
                style={styles.input}
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder="Enter game code"
                required
              />
            </label>
          )}

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" style={styles.submitButton} disabled={loading}>
            {loading ? 'Connecting...' : mode === 'create' ? 'Create Game' : 'Join Game'}
          </button>
        </form>
      </div>
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
    padding: '1rem',
  },
  title: {
    fontSize: '3rem',
    fontWeight: 'bold',
    margin: 0,
    color: '#2c3e50',
  },
  subtitle: {
    color: '#7f8c8d',
    margin: '0.25rem 0 2rem',
  },
  card: {
    background: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
    padding: '2rem',
    width: '100%',
    maxWidth: '360px',
  },
  tabs: {
    display: 'flex',
    marginBottom: '1.5rem',
    borderBottom: '2px solid #ecf0f1',
  },
  tab: {
    flex: 1,
    padding: '0.6rem',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    fontSize: '0.95rem',
    color: '#7f8c8d',
    borderBottom: '2px solid transparent',
    marginBottom: '-2px',
  },
  tabActive: {
    color: '#2980b9',
    borderBottomColor: '#2980b9',
    fontWeight: 'bold',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.3rem',
    fontSize: '0.9rem',
    color: '#2c3e50',
    fontWeight: 500,
  },
  input: {
    padding: '0.5rem 0.75rem',
    fontSize: '1rem',
    borderRadius: '4px',
    border: '1px solid #bdc3c7',
  },
  error: {
    color: '#c0392b',
    fontSize: '0.9rem',
    margin: 0,
  },
  submitButton: {
    padding: '0.7rem',
    background: '#2980b9',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '0.5rem',
  },
};
