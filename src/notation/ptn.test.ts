import { test, expect, assert } from "vitest"
import { parsePTNData, parseTurn } from "./ptn"
import { Direction, Down, Left, Move, Place, Right, Turn, Up } from "../model/turns"
import { RankNum, Position, FileNum } from "../model/board"
import { CapStone, FlatStone, StandingStone, Stone, StoneType } from "../model/stones"
import dedent from "dedent"

test(`can parse PTN place notations`, () => {
  // Place flat stones at a1:
  expect(parseTurn('a1')).toEqual<Place>(Place(0, 0))

  // Place flat stones at a1:
  expect(parseTurn('Fh8')).toEqual<Place>(Place(7, 7))

  // Place capstone at b4: 
  expect(parseTurn('Cb4')).toEqual<Place>(Place(1, 3, CapStone))

  // Place standing stone at d3:
  expect(parseTurn('Sd3')).toEqual<Place>(Place(3, 2, StandingStone))
})

test(`can parse PTN move notations`, () => {
  // Move a single stone from a1 to b1:
  expect(parseTurn('a1>')).toEqual<Move>(Move(0, 0, Right, [1]))
  
  // Move 4 stones from c3 to d3:
  expect(parseTurn('4c3>')).toEqual<Move>(Move(2, 2, Right, [4]))

  // Move 3 stones from b2, dropping one each on b3, b4, b5:
  expect(parseTurn('3b2+111')).toEqual<Move>(Move(1, 1, Up, [1, 1, 1]))

  // Move 2 stones from d4 to d3:
  expect(parseTurn('2d4-2')).toEqual<Move>(Move(3, 3, Down, [2]))

  // Move 5 stones from e4 toward c4, dropping 2 and then 3 as you move:
  expect(parseTurn('5e4<23')).toEqual<Move>(Move(4, 3, Left, [2, 3]))

  // Move a single stone from a1 to b1 (default count 1, default dropcounts [1]):
  expect(parseTurn('a1>')).toEqual<Move>(Move(0, 0, Right, [1]))
  
  // Move 4 stones from c3 to d3 (all dropped on first square):
  expect(parseTurn('4c3>')).toEqual<Move>(Move(2, 2, Right, [4]))

  // Move 3 stones from b2 up, dropping 1 on each of b3, b4, b5:
  expect(parseTurn('3b2+111')).toEqual<Move>(Move(1, 1, Up, [1, 1, 1]))

  // Move 2 stones from d4 down to d3, dropping both on d3:
  expect(parseTurn('2d4-2')).toEqual<Move>(Move(3, 3, Down, [2]))

  // Move 5 stones from e4 left toward c4, dropping 2 on d4 and 3 on c4:
  expect(parseTurn('5e4<23')).toEqual<Move>(Move(4, 3, Left, [2, 3]))
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

test(`can parse PTN file`, () => {
  const ptnFileContents = dedent`
    [Player1 "Bob"]
    [Player2 "Billy \"Bob\""]
    [Result "R-0"]
    [Size "6"]

    1. a6 f6
    2. {comment1} { comment 2 } d4 c4 { comment 3 }
    3. d3 c3; comment 4
    4. d5 c5 ; comment 5
    5. d2 Ce4
    6. c2 e3
    7. e2 b2
    8. Cb3 1e4<1
    9. 1d3<1 Sd1
    10. a3' 1d1+1
    11. Sd3?! 1d4-*
  `

  const ptnData = parsePTNData(ptnFileContents)

  expect(ptnData.metadata).toEqual({ Player1: 'Bob', Player2: 'Billy "Bob"', Result: 'R-0', Size: '6' })
  
  expect(ptnData.turns.length).toBe(22)

  expect(ptnData.turns[0]).toEqual(Place(0, 5)) // 1. a6
  expect(ptnData.turns[1]).toEqual(Place(5, 5)) // 1. f6
  expect(ptnData.turns[2]).toEqual(Place(3, 3)) // 2. d4
  expect(ptnData.turns[3]).toEqual(Place(2, 3)) // 2. c4
  expect(ptnData.turns[4]).toEqual(Place(3, 2)) // 3. d3
  expect(ptnData.turns[5]).toEqual(Place(2, 2)) // 3. c3
  expect(ptnData.turns[6]).toEqual(Place(3, 4)) // 4. d5
  expect(ptnData.turns[7]).toEqual(Place(2, 4)) // 4. c5
  expect(ptnData.turns[8]).toEqual(Place(3, 1)) // 5. d2
  expect(ptnData.turns[9]).toEqual(Place(4, 3, CapStone)) // 5. Ce4
  expect(ptnData.turns[10]).toEqual(Place(2, 1)) // 6. c2
  expect(ptnData.turns[11]).toEqual(Place(4, 2)) // 6. e3
  expect(ptnData.turns[12]).toEqual(Place(4, 1)) // 7. e2
  expect(ptnData.turns[13]).toEqual(Place(1, 1)) // 7. b2
  expect(ptnData.turns[14]).toEqual(Place(1, 2, CapStone)) // 8. Cb3
  expect(ptnData.turns[15]).toEqual(Move(4, 3, Left, [1])) // 8. 1e4<1
  expect(ptnData.turns[16]).toEqual(Move(3, 2, Left, [1])) // 9. 1d3<1
  expect(ptnData.turns[17]).toEqual(Place(3, 0, StandingStone)) // 9. Sd1
  expect(ptnData.turns[18]).toEqual(Place(0, 2)) // 10. a3'
  expect(ptnData.turns[19]).toEqual(Move(3, 0, Up, [1])) // 10. 1d1+1
  expect(ptnData.turns[20]).toEqual(Place(3, 2, StandingStone)) // 11. Sd3?!
  expect(ptnData.turns[21]).toEqual(Move(3, 3, Down, [1])) // 11. 1d4-*
})

test(`can parse PTN file where Player 1 finishes`, () => {
  const ptnFileContents = dedent`
    [Size "6"]

    1. a6
  `

  const ptnData = parsePTNData(ptnFileContents)

  expect(ptnData.turns.length).toBe(1)
})

test(`rejects PTN file with missing moves`, () => {
  const ptnFileContents = dedent`
    [Size "6"]

    1. a6 f6
    2. d3 { since there's no player 2 move, this must be the last turn }
    3. a1 b2
  `

  expect(() => parsePTNData(ptnFileContents)).toThrow("unexpected turn after last turn")
})

test(`rejects PTN file if incorrectly numbered`, () => {
  const ptnFileContents = dedent`
    [Size "6"]

    1. a6 f6
    3. a1 b2 { wrong line number here }
  `

  expect(() => parsePTNData(ptnFileContents)).toThrow("unexpected round number 3, expected 2")
})

test(`rejects PTN file with garbage at end of file`, () => {
  const ptnFileContents = dedent`
    [Size "6"]

    1. a6
    whoops
  `

  expect(() => parsePTNData(ptnFileContents)).toThrow("invalid round line:\nwhoops")
})
