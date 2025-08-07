import { test, expect } from "vitest"

import { createTPS, parseTPS } from "./tps"
import { Board } from "../model/board"
import { Stone, FlatStone, StandingStone, CapStone } from "../model/stones"
import { PlayerNumber } from "../model/players"

const flat = (player: PlayerNumber): Stone => ({ type: FlatStone, player })
const standing = (player: PlayerNumber): Stone => ({ type: StandingStone, player })
const cap = (player: PlayerNumber): Stone => ({ type: CapStone, player })
const at = (board: Board, rank: number, file: number) => board.squares[rank][file]

test("parses empty 5x5 board", () => {
  const { board } = parseTPS("x5/x5/x5/x5/x5 1 1")

  expect(board.size).toBe(5)

  for (let rank = 0; rank < 5; rank++) {
    for (let file = 0; file < 5; file++) {
      expect(at(board, rank, file)).toEqual([])
    }
  }
})

test("correctly places stones on the board", () => {
  /**
   * TPS lists ranks from the bottom to the top,
   * so the example TPS below corresponds to:
   * 
   * [ ] [ ] [ ] [ ] [1]
   * [ ] [ ] [ ] [ ] [ ]
   * [ ] [ ] [ ] [ ] [ ]
   * [ ] [ ] [ ] [ ] [ ]
   * [2] [ ] [ ] [ ] [ ]
   */
  const { board } = parseTPS("x4,1/x5/x5/x5/2,x4 1 1")

  expect(at(board, 0, 4)).toEqual([flat(1)])
  expect(at(board, 4, 0)).toEqual([flat(2)])
})

test("rejects incorrect number of stones", () => {
  expect(() => parseTPS("2,12,2S/x5/x5/x5/x5 1 1")).toThrow(`rank "2,12,2S" has 3 squares, expected 5`)
})

test("parses flat stones and stacks (valid row)", () => {
  const { board } = parseTPS("2,12,2S,x2/x5/x5/x5/x5 1 1")

  expect(at(board, 0, 0)).toEqual([flat(2)])
  expect(at(board, 0, 1)).toEqual([flat(1), flat(2)])
  expect(at(board, 0, 2)).toEqual([standing(2)])
  expect(at(board, 0, 3)).toEqual([])
  expect(at(board, 0, 4)).toEqual([])
})

test("parses standing and cap stones on top", () => {
  const { board } = parseTPS("1C,2S,x3/x5/x5/x5/x5 2 3")

  expect(at(board, 0, 0)).toEqual([cap(1)])
  expect(at(board, 0, 1)).toEqual([standing(2)])
})

test("parses multi-digit empty squares", () => {
  const { board } = parseTPS("x2,1,x2/x5/x5/x5/x5 1 1")

  expect(at(board, 0, 0)).toEqual([])
  expect(at(board, 0, 1)).toEqual([])
  expect(at(board, 0, 2)).toEqual([flat(1)])
  expect(at(board, 0, 3)).toEqual([])
  expect(at(board, 0, 4)).toEqual([])
})

test("parses full example from spec", () => {
  const tps = "x3,12,2S/x,22S,22C,11,21/121,212,12,1121C,1212S/21S,1,21,211S,12S/x,21S,2,x2 1 26"
  const { board, player, turn, reserve } = parseTPS(tps)

  expect(board.size).toBe(5)

  expect(player).toBe(1)
  expect(turn).toBe(26)

  expect(reserve).toEqual({
    1: { stones: 2, capstones: 0 },
    2: { stones: 2, capstones: 0 },
  })

  expect(board.squares).toEqual([
    // x3,12,2S
    [
      [], [], [], // x3
      [flat(1), flat(2)],
      [standing(2)],
    ],
    // x,22S,22C,11,21
    [
      [],
      [flat(2), standing(2)],
      [flat(2), cap(2)],
      [flat(1), flat(1)],
      [flat(2), flat(1)],
    ],
    // 121,212,12,1121C,1212S
    [
      [flat(1), flat(2), flat(1)],
      [flat(2), flat(1), flat(2)],
      [flat(1), flat(2)],
      [flat(1), flat(1), flat(2), cap(1)],
      [flat(1), flat(2), flat(1), standing(2)],
    ],
    // 21S,1,21,211S,12S
    [
      [flat(2), standing(1)],
      [flat(1)],
      [flat(2), flat(1)],
      [flat(2), flat(1), standing(1)],
      [flat(1), standing(2)],
    ],
    // x,21S,2,x2
    [
      [],
      [flat(2), standing(1)],
      [flat(2)],
      [], [], // x2
    ],
  ])

})

test("throws on invalid TPS format", () => {
  expect(() => parseTPS("")).toThrow("invalid TPS format")
  expect(() => parseTPS("x5/x5/x5/x5/x5 1")).toThrow("invalid TPS format")
  expect(() => parseTPS("x5/x5/x5/x5/x5 3 1")).toThrow("invalid player number: 3 (must be 1 or 2)")
  expect(() => parseTPS("x5/x5/x5/x5/x5 1 0")).toThrow("invalid turn number: 0")
})

test("throws on invalid board size", () => {
  expect(() => parseTPS("x2/x2 1 1")).toThrow('board size must be between 3 and 8, got 2')
  expect(() => parseTPS("x9/x9/x9/x9/x9/x9/x9/x9/x9 1 1")).toThrow('board size must be between 3 and 8, got 9')
})

test("throws on too many or too few squares in a row", () => {
  expect(() => parseTPS("x4/x5/x5/x5/x5 1 1")).toThrow(`rank "x4" has 4 squares, expected 5`)
  expect(() => parseTPS("x6/x5/x5/x5/x5 1 1")).toThrow(`rank "x6" has 6 squares, expected 5`)
})

test("throws on invalid stack", () => {
  expect(() => parseTPS("a,x4/x5/x5/x5/x5 1 1")).toThrow(`invalid square "a" in rank "a,x4"`)
  expect(() => parseTPS("1Q,x4/x5/x5/x5/x5 1 1")).toThrow(`invalid square "1Q" in rank "1Q,x4"`)
})

test("throws on too many squares in a row", () => {
  expect(() => parseTPS("1,1,1,1,1,1/x5/x5/x5/x5 1 1")).toThrow(`rank "1,1,1,1,1,1" has too many squares, expected 5`)
})

test("can create TPS string from Game", () => {
  const tps = "x3,12,2S/x,22S,22C,11,21/121,212,12,1121C,1212S/21S,1,21,211S,12S/x,21S,2,x2 1 26"

  const game = parseTPS(tps)

  expect(createTPS(game)).toBe(tps)
})
