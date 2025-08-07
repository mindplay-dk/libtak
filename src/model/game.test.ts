import { test, expect } from "vitest"

import { createNewGame } from "./game"

test("can create empty Game", () => {
  const game = createNewGame(5)

  expect(game.board.size).toBe(5)
  expect(game.player).toBe(1)
  expect(game.turn).toBe(1)
  expect(game.reserve).toEqual({
    1: { stones: 21, capstones: 1 },
    2: { stones: 21, capstones: 1 },
  })
})
