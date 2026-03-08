import React, { useCallback, useState } from 'react';
import { DiceTray } from '../components/DiceTray';
import { WordInput } from '../components/WordInput';
import { WordList } from '../components/WordList';
import { CountdownTimer } from '../components/CountdownTimer';
import { ScoreCard } from '../components/ScoreCard';
import { GroupBonusTracker } from '../components/GroupBonusTracker';
import { PlayerRail } from '../components/PlayerRail';
import type { GameState, WordEntry, WordRejectedEvent } from '../types/game';

const MOCK_PLAYER_ID = 'p1';

const MOCK_STATE: GameState = {
  gameId: 'dev',
  phase: 'playing',
  round: 2,
  winnerId: null,
  players: [
    { id: 'p1', name: 'You', totalScore: 1850, isVulnerable: false },
    { id: 'p2', name: 'Alice', totalScore: 2400, isVulnerable: true },
    { id: 'p3', name: 'Bob', totalScore: 750, isVulnerable: false },
  ],
  currentTurn: {
    playerId: MOCK_PLAYER_ID,
    isActive: true,
    endsAt: new Date(Date.now() + 2.5 * 60 * 1000).toISOString(),
    dice: [
      { id: 1, face: 'M', color: 'black' },
      { id: 2, face: 'E', color: 'black' },
      { id: 3, face: 'T', color: 'black' },
      { id: 4, face: 'S', color: 'black' },
      { id: 5, face: 'R', color: 'black' },
      { id: 6, face: 'O', color: 'black' },
      { id: 7, face: 'L', color: 'black' },
      { id: 8, face: 'A', color: 'black' },
      { id: 9, face: 'N', color: 'black' },
      { id: 10, face: 'I', color: 'black' },
      { id: 11, face: 'B', color: 'red' },
      { id: 12, face: 'K', color: 'red' },
      { id: 13, face: 'S', color: 'red' },
    ],
    words: [
      { word: 'STORE', length: 5, score: 50 },
      { word: 'MOLES', length: 5, score: 50 },
      { word: 'TRAIN', length: 5, score: 50 },
      { word: 'TOAST', length: 5, score: 50 },
      { word: 'STERN', length: 5, score: 50 },
      { word: 'RETAIN', length: 6, score: 75 },
      { word: 'MOLTEN', length: 6, score: 75 },
    ],
    score: null,
  },
};

export function DevBoard() {
  const [words, setWords] = useState<WordEntry[]>(MOCK_STATE.currentTurn!.words);
  const [lastRejection, setLastRejection] = useState<WordRejectedEvent | null>(null);

  const handleWordSubmit = useCallback((word: string) => {
    const upper = word.toUpperCase();
    if (words.some((w) => w.word === upper)) {
      setLastRejection({ word: upper, reason: 'Already played' });
      return;
    }
    if (words.filter((w) => w.length === upper.length).length >= 5) {
      setLastRejection({ word: upper, reason: 'Group full (5 words max per length)' });
      return;
    }
    const entry: WordEntry = { word: upper, length: upper.length, score: upper.length * 10 };
    setWords((prev) => [...prev, entry]);
    setLastRejection(null);
  }, [words]);

  const turn = { ...MOCK_STATE.currentTurn!, words };
  const localPlayer = MOCK_STATE.players[0];

  return (
    <div style={styles.page}>
      <aside style={styles.sidebar}>
        <h2 style={styles.logo}>Perquacky <span style={styles.devBadge}>DEV</span></h2>
        <PlayerRail
          players={MOCK_STATE.players}
          currentPlayerId={MOCK_PLAYER_ID}
          localPlayerId={MOCK_PLAYER_ID}
        />
        <GroupBonusTracker words={words} isVulnerable={localPlayer.isVulnerable} />
      </aside>

      <main style={styles.main}>
        <div style={styles.topBar}>
          <CountdownTimer endsAt={turn.endsAt} onExpired={() => {}} />
          <ScoreCard player={localPlayer} turnScore={null} isCurrentTurn={true} />
        </div>
        <DiceTray dice={turn.dice} />
        <WordInput onSubmit={handleWordSubmit} disabled={false} lastRejection={lastRejection} />
        <WordList words={words} isVulnerable={localPlayer.isVulnerable} />
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { display: 'flex', minHeight: '100vh', background: '#f4f6f7', fontFamily: 'sans-serif' },
  sidebar: {
    width: '220px', flexShrink: 0, background: '#2c3e50', color: '#ecf0f1',
    padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1.5rem',
  },
  logo: { margin: 0, fontSize: '1.4rem', color: '#fff', letterSpacing: '0.05em' },
  devBadge: {
    fontSize: '0.65rem', background: '#e74c3c', color: '#fff',
    padding: '2px 5px', borderRadius: '3px', verticalAlign: 'middle', marginLeft: '4px',
  },
  main: { flex: 1, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '900px' },
  topBar: { display: 'flex', alignItems: 'flex-start', gap: '1.5rem', flexWrap: 'wrap' },
};
