import { test, expect } from "vitest"

import { createBoard, updateBoard } from "./board"
import { Stone } from "./stones"

test(`can create empty Board`, () => {
  const board = createBoard(3)

  expect(board.squares).toEqual([
    [[], [], []],
    [[], [], []],
    [[], [], []],
  ])

  expect(() => createBoard(2)).toThrow("Board size 2 is too small (3 is the smallest allowed)")
  expect(() => createBoard(9)).toThrow("Board size 9 is too large (8 is the largest allowed)")
})

test(`can update Board`, () => {
  let board = createBoard(3)

  board = updateBoard(board, (square, rank, file) => {
    if (rank === 1) {
      return [Stone(2)]
    }
    return square
  })

  board = updateBoard(board, (square, rank, file) => {
    if (file === 1) {
      return [Stone(1)]
    }
    return square
  })

  expect(board.squares).toEqual([
    [[        ], [Stone(1)], [        ]],
    [[Stone(2)], [Stone(1)], [Stone(2)]],
    [[        ], [Stone(1)], [        ]],
  ])
})
