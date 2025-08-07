import { updateBoard } from "./board";
import { Game } from "./game";
import { opponent } from "./players";
import { Stone } from "./stones";
import { Turn } from "./turns";

/**
 * Given a Game state and a Turn, produces the resulting Game state.
 */
export function play(game: Game, turn: Turn): Game {
  const error = verifyPlay(game, turn)

  if (error) {
    throw new Error(`invalid turn for this game: ${error}`)
  }

  if (turn.type === "place") {
    return {
      player: opponent(game.player),
      turn: game.turn + 1,
      board: updateBoard(game.board, (square, rank, file) =>
        (turn.position.rank === rank) && (turn.position.file === file)
          ? [Stone(game.player, turn.stone)]
          : square),
      reserve: {
        1: {
          stones: game.reserve[1].stones - (game.player === 1 ? 1 : 0),
          capstones: game.reserve[1].capstones
        },
        2: {
          stones: game.reserve[2].stones - (game.player === 2 ? 1 : 0),
          capstones: game.reserve[2].capstones
        }
      },
    }
  }

  if (turn.type === "move") {
    // TODO
  }

  throw new Error(`Unsupported turn type: ${turn.type}`)
}

/**
 * Given a Game state and a Turn, verify that the Turn is valid
 */
export function verifyPlay(game: Game, turn: Turn): string | null {
  // TODO verify all game rules
  //      return a descriptive error message (or null if the turn is valid)
  //      for each condition, reference the rule numbers in `tak-rules.md`
  return null
}
