import { Position } from "./board.ts"
import { StoneType } from "./stones"

export type Turn = Move | Place

export type Place = {
  type: 'place'
  stone: StoneType
  position: Position
}

export type Move = {
  type: 'move'
  fromPosition: Position
  direction: Direction
  dropcounts: number[]
}

export const Up = '+'
export const Down = '-'
export const Left = '<'
export const Right = '>'

export type Up = typeof Up
export type Down = typeof Down
export type Left = typeof Left
export type Right = typeof Right

export type Direction = Up | Down | Left | Right
