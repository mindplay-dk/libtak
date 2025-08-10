import { test, expect } from "vitest"
import dedent from "dedent"

import { createPTNData, parsePTNData, parseTurn } from "./ptn"
import { Down, Left, Move, Place, Right, Up } from "../model/turns"
import { CapStone, StandingStone } from "../model/stones"

test(`can parse PTN place notations`, () => {
  // Place flat stones in all corners:
  expect(parseTurn(5, 'a5')).toEqual<Place>(Place(0, 0))
  expect(parseTurn(5, 'e5')).toEqual<Place>(Place(0, 4))
  expect(parseTurn(5, 'a1')).toEqual<Place>(Place(4, 0))
  expect(parseTurn(5, 'e1')).toEqual<Place>(Place(4, 4))

  // Place flat stones at h8:
  expect(parseTurn(8, 'Fh8')).toEqual<Place>(Place(0, 7))

  // Place capstone at b4: 
  expect(parseTurn(5, 'Cb4')).toEqual<Place>(Place(1, 1, CapStone))

  // Place standing stone at d3:
  expect(parseTurn(5, 'Sd3')).toEqual<Place>(Place(2, 3, StandingStone))
})

test(`rejects out-of-bounds PTN placements`, () => {
  // Rank out of bounds
  expect(() => parseTurn(5, 'a6')).toThrow("rank 6 is out of bounds on a 5x5 board")
  // File out of bounds
  expect(() => parseTurn(5, 'f1')).toThrow("file f is out of bounds on a 5x5 board")
})

test(`can parse PTN move notations`, () => {
  // Move a single stone from a1 to b1:
  expect(parseTurn(5, 'a1>')).toEqual<Move>(Move(4, 0, Right, [1]))
  
  // Move 4 stones from c3 to d3:
  expect(parseTurn(5, '4c3>')).toEqual<Move>(Move(2, 2, Right, [4]))

  // Move 3 stones from b2, dropping one each on b3, b4, b5:
  expect(parseTurn(5, '3b2+111')).toEqual<Move>(Move(3, 1, Up, [1, 1, 1]))

  // Move 2 stones from d4 to d3:
  expect(parseTurn(5, '2d4-2')).toEqual<Move>(Move(1, 3, Down, [2]))

  // Move 5 stones from e4 toward c4, dropping 2 and then 3 as you move:
  expect(parseTurn(5, '5e4<23')).toEqual<Move>(Move(1, 4, Left, [2, 3]))

  // Move a single stone from a1 to b1 (default count 1, default dropcounts [1]):
  expect(parseTurn(5, 'a1>')).toEqual<Move>(Move(4, 0, Right, [1]))
  
  // Move 4 stones from c3 to d3 (all dropped on first square):
  expect(parseTurn(5, '4c3>')).toEqual<Move>(Move(2, 2, Right, [4]))

  // Move 3 stones from b2 up, dropping 1 on each of b3, b4, b5:
  expect(parseTurn(5, '3b2+111')).toEqual<Move>(Move(3, 1, Up, [1, 1, 1]))

  // Move 2 stones from d4 down to d3, dropping both on d3:
  expect(parseTurn(5, '2d4-2')).toEqual<Move>(Move(1, 3, Down, [2]))

  // Move 5 stones from e4 left toward c4, dropping 2 on d4 and 3 on c4:
  expect(parseTurn(5, '5e4<23')).toEqual<Move>(Move(1, 4, Left, [2, 3]))
})

