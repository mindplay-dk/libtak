import { test, expect, describe } from "vitest"
import { verifyPlay, play } from "./play"
import { Game, Reserve, createNewGame, createNewReserve } from "./game"
import { Board, Position, createBoard } from "./board"
import { PlayerNumber, Player, Player1, Player2 } from "./players"
import { Stone, StoneType, FlatStone, StandingStone, CapStone } from "./stones"
import { Turn, Place, Move, Direction, Up, Down, Left, Right } from "./turns"

describe("Rule 1.1: Board Setup", () => {
  test("Rule 1.1: cannot place out of bounds", () => {
    let game = createNewGame(3)
    
    expect(() => play(game, Place(3, 0))).toThrow(
      "Position out of bounds: rank 3, file 0 on a 3x3 board"
    )
    
    expect(() => play(game, Place(0, 3))).toThrow(
      "Position out of bounds: rank 0, file 3 on a 3x3 board"
    )
    
    expect(() => play(game, Place(-1, 0))).toThrow(
      "Position out of bounds: rank -1, file 0 on a 3x3 board"
    )
  })

  test("Rule 1.1: cannot place stone when no stones in reserve", () => {
    let game = createNewGame(3)

    game = play(game, Place(0, 0)) // P1
    game = play(game, Place(0, 1)) // P2

    for (let n=0; n<9; n++) {
      game = play(game, Place(1, 0)) // P1
      game = play(game, Place(1, 1)) // P2
      game = play(game, Move(1, 0, Up, [1])) // P1
      game = play(game, Move(1, 1, Up, [1])) // P1
    }
    
    expect(() => play(game, Place(1, 0))).toThrow(
      "Player 1 does not have stones in reserve"
    )
  })

  test("Rule 1.1: cannot place capstone when no capstones in reserve", () => {
    let game = createNewGame(3) // there are no capstones in a 3x3 game

    game = play(game, Place(0, 0))
    game = play(game, Place(0, 1))
    
    expect(() => play(game, Place(0, 2, CapStone))).toThrow(
      "Player 1 does not have capstones in reserve"
    )
  })
})

describe("Rule 1.2: First two turns", () => {
  test("turn 1 must place flat stone", () => {
    let game = createNewGame(5)
    
    expect(() => play(game, Place(0, 0, StandingStone))).toThrow(
      "Turn 1 must place a flat stone"
    )
    
    expect(() => play(game, Place(0, 0, CapStone))).toThrow(
      "Turn 1 must place a flat stone"
    )
  })

  test("turn 2 must place flat stone", () => {
    let game = createNewGame(5)

    game = play(game, Place(0, 0, FlatStone)) // P1
    
    expect(() => play(game, Place(1, 1, StandingStone))).toThrow(
      "Turn 2 must place a flat stone"
    )
    
    expect(() => play(game, Place(1, 1, CapStone))).toThrow(
      "Turn 2 must place a flat stone"
    )
  })
})

describe("Rule 2.1: Placing Stones", () => {
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
})

