import { Board } from "./board"
import { PlayerNumber } from "./players"

export type Game = {
  activePlayer: PlayerNumber
  board: Board
  reserve: Record<PlayerNumber, Reserve>
}

export type Reserve = {
  stones: number
  capstones: number
}