test('rejects invalid PTN notations', () => {
  // Invalid file (i is not a valid file)
  expect(() => parseTurn(6, 'ai1')).toThrow()
  // Invalid rank (9 is not a valid rank)
  expect(() => parseTurn(6, 'a9')).toThrow()
  // Invalid file (uppercase)
  expect(() => parseTurn(6, 'Aa1')).toThrow()
  // Invalid stone type (lowercase)
  expect(() => parseTurn(6, 'fa1')).toThrow()
  // Invalid stone type (not F/S/C)
  expect(() => parseTurn(6, 'Xa1')).toThrow()
  // Missing file
  expect(() => parseTurn(6, 'F1')).toThrow()
  // Missing rank
  expect(() => parseTurn(6, 'Fa')).toThrow()
  // Only direction
  expect(() => parseTurn(6, '>')).toThrow()
  // Only count
  expect(() => parseTurn(6, '2')).toThrow()
  // Invalid direction
  expect(() => parseTurn(6, 'a1x')).toThrow()
  // Dropcounts with non-digits
  expect(() => parseTurn(6, 'a1>1a')).toThrow()
  // Extra/invalid characters (marks)
  expect(() => parseTurn(6, 'a1!')).toThrow()
  expect(() => parseTurn(6, 'a1*')).toThrow()
  expect(() => parseTurn(6, 'a1?')).toThrow()
  expect(() => parseTurn(6, 'a1\'')).toThrow()
  // Extra/invalid characters (comments)
  expect(() => parseTurn(6, 'a1 {comment}')).toThrow()
  // Extra/invalid characters (result notation)
  expect(() => parseTurn(6, 'a1 R-0')).toThrow()
  // Empty string
  expect(() => parseTurn(6, '')).toThrow()
  // Whitespace only
  expect(() => parseTurn(6, '   ')).toThrow()
  // Topstone in place notation (not allowed)
  expect(() => parseTurn(6, 'a1S')).toThrow()
  // Too many fields
  expect(() => parseTurn(6, '2Fa1>11S')).toThrow()
  // Dropcounts without direction
  expect(() => parseTurn(6, 'a1 1')).toThrow()
  // Direction without square
  expect(() => parseTurn(6, '>1')).toThrow()
  // Count but missing square
  expect(() => parseTurn(6, '2>')).toThrow()
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

  expect(ptnData.metadata.values).toEqual({ Player1: 'Bob', Player2: 'Billy "Bob"', Result: 'R-0', Size: '6' })
  expect(ptnData.metadata.get('sIzE')).toBe('6')
  
  expect(ptnData.turns.length).toBe(22)

  expect(ptnData.turns[0]).toEqual(Place(0, 0)) // 1. a6
  expect(ptnData.turns[1]).toEqual(Place(0, 5)) // 1. f6
  expect(ptnData.turns[2]).toEqual(Place(2, 3)) // 2. d4
  expect(ptnData.turns[3]).toEqual(Place(2, 2)) // 2. c4
  expect(ptnData.turns[4]).toEqual(Place(3, 3)) // 3. d3
  expect(ptnData.turns[5]).toEqual(Place(3, 2)) // 3. c3
  expect(ptnData.turns[6]).toEqual(Place(1, 3)) // 4. d5
  expect(ptnData.turns[7]).toEqual(Place(1, 2)) // 4. c5
  expect(ptnData.turns[8]).toEqual(Place(4, 3)) // 5. d2
  expect(ptnData.turns[9]).toEqual(Place(2, 4, CapStone)) // 5. Ce4
  expect(ptnData.turns[10]).toEqual(Place(4, 2)) // 6. c2
  expect(ptnData.turns[11]).toEqual(Place(3, 4)) // 6. e3
  expect(ptnData.turns[12]).toEqual(Place(4, 4)) // 7. e2
  expect(ptnData.turns[13]).toEqual(Place(4, 1)) // 7. b2
  expect(ptnData.turns[14]).toEqual(Place(3, 1, CapStone)) // 8. Cb3
  expect(ptnData.turns[15]).toEqual(Move(2, 4, Left, [1])) // 8. 1e4<1
  expect(ptnData.turns[16]).toEqual(Move(3, 3, Left, [1])) // 9. 1d3<1
  expect(ptnData.turns[17]).toEqual(Place(5, 3, StandingStone)) // 9. Sd1
  expect(ptnData.turns[18]).toEqual(Place(3, 0)) // 10. a3'
  expect(ptnData.turns[19]).toEqual(Move(5, 3, Up, [1])) // 10. 1d1+1
  expect(ptnData.turns[20]).toEqual(Place(3, 3, StandingStone)) // 11. Sd3?!
  expect(ptnData.turns[21]).toEqual(Move(2, 3, Down, [1])) // 11. 1d4-*
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

test(`ignores extra content at the beginning/end of a file`, () => {
  const ptnFileContents = dedent`
    Hello world
    [Size "6"]

    1. a6
    whoops
  `

  const { metadata, turns } = parsePTNData(ptnFileContents)

  expect(metadata.get("Size")).toBe("6")
  
  expect(turns).toEqual([
    {
      "position": {
        "file": 0,
        "rank": 0,
      },
      "stone": "F",
      "type": "place",
    },
  ])
})

test(`can create PTN file contents`, () => {
  const inputPTN = dedent`
    [Size "6"]
    [Hello "\"World\""]

    1. a6 f6
    2. d4 c4
    3. d3 c3
    4. d5 c5
    5. d2 Ce4
    6. c2 e3
    7. e2 b2
    8. Cb3 e4<
    9. d3< Sd1
    10. a3 d1+
  `

  const { metadata, turns } = parsePTNData(inputPTN)

  const outputPTN = createPTNData(turns, +metadata.get("Size")!, metadata.values)

  expect(outputPTN).toBe(inputPTN)
})
