import { useEffect, useReducer, useCallback } from 'react';
import { signalRService } from '../services/signalRService';
import type {
  GameState,
  TurnStartedEvent,
  WordAcceptedEvent,
  WordRejectedEvent,
  TurnEndedEvent,
  GameOverEvent,
} from '../types/game';

type Action =
  | { type: 'STATE_UPDATED'; payload: GameState }
  | { type: 'TURN_STARTED'; payload: TurnStartedEvent }
  | { type: 'WORD_ACCEPTED'; payload: WordAcceptedEvent }
  | { type: 'WORD_REJECTED'; payload: WordRejectedEvent }
  | { type: 'TURN_ENDED'; payload: TurnEndedEvent }
  | { type: 'GAME_OVER'; payload: GameOverEvent };

function reducer(state: GameState | null, action: Action): GameState | null {
  switch (action.type) {
    case 'STATE_UPDATED':
      return action.payload;

    case 'TURN_STARTED':
      if (!state) return state;
      return { ...state, currentTurn: action.payload.turn };

    case 'WORD_ACCEPTED':
      if (!state?.currentTurn) return state;
      return {
        ...state,
        currentTurn: {
          ...state.currentTurn,
          words: action.payload.currentWords,
        },
      };

    case 'WORD_REJECTED':
      // Rejection is handled via UI feedback; state unchanged
      return state;

    case 'TURN_ENDED':
      if (!state) return state;
      return {
        ...state,
        players: action.payload.updatedPlayers,
        currentTurn: state.currentTurn
          ? { ...state.currentTurn, isActive: false, score: action.payload.score }
          : null,
      };

    case 'GAME_OVER':
      if (!state) return state;
      return {
        ...state,
        phase: 'results',
        winnerId: action.payload.winnerId,
        players: action.payload.finalScores,
      };

    default:
      return state;
  }
}

export interface UseGameStateResult {
  gameState: GameState | null;
  lastRejection: WordRejectedEvent | null;
}

export function useGameState(
  gameId: string | null,
  playerId: string | null
): UseGameStateResult {
  const [gameState, dispatch] = useReducer(reducer, null);
  const [lastRejection, setLastRejection] = useReducerShim<WordRejectedEvent | null>(null);

  useEffect(() => {
    if (!gameId || !playerId) return;

    let mounted = true;

    const onStateUpdated = (s: GameState) =>
      mounted && dispatch({ type: 'STATE_UPDATED', payload: s });
    const onTurnStarted = (e: TurnStartedEvent) =>
      mounted && dispatch({ type: 'TURN_STARTED', payload: e });
    const onWordAccepted = (e: WordAcceptedEvent) =>
      mounted && dispatch({ type: 'WORD_ACCEPTED', payload: e });
    const onWordRejected = (e: WordRejectedEvent) => {
      if (mounted) {
        dispatch({ type: 'WORD_REJECTED', payload: e });
        setLastRejection(e);
      }
    };
    const onTurnEnded = (e: TurnEndedEvent) =>
      mounted && dispatch({ type: 'TURN_ENDED', payload: e });
    const onGameOver = (e: GameOverEvent) =>
      mounted && dispatch({ type: 'GAME_OVER', payload: e });

    signalRService.on('GameStateUpdated', onStateUpdated);
    signalRService.on('TurnStarted', onTurnStarted);
    signalRService.on('WordAccepted', onWordAccepted);
    signalRService.on('WordRejected', onWordRejected);
    signalRService.on('TurnEnded', onTurnEnded);
    signalRService.on('GameOver', onGameOver);

    signalRService.joinGame(gameId, playerId).catch(console.error);

    return () => {
      mounted = false;
      signalRService.off('GameStateUpdated', onStateUpdated);
      signalRService.off('TurnStarted', onTurnStarted);
      signalRService.off('WordAccepted', onWordAccepted);
      signalRService.off('WordRejected', onWordRejected);
      signalRService.off('TurnEnded', onTurnEnded);
      signalRService.off('GameOver', onGameOver);
    };
  }, [gameId, playerId]);

  return { gameState, lastRejection };
}

// Minimal local state shim to avoid importing useState alongside useReducer
function useReducerShim<T>(initial: T): [T, (v: T) => void] {
  const [state, dispatch] = useReducer((_: T, action: T) => action, initial);
  const set = useCallback((v: T) => dispatch(v), []);
  return [state, set];
}
