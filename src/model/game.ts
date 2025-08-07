import { Board, createBoard } from "./board"
import { Player, PlayerNumber } from "./players"

export type Game = {
  board: Board
  reserve: Record<PlayerNumber, Reserve>
  
  /**
   * The player who takes the next turn
   */
  player: PlayerNumber

  /**
   * The number of the next turn (e.g. 1 if the next turn is the first turn of a new game)
   */
  turn: number
}

export type Reserve = {
  stones: number
  capstones: number
}

/**
 * Creates a new Game with an empty board
 */
export function createNewGame(size: number): Game {
  return {
    board: createBoard(size),
    reserve: {
      1: createNewReserve(size),
      2: createNewReserve(size),
    },
    player: Player(1),
    turn: 1,
  }
}

/**
 * Creates the default reserve for a new Game with a given Board size
 */
export function createNewReserve(boardSize: number): Reserve {
  switch (boardSize) {
    case 3: return { stones: 10, capstones: 0 }
    case 4: return { stones: 15, capstones: 0 }
    case 5: return { stones: 21, capstones: 1 }
    case 6: return { stones: 30, capstones: 1 }
    case 7: return { stones: 40, capstones: 2 }
    case 8: return { stones: 50, capstones: 2 }
    default:
      throw new Error(`Unsupported board size: ${boardSize}`)
  }
}
