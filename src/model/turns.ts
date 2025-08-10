import { Position } from "./board"
import { FlatStone, StoneType } from "./stones"

export type Turn = Move | Place

export type Place = {
  type: 'place'
  stone: StoneType
  position: Position
}

export const Place = (rank: number, file: number, stone: StoneType = FlatStone): Place =>
  ({ type: 'place', stone, position: Position(rank, file) })

export type Move = {
  type: 'move'
  fromPosition: Position
  direction: Direction
  dropcounts: number[]
}

export const Move = (rank: number, file: number, direction: Direction, dropcounts: number[]): Move =>
  ({ type: 'move', fromPosition: Position(rank, file), direction, dropcounts })

export const Up = '+'
export const Down = '-'
export const Left = '<'
export const Right = '>'

export type Up = typeof Up
export type Down = typeof Down
export type Left = typeof Left
export type Right = typeof Right

export type Direction = Up | Down | Left | Right
