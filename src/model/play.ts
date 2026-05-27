import { updateBoard } from "./board";
import { Game } from "./game";
import { opponent } from "./players";
import { Stone, CapStone, FlatStone } from "./stones";
import { Turn, Up, Down, Left, Right } from "./turns";
import { PlayResult, GameErrorType } from "./result";
import { check } from './result';

/**
 * Given a Game state and a Turn, produces the resulting Game state.
 */
export function play(game: Game, turn: Turn): Game {
  return check(tryPlay(game, turn));
}

/**
 * Given a Game state and a Turn, produces the resulting Game state.
 */
export function tryPlay(game: Game, turn: Turn): PlayResult {
  const isOpening = game.turn <= 2

  if (isOpening) {
    if (turn.type === "move" || turn.stone !== FlatStone) {
      return {
        type: 'error',
        errorType: GameErrorType.MustPlaceFlat,
        message: `Turn ${game.turn} must place a flat stone`,
        context: { turn: (turn as any).type, stone: (turn as any).stone }
      }
    }
  }

  if (turn.type === "place") {
    const boundsErr = checkBounds(turn.position.rank, turn.position.file, game.board.size)
    if (boundsErr) return boundsErr

    if (game.board.squares[turn.position.rank][turn.position.file].length > 0) {
      return {
        type: 'error',
        errorType: GameErrorType.SquareOccupied,
        message: `Stones can only be placed in empty squares`,
        context: { position: turn.position }
      }
    }

    const stoneType = turn.stone === CapStone ? 'capstones' : 'stones'

    if (game.reserve[game.player][stoneType] < 1) {
      return {
        type: 'error',
        errorType: stoneType === 'capstones' ? GameErrorType.NoCapstones : GameErrorType.NoReserve,
        message: `Player ${game.player} does not have ${stoneType} in reserve`,
        context: { player: game.player, stoneType }
      }
    }

    /**
     * NOTE: the player "color" is reversed during the opening turn
     */
    const playerColor = isOpening ? opponent(game.player) : game.player

    return {
      type: 'game',
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

    const startBoundsErr = checkBounds(rank, file, game.board.size)
    if (startBoundsErr) return startBoundsErr

    const topStone = game.board.squares[rank][file].at(-1)

    if (!topStone) {
      return {
        type: 'error',
        errorType: GameErrorType.NoStonesToPickUp,
        message: `No stones available to pick up at rank ${rank}, file ${file}`,
        context: { rank, file }
      }
    } else if (topStone.player !== game.player) {
      return {
        type: 'error',
        errorType: GameErrorType.NotOwner,
        message: `Top stone at rank ${rank}, file ${file} belongs to Player ${topStone.player}, not Player ${game.player}`,
        context: { rank, file, owner: topStone.player, player: game.player }
      }
    }

    const hand: Stone[] = []

    for (const dropcount of turn.dropcounts) {
      if (dropcount < 1) {
        return {
          type: 'error',
          errorType: GameErrorType.InvalidDropCount,
          message: `At least one stone must be dropped on each square along the path (Rule 2.2.2)`,
          context: { dropcount }
        }
      }

      for (let n=0; n<dropcount; n++) {
        const stone = board.squares[rank][file].pop() // pick up

        if (!stone) {
          return {
            type: 'error',
            errorType: GameErrorType.NoStonesLeft,
            message: `No stones left to pick up at rank ${rank}, file ${file}`,
            context: { rank, file }
          }
        }

        hand.push(stone) 
      }
    }

    if (hand.length > board.size) {
      return {
        type: 'error',
        errorType: GameErrorType.CarryLimitExceeded,
        message: `Cannot carry ${hand.length} stones (carry limit is ${board.size})`,
        context: { carry: hand.length, limit: board.size }
      }
    }

    for (const dropcount of turn.dropcounts) {
      switch (turn.direction) {
        case Up: rank -= 1; break;
        case Down: rank += 1; break;
        case Left: file -= 1; break;
        case Right: file += 1; break;
        default:
          return {
            type: 'error',
            errorType: GameErrorType.InvalidDirection,
            message: `Invalid direction: ${turn.direction}`,
            context: { direction: turn.direction }
          }
      }

      const stepBoundsErr = checkBounds(rank, file, game.board.size)
      if (stepBoundsErr) return stepBoundsErr

      for (let n=0; n<dropcount; n++) {
        const dropped = hand.pop()!

        if (dropped.type !== CapStone && board.squares[rank][file].length > 0 && board.squares[rank][file].at(-1)!.type !== FlatStone) {
          return {
            type: 'error',
            errorType: GameErrorType.DropOnNonFlat,
            message: `Stones may only be dropped on flat stones and empty squares`,
            context: { rank, file }
          }
        }

        if (dropped.type === CapStone && board.squares[rank][file].length > 0) {
          board.squares[rank][file].at(-1)!.type = FlatStone // flatten
        }

        board.squares[rank][file].push(dropped)
      }
    }

    return {
      type: 'game',
      player: opponent(game.player),
      turn: game.turn + 1,
      board,
      reserve: game.reserve,
    };
  }

  return {
    type: 'error',
    errorType: GameErrorType.UnsupportedTurn,
    message: `Unsupported turn type: ${(turn as any).type}`,
    context: { turn: (turn as any).type }
  }
}

function checkBounds(rank: number, file: number, size: number): PlayResult | undefined {
  if (rank < 0 || rank > size - 1 || file < 0 || file > size - 1) {
    return {
      type: 'error',
      errorType: GameErrorType.OutOfBounds,
      message: `Position out of bounds: rank ${rank}, file ${file} on a ${size}x${size} board`,
      context: { rank, file, size }
    }
  }

  return undefined
}
