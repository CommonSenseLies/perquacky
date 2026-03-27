export type GamePhase = 'lobby' | 'playing' | 'results';

export type DieColor = 'black' | 'red';

export interface Die {
  id: number;
  face: string;
  color: DieColor;
}

export interface WordEntry {
  word: string;
  length: number;
  score: number;
}

export interface GroupBonus {
  /** The two consecutive word-length groups that triggered the bonus */
  lengths: [number, number];
  points: number;
  earned: boolean;
}

export interface TurnScore {
  wordEntries: WordEntry[];
  groupBonuses: GroupBonus[];
  subtotal: number;
  penaltyApplied: boolean;
  total: number;
}

export interface Player {
  id: string;
  name: string;
  totalScore: number;
  isVulnerable: boolean;
}

export interface Turn {
  id: string;
  playerId: string;
  dice: Die[];
  /** ISO UTC timestamp when the turn ends */
  endsAt: string;
  words: WordEntry[];
  score: TurnScore | null;
  isActive: boolean;
}

export interface GameState {
  gameId: string;
  gameCode: string;
  phase: GamePhase;
  players: Player[];
  currentTurn: Turn | null;
  round: number;
  winnerId: string | null;
}

/** Events sent from the server via SignalR */
export interface TurnStartedEvent {
  turn: Turn;
}

export interface WordAcceptedEvent {
  word: WordEntry;
  currentWords: WordEntry[];
}

export interface WordRejectedEvent {
  word: string;
  reason: string;
}

export interface TurnEndedEvent {
  playerId: string;
  score: TurnScore;
  updatedPlayers: Player[];
  nextPlayerId: string | null;
}

export interface GameOverEvent {
  winnerId: string;
  finalScores: Player[];
}

/** Bonus definitions — mirrors the server */
export const GROUP_BONUSES: GroupBonus[] = [
  { lengths: [3, 4],  points: 300,  earned: false },
  { lengths: [4, 5],  points: 500,  earned: false },
  { lengths: [5, 6],  points: 600,  earned: false },
  { lengths: [6, 7],  points: 1200, earned: false },
  { lengths: [7, 8],  points: 1850, earned: false },
];

export const MAX_WORDS_PER_LENGTH = 5;
export const MIN_WORD_LENGTH = 3;
export const MAX_WORD_LENGTH = 10;
export const VULNERABLE_THRESHOLD = 2000;
export const VULNERABLE_MIN_SCORE = 500;
export const VULNERABLE_PENALTY = -500;
export const WIN_SCORE = 5000;
