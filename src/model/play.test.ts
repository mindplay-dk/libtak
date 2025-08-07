import { test, expect, describe } from "vitest"
import { verifyPlay, play } from "./play"
import { Game, Reserve, createNewGame, createNewReserve } from "./game"
import { Board, Position, createBoard } from "./board"
import { PlayerNumber, Player, Player1, Player2 } from "./players"
import { Stone, StoneType, FlatStone, StandingStone, CapStone } from "./stones"
import { Turn, Place, Move, Direction, Up, Down, Left, Right } from "./turns"

test("can place stones", () => {
  let game = createNewGame(3)

  game = play(game, Place(0, 0)) // P1

  expect(game.player).toBe(2)

  expect(game.reserve).toEqual({
    1: { stones: 9, capstones: 0 },
    2: { stones: 10, capstones: 0 },
  })

  game = play(game, Place(1, 1)) // P2

  expect(game.player).toBe(1)

  expect(game.reserve).toEqual({
    1: { stones: 9, capstones: 0 },
    2: { stones: 9, capstones: 0 },
  })

  expect(game.board.squares).toEqual([
    [[Stone(1)], [        ], [        ]],
    [[        ], [Stone(2)], [        ]],
    [[        ], [        ], [        ]],
  ])
})
