const BASE = '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  return res.json() as Promise<T>;
}

export interface CreateGameResponse {
  gameId: string;
  joinCode: string;
}

export interface JoinGameResponse {
  gameId: string;
  playerId: string;
}

export const apiService = {
  createGame: (playerName: string) =>
    request<CreateGameResponse>('/games', {
      method: 'POST',
      body: JSON.stringify({ playerName }),
    }),

  joinGame: (joinCode: string, playerName: string) =>
    request<JoinGameResponse>(`/games/${joinCode}/join`, {
      method: 'POST',
      body: JSON.stringify({ playerName }),
    }),

  startGame: (gameId: string) =>
    request<void>(`/games/${gameId}/start`, { method: 'POST' }),

  submitWord: (gameId: string, turnId: string, word: string) =>
    request<void>(`/games/${gameId}/turns/${turnId}/words`, {
      method: 'POST',
      body: JSON.stringify({ word }),
    }),

  endTurn: (gameId: string, turnId: string) =>
    request<void>(`/games/${gameId}/turns/${turnId}/end`, { method: 'POST' }),
};
