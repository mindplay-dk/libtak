import { FileNum, RankNum } from "../model/board";
import { FlatStone, StoneType } from "../model/stones";
import { Direction, Turn } from "../model/turns";

// Terminology used in this context:
//
// - a "round" is e.g. `5. d2 Ce4`
// - a "turn" of type "place" is e.g. `Ce4`
// - a "turn" of type "move" is e.g. `1d3<1`

/**
 * This pattern matches PTN turn notation.
 * 
 * Tokens captured by this pattern:
 * 
 * count — optional, digits at the start (number of stones moved)
 * stone — optional, piece type placed (F, S, C)
 * file — required, board file (a-h)
 * rank — required, board rank (1-8)
 * direction — optional, move direction (<, >, +, -)
 * dropcounts — optional, digits after direction (drop counts)
 * topstone — optional, ignored, stone type on top after move (S, C)
 */
const TURN_PATTERN = /^(?:(?<count>\d+))?(?<stone>[FSC])?(?<file>[a-h])(?<rank>[1-8])(?:(?<direction>[<>+\-])(?<dropcounts>\d+)?(?<topstone>[SC])?)?$/

/**
 * Parse PTN notation for a single turn.
 */
export function parseTurn(turn: string): Turn {
  const match = TURN_PATTERN.exec(turn)

  if (match) {
    const {
      count,
      stone,
      file,
      rank,
      direction,
      dropcounts
    } = match.groups!;

    if (file && rank) {
      const position = {
        file: (file.charCodeAt(0) - 'a'.charCodeAt(0)) as FileNum,
        rank: +rank - 1 as RankNum
      }

      if (!count && !direction && !dropcounts) {
        return {
          type: 'place',
          stone: stone as StoneType || FlatStone,
          position,
        }
      }

      if (direction && !stone) {
        /**
         * count may be omitted, if the count is 1
         */
        const countWithDefault = count ? +count : 1
        
        /**
         * drop counts may be omitted if all of the stones given in the count
         * are dropped on a square immediately adjacent to the source square
         */
        const dropcountsWithDefault = dropcounts || `${countWithDefault}`

        const dropcountValues = dropcountsWithDefault.split('').map(Number)

        let totalDropcount = 0

        for (const dropcountValue of dropcountValues) {
          totalDropcount += dropcountValue
        }

        if (totalDropcount === countWithDefault) {
          return {
            type: 'move',
            direction: direction as Direction,
            fromPosition: position,
            dropcounts: dropcountValues
          }
        }
      }
    }
  }

  throw new Error(`Unable to parse PTN turn: ${turn}`)
}
