import React, { useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useGameState } from '../hooks/useGameState';
import { apiService } from '../services/apiService';
import { DiceTray } from '../components/DiceTray';
import { WordInput } from '../components/WordInput';
import { WordList } from '../components/WordList';
import { CountdownTimer } from '../components/CountdownTimer';
import { ScoreCard } from '../components/ScoreCard';
import { GroupBonusTracker } from '../components/GroupBonusTracker';
import { PlayerRail } from '../components/PlayerRail';

export function GameBoard() {
  const { gameId } = useParams<{ gameId: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  // playerId is set in location state when joining; creator gets it from GameStateUpdated
  const localPlayerId: string | null = (location.state as { playerId?: string })?.playerId ?? null;

  const { gameState, lastRejection } = useGameState(gameId ?? null, localPlayerId);

  const turn = gameState?.currentTurn ?? null;
  const isMyTurn = turn?.playerId === localPlayerId && turn?.isActive;
  const localPlayer = gameState?.players.find((p) => p.id === localPlayerId) ?? null;

  const handleWordSubmit = useCallback(
    async (word: string) => {
      if (!gameId || !turn) return;
      try {
        await apiService.submitWord(gameId, turn.playerId, word);
      } catch {
        // rejection handled via SignalR WordRejected event
      }
    },
    [gameId, turn]
  );

  const handleTimerExpired = useCallback(async () => {
    // Server is authoritative — client just signals readiness; server ends the turn
  }, []);

  const handleStartGame = async () => {
    if (!gameId) return;
    await apiService.startGame(gameId);
  };

  // Redirect to results when game is over
  React.useEffect(() => {
    if (gameState?.phase === 'results') {
      navigate(`/results/${gameId}`, { state: { players: gameState.players, winnerId: gameState.winnerId } });
    }
  }, [gameState?.phase, gameId, navigate, gameState?.players, gameState?.winnerId]);

  if (!gameState) {
    return <div style={styles.loading}>Connecting to game...</div>;
  }

  return (
    <div style={styles.page}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <h2 style={styles.logo}>Perquacky</h2>
        <PlayerRail
          players={gameState.players}
          currentPlayerId={turn?.playerId ?? null}
          localPlayerId={localPlayerId}
        />
        {localPlayer && (
          <GroupBonusTracker
            words={turn?.words ?? []}
            isVulnerable={localPlayer.isVulnerable}
          />
        )}
      </aside>

      {/* Main area */}
      <main style={styles.main}>
        {gameState.phase === 'lobby' && (
          <div style={styles.lobbyWaiting}>
            <p>Waiting for players... ({gameState.players.length} joined)</p>
            <button style={styles.startButton} onClick={handleStartGame}>
              Start Game
            </button>
          </div>
        )}

        {gameState.phase === 'playing' && turn && (
          <>
            <div style={styles.topBar}>
              <CountdownTimer endsAt={turn.endsAt} onExpired={handleTimerExpired} />
              {localPlayer && (
                <ScoreCard
                  player={localPlayer}
                  turnScore={turn.isActive ? null : turn.score}
                  isCurrentTurn={isMyTurn}
                />
              )}
            </div>

            <DiceTray dice={turn.dice} />

            {isMyTurn && (
              <WordInput
                onSubmit={handleWordSubmit}
                disabled={!isMyTurn}
                lastRejection={lastRejection}
              />
            )}

            {!isMyTurn && (
              <p style={styles.waitingText}>
                Waiting for{' '}
                <strong>
                  {gameState.players.find((p) => p.id === turn.playerId)?.name ?? 'player'}
                </strong>{' '}
                to finish their turn...
              </p>
            )}

            <WordList
              words={turn.words}
              isVulnerable={localPlayer?.isVulnerable ?? false}
            />
          </>
        )}
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    display: 'flex',
    minHeight: '100vh',
    background: '#f4f6f7',
    fontFamily: 'sans-serif',
  },
  sidebar: {
    width: '220px',
    flexShrink: 0,
    background: '#2c3e50',
    color: '#ecf0f1',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  logo: {
    margin: 0,
    fontSize: '1.4rem',
    color: '#fff',
    letterSpacing: '0.05em',
  },
  main: {
    flex: 1,
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    maxWidth: '900px',
  },
  topBar: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1.5rem',
    flexWrap: 'wrap',
  },
  lobbyWaiting: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    marginTop: '4rem',
  },
  startButton: {
    padding: '0.75rem 2rem',
    fontSize: '1.1rem',
    background: '#27ae60',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  waitingText: {
    color: '#7f8c8d',
    fontStyle: 'italic',
  },
  loading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    fontSize: '1.2rem',
    color: '#7f8c8d',
  },
};
