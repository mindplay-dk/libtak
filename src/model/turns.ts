import { Position } from "./board.ts"
import { StoneType } from "./stones"

type Turn = Move | Place

type Place = {
  type: 'place'
  stone: StoneType
  position: Position
}

type Move = {
  type: 'move'
  square: Position
  direction: Direction
  drops: number[]
}

type Up = '+'
type Down = '-'
type Left = '<'
type Right = '>'

type Direction = Up | Down | Left | Right