describe("Rule 2.2: Moving Stones", () => {
  test("can move stones up", () => {
    let game = createNewGame(3)
    
    game = play(game, Place(1, 1)) // P1
    game = play(game, Place(1, 2)) // P2
    game = play(game, Move(1, 1, Up, [1])) // P1
    
    expect(game.board.squares).toEqual([
      [[], [Stone(1)], [        ]],
      [[], [        ], [Stone(2)]],
      [[], [        ], [        ]],
    ])
  })

  test("can move stones down", () => {
    let game = createNewGame(3)
    
    game = play(game, Place(1, 1)) // P1
    game = play(game, Place(1, 2)) // P2
    game = play(game, Move(1, 1, Down, [1])) // P1
    
    expect(game.board.squares).toEqual([
      [[], [        ], [        ]],
      [[], [        ], [Stone(2)]],
      [[], [Stone(1)], [        ]],
    ])
  })

  test("can move stones left", () => {
    let game = createNewGame(3)
    
    game = play(game, Place(1, 1)) // P1
    game = play(game, Place(1, 2)) // P2
    game = play(game, Move(1, 1, Left, [1])) // P1
    
    expect(game.board.squares).toEqual([
      [[        ], [], [        ]],
      [[Stone(1)], [], [Stone(2)]],
      [[        ], [], [        ]],
    ])
  })

  test("can move stones right", () => {
    let game = createNewGame(3)
    
    game = play(game, Place(1, 1)) // P1
    game = play(game, Place(1, 2)) // P2
    game = play(game, Move(1, 1, Right, [1])) // P1
    
    expect(game.board.squares).toEqual([
      [[], [], []],
      [[], [], [Stone(2),Stone(1)]],
      [[], [], []],
    ])
  })

  test("cannot move out of bounds", () => {
    let game = createNewGame(3)
    
    game = play(game, Place(0, 0)) // P1
    game = play(game, Place(0, 1)) // P2
    
    expect(() => play(game, Move(0, 0, Up, [1]))).toThrow(
      "Position out of bounds: rank -1, file 0 on a 3x3 board"
    )
  })

  test("Rule 2.2.1: cannot move opponent's stones", () => {
    let game = createNewGame(3)
    
    game = play(game, Place(0, 0, FlatStone)) // P1 turn 1
    game = play(game, Place(1, 1, FlatStone)) // P2 turn 2
    
    // P1 tries to move P2's stone
    expect(() => play(game, Move(1, 1, Right, [1]))).toThrow(
      "Top stone at rank 1, file 1 belongs to Player 2, not Player 1"
    )
  })

  test("Rule 2.2.1: can move multiple stones", () => {
    let game = createNewGame(3)
    
    game = play(game, Place(0, 0)) // P1
    game = play(game, Place(0, 1)) // P2
    game = play(game, Place(1, 0)) // P1
    game = play(game, Place(1, 1)) // P2
    game = play(game, Move(1, 0, Up, [1])) // P1
    game = play(game, Move(1, 1, Up, [1])) // P2
    game = play(game, Move(0, 0, Right, [1, 1])) // P1

    expect(game.board.squares).toEqual([
      [[], [Stone(2),Stone(2),Stone(1)], [Stone(1)]],
      [[], [                          ], [        ]],
      [[], [                          ], [        ]],
    ])
  })

  test("Rule 2.2.1: enforces carry limit according to board size", () => {
    let game = createNewGame(3)

    game = play(game, Place(0, 0)) // P1
    game = play(game, Place(0, 1)) // P2

    for (let n=0; n<3; n++) {
      game = play(game, Place(1, 0)) // P1
      game = play(game, Place(1, 1)) // P2
      game = play(game, Move(1, 0, Up, [1])) // P1
      game = play(game, Move(1, 1, Up, [1])) // P2
    }

    expect(() => play(game, Move(0, 0, Right, [3])), "carry maximum of 3").not.toThrow()
    
    expect(() => play(game, Move(0, 0, Right, [4]))).toThrow(
      "Cannot carry 4 stones (carry limit is 3)"
    )
  })

  test("Rule 2.2.1: cannot carry more stones than are in a stack", () => {
    let game = createNewGame(3)
    
    game = play(game, Place(0, 0)) // P1
    game = play(game, Place(0, 1)) // P2

    expect(() => play(game, Move(0, 0, Right, [1])), "pick up maximum").not.toThrow()
    
    expect(() => play(game, Move(0, 0, Right, [1, 1]))).toThrow(
      "No stones left to pick up at rank 0, file 0"
    )

    expect(() => play(game, Move(0, 0, Right, [2]))).toThrow(
      "No stones left to pick up at rank 0, file 0"
    )
  })

  test("Rule 2.2.2: must drop at least one stone per square", () => {
    let game = createNewGame(3)
    
    game = play(game, Place(0, 0)) // P1
    game = play(game, Place(0, 1)) // P2
    game = play(game, Place(1, 0)) // P1
    game = play(game, Place(1, 1)) // P2
    game = play(game, Move(1, 0, Up, [1])) // P1
    game = play(game, Move(1, 1, Up, [1])) // P2

    expect(() => play(game, Move(0, 0, Right, [1]))).not.toThrow()
    
    expect(() => play(game, Move(0, 0, Right, [0, 1]))).toThrow(
      "At least one stone must be dropped on each square along the path"
    )
  })

  test("Rule 2.2.3: can flatten standing stone", () => {
    let game = createNewGame(5)
    
    game = play(game, Place(0, 0)) // P1
    game = play(game, Place(0, 1)) // P2
    game = play(game, Place(1, 0, CapStone)) // P1
    game = play(game, Place(1, 1, StandingStone)) // P2
    game = play(game, Move(1, 0, Right, [1])) // P1 flattens P2

    expect(game.board.squares).toEqual([
      [[Stone(1)], [Stone(2)                   ], [], [], []],
      [[        ], [Stone(2),Stone(1, CapStone)], [], [], []],
      [[        ], [                           ], [], [], []],
      [[        ], [                           ], [], [], []],
      [[        ], [                           ], [], [], []],
    ])
  })

  test("Rule 2.2.3: capstone must be alone when flattening", () => {
    let game = createNewGame(5)
    
    game = play(game, Place(0, 0)) // P1
    game = play(game, Place(0, 1)) // P2
    game = play(game, Place(1, 0, CapStone)) // P1
    game = play(game, Place(1, 1)) // P2
    game = play(game, Move(1, 0, Up, [1])) // P1 moves capstone onto own stone
    game = play(game, Place(1, 0, StandingStone)) // P2

    expect(() => play(game, Move(0, 0, Right, [1, 1]))).not.toThrow()
    expect(() => play(game, Move(0, 0, Right, [2]))).not.toThrow()

    expect(() => play(game, Move(0, 0, Down, [2]))).toThrow(
      "Stones may only be dropped on flat stones and empty squares"
    )
  })
})
