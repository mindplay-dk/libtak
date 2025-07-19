import { test, expect } from "vitest"
import { createBoard } from "./board"

test(`can create empty Board`, () => {
  const board = createBoard(3)

  expect(board.squares).toEqual([
    [[], [], []],
    [[], [], []],
    [[], [], []],
  ])
})
