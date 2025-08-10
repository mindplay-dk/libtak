import { updateBoard } from "./board";
import { Game } from "./game";
import { opponent } from "./players";
import { Stone, CapStone, FlatStone } from "./stones";
import { Turn, Up, Down, Left, Right } from "./turns";

/**
 * Given a Game state and a Turn, produces the resulting Game state.
 */
export function play(game: Game, turn: Turn): Game {
  const isOpening = game.turn <= 2

  if (isOpening) {
    if (turn.type === "move" || turn.stone !== FlatStone) {
      throw new Error(`Turn ${game.turn} must place a flat stone`);
    }
  }

  if (turn.type === "place") {
    checkBounds(turn.position.rank, turn.position.file, game.board.size)

    if (game.board.squares[turn.position.rank][turn.position.file].length > 0) {
      throw new Error(`Stones can only be placed in empty squares`)
    }

    const stoneType = turn.stone === CapStone ? 'capstones' : 'stones'

    if (game.reserve[game.player][stoneType] < 1) {
      throw new Error(`Player ${game.player} does not have ${stoneType} in reserve`)
    }

    /**
     * NOTE: the player "color" is reversed during the opening turn
     */
    const playerColor = isOpening ? opponent(game.player) : game.player

    return {
      player: opponent(game.player),
      turn: game.turn + 1,
      board: updateBoard(game.board, (square, rank, file) =>
        (turn.position.rank === rank) && (turn.position.file === file)
          ? [...square, Stone(playerColor, turn.stone)]
          : square),
      reserve: {
        1: {
          stones: game.reserve[1].stones - (playerColor === 1 && turn.stone !== CapStone ? 1 : 0),
          capstones: game.reserve[1].capstones - (playerColor === 1 && turn.stone === CapStone ? 1 : 0)
        },
        2: {
          stones: game.reserve[2].stones - (playerColor === 2 && turn.stone !== CapStone ? 1 : 0),
          capstones: game.reserve[2].capstones - (playerColor === 2 && turn.stone === CapStone ? 1 : 0)
        }
      },
    }
  }

  if (turn.type === "move") {
    const board = updateBoard(game.board, square => square) // copy

    let { rank, file } = turn.fromPosition

    checkBounds(rank, file, game.board.size)

    const topStone = game.board.squares[rank][file].at(-1)

    if (!topStone) {
      throw new Error(`No stones available to pick up at rank ${rank}, file ${file}`)
    } else if (topStone.player !== game.player) {
      throw new Error(`Top stone at rank ${rank}, file ${file} belongs to Player ${topStone.player}, not Player ${game.player}`)
    }

    const hand: Stone[] = []

    for (const dropcount of turn.dropcounts) {
      if (dropcount < 1) {
        throw new Error(`At least one stone must be dropped on each square along the path (Rule 2.2.2)`)
      }

      for (let n=0; n<dropcount; n++) {
        const stone = board.squares[rank][file].pop() // pick up

        if (!stone) {
          throw new Error(`No stones left to pick up at rank ${rank}, file ${file}`)
        }

        hand.push(stone) 
      }
    }

    if (hand.length > board.size) {
      throw new Error(`Cannot carry ${hand.length} stones (carry limit is ${board.size})`)
    }

    for (const dropcount of turn.dropcounts) {
      switch (turn.direction) {
        case Up: rank -= 1; break;
        case Down: rank += 1; break;
        case Left: file -= 1; break;
        case Right: file += 1; break;
        default:
          throw new Error(`Invalid direction: ${turn.direction}`)
      }

      checkBounds(rank, file, game.board.size)

      for (let n=0; n<dropcount; n++) {
        const dropped = hand.pop()!

        if (dropped.type !== CapStone && board.squares[rank][file].length > 0 && board.squares[rank][file].at(-1)!.type !== FlatStone) {
          throw new Error(`Stones may only be dropped on flat stones and empty squares`)
        }

        if (dropped.type === CapStone && board.squares[rank][file].length > 0) {
          board.squares[rank][file].at(-1)!.type = FlatStone // flatten
        }

        board.squares[rank][file].push(dropped)
      }
    }

    return {
      player: opponent(game.player),
      turn: game.turn + 1,
      board,
      reserve: game.reserve,
    };
  }

  throw new Error(`Unsupported turn type: ${(turn as any).type}`)
}

function checkBounds(rank: number, file: number, size: number): void {
  if (rank < 0 || rank > size - 1 || file < 0 || file > size - 1) {
    throw new Error(`Position out of bounds: rank ${rank}, file ${file} on a ${size}x${size} board`)
  }
}
