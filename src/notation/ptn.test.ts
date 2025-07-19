import { test, expect, assert } from "vitest"
import { parseTurn } from "./ptn"
import { Direction, Down, Left, Move, Place, Right, Turn, Up } from "../model/turns"
import { RankNum, Position, FileNum } from "../model/board"
import { CapStone, FlatStone, StandingStone, Stone, StoneType } from "../model/stones"

const position = (file: number, rank: number): Position =>
  ({ file: file as FileNum, rank: rank as RankNum })

const place = (file: number, rank: number, stone: StoneType = FlatStone): Place =>
  ({ type: 'place', stone, position: position(file, rank) })

const move = (file: number, rank: number, direction: Direction, dropcounts: number[]): Move =>
  ({ type: 'move', fromPosition: position(file, rank), direction, dropcounts })

test(`can parse PTN place notations`, () => {
  // Place flat stones at a1:
  expect(parseTurn('a1')).toEqual<Place>(place(0, 0))

  // Place flat stones at a1:
  expect(parseTurn('Fh8')).toEqual<Place>(place(7, 7))

  // Place capstone at b4: 
  expect(parseTurn('Cb4')).toEqual<Place>(place(1, 3, CapStone))

  // Place standing stone at d3:
  expect(parseTurn('Sd3')).toEqual<Place>(place(3, 2, StandingStone))
})

test(`can parse PTN move notations`, () => {
  // Move a single stone from a1 to b1:
  expect(parseTurn('a1>')).toEqual<Move>(move(0, 0, Right, [1]))
  
  // Move 4 stones from c3 to d3:
  expect(parseTurn('4c3>')).toEqual<Move>(move(2, 2, Right, [4]))

  // Move 3 stones from b2, dropping one each on b3, b4, b5:
  expect(parseTurn('3b2+111')).toEqual<Move>(move(1, 1, Up, [1, 1, 1]))

  // Move 2 stones from d4 to d3:
  expect(parseTurn('2d4-2')).toEqual<Move>(move(3, 3, Down, [2]))

  // Move 5 stones from e4 toward c4, dropping 2 and then 3 as you move:
  expect(parseTurn('5e4<23')).toEqual<Move>(move(4, 3, Left, [2, 3]))
})

test('rejects invalid PTN notations', () => {
  // Invalid file (i is not a valid file)
  expect(() => parseTurn('ai1')).toThrow()
  // Invalid rank (9 is not a valid rank)
  expect(() => parseTurn('a9')).toThrow()
  // Invalid file (uppercase)
  expect(() => parseTurn('Aa1')).toThrow()
  // Invalid stone type (lowercase)
  expect(() => parseTurn('fa1')).toThrow()
  // Invalid stone type (not F/S/C)
  expect(() => parseTurn('Xa1')).toThrow()
  // Missing file
  expect(() => parseTurn('F1')).toThrow()
  // Missing rank
  expect(() => parseTurn('Fa')).toThrow()
  // Only direction
  expect(() => parseTurn('>')).toThrow()
  // Only count
  expect(() => parseTurn('2')).toThrow()
  // Invalid direction
  expect(() => parseTurn('a1x')).toThrow()
  // Dropcounts with non-digits
  expect(() => parseTurn('a1>1a')).toThrow()
  // Extra/invalid characters (marks)
  expect(() => parseTurn('a1!')).toThrow()
  expect(() => parseTurn('a1*')).toThrow()
  expect(() => parseTurn('a1?')).toThrow()
  expect(() => parseTurn('a1\'')).toThrow()
  // Extra/invalid characters (comments)
  expect(() => parseTurn('a1 {comment}')).toThrow()
  // Extra/invalid characters (result notation)
  expect(() => parseTurn('a1 R-0')).toThrow()
  // Empty string
  expect(() => parseTurn('')).toThrow()
  // Whitespace only
  expect(() => parseTurn('   ')).toThrow()
  // Topstone in place notation (not allowed)
  expect(() => parseTurn('a1S')).toThrow()
  // Too many fields
  expect(() => parseTurn('2Fa1>11S')).toThrow()
  // Dropcounts without direction
  expect(() => parseTurn('a1 1')).toThrow()
  // Direction without square
  expect(() => parseTurn('>1')).toThrow()
  // Count but missing square
  expect(() => parseTurn('2>')).toThrow()
})
