import { Game } from "./game";

export const GameErrorType = {
  OutOfBounds: 'OutOfBounds',
  MustPlaceFlat: 'MustPlaceFlat',
  SquareOccupied: 'SquareOccupied',
  NoReserve: 'NoReserve',
  NoCapstones: 'NoCapstones',
  UnsupportedTurn: 'UnsupportedTurn',
  InvalidDirection: 'InvalidDirection',
  NoStonesToPickUp: 'NoStonesToPickUp',
  NotOwner: 'NotOwner',
  InvalidDropCount: 'InvalidDropCount',
  NoStonesLeft: 'NoStonesLeft',
  CarryLimitExceeded: 'CarryLimitExceeded',
  DropOnNonFlat: 'DropOnNonFlat',
} as const;

export type GameErrorType = typeof GameErrorType[keyof typeof GameErrorType];

export interface GameError {
  type: 'error';
  errorType: GameErrorType;
  message: string;
  context?: Record<string, any>;
}

export type PlayResult = Game | GameError;

export function check(result: PlayResult): Game {
  if ((result as any).type === 'error') {
    throw new Error((result as any).message);
  }
  return result as Game;
}
