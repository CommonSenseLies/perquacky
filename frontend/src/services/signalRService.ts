import * as signalR from '@microsoft/signalr';
import type {
  GameState,
  TurnStartedEvent,
  WordAcceptedEvent,
  WordRejectedEvent,
  TurnEndedEvent,
  GameOverEvent,
} from '../types/game';

export type SignalREventMap = {
  GameStateUpdated: (state: GameState) => void;
  TurnStarted: (event: TurnStartedEvent) => void;
  WordAccepted: (event: WordAcceptedEvent) => void;
  WordRejected: (event: WordRejectedEvent) => void;
  TurnEnded: (event: TurnEndedEvent) => void;
  GameOver: (event: GameOverEvent) => void;
};

class SignalRService {
  private connection: signalR.HubConnection | null = null;

  async connect(): Promise<void> {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl('/hubs/perquacky')
      .withAutomaticReconnect()
      .build();

    await this.connection.start();
  }

  async disconnect(): Promise<void> {
    await this.connection?.stop();
    this.connection = null;
  }

  on<K extends keyof SignalREventMap>(
    event: K,
    handler: SignalREventMap[K]
  ): void {
    this.connection?.on(event, handler as (...args: unknown[]) => void);
  }

  off<K extends keyof SignalREventMap>(
    event: K,
    handler: SignalREventMap[K]
  ): void {
    this.connection?.off(event, handler as (...args: unknown[]) => void);
  }

  async joinGame(gameId: string, playerId: string): Promise<void> {
    await this.connection?.invoke('JoinGame', gameId, playerId);
  }
}

export const signalRService = new SignalRService();
