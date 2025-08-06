import { Position } from "./board.ts"
import { FlatStone, StoneType } from "./stones"

export type Turn = Move | Place

export type Place = {
  type: 'place'
  stone: StoneType
  position: Position
}

export const Place = (file: number, rank: number, stone: StoneType = FlatStone): Place =>
  ({ type: 'place', stone, position: Position(file, rank) })

export type Move = {
  type: 'move'
  fromPosition: Position
  direction: Direction
  dropcounts: number[]
}

export const Move = (file: number, rank: number, direction: Direction, dropcounts: number[]): Move =>
  ({ type: 'move', fromPosition: Position(file, rank), direction, dropcounts })

export const Up = '+'
export const Down = '-'
export const Left = '<'
export const Right = '>'

export type Up = typeof Up
export type Down = typeof Down
export type Left = typeof Left
export type Right = typeof Right

export type Direction = Up | Down | Left | Right
