import { FileNum, RankNum } from "../model/board"
import { FlatStone, StoneType } from "../model/stones"
import { Direction, Turn } from "../model/turns"

// Terminology used in this context:
//
// - a "round" is e.g. `5. d2 Ce4`
// - a "turn" of type "place" is e.g. `Ce4`
// - a "turn" of type "move" is e.g. `1d3<1`

interface PTNData {
  metadata: Record<string, string>
  turns: Turn[]
}

/**
 * Parse PTN file contents.
 * 
 * Note that this function is "lossy" in terms of comments and informational marks.
 */
export function parsePTNData(ptnFileContents: string): PTNData {
  /**
   * Matches the two sections in a PTN file (metadata and turns)
   */
  const PTN_SECTIONS_PATTERN = /^(?<metadataSection>[\s\S]*?)(?:^1\..*)?(?<turnSection>^[1][\s\S]*)/mg

  const match = PTN_SECTIONS_PATTERN.exec(ptnFileContents)

  if (match) {
    const { metadataSection, turnSection } = match.groups!

    const metadata = parsePTNMetadataSection(metadataSection)

    const turns: Turn[] = []

    const cleanedTurnSection = cleanCommentsFromPTNTurnSection(turnSection)

    let expectedRound = 1
    let expectingMore = true

    for (const { round, player1turn, player2turn } of extractTurnsFromCleanedPTNTurnSection(cleanedTurnSection)) {
      if (!expectingMore) {
        throw new Error(`PTN parser error: unexpected turn after last turn`)
      }

      if (+round !== expectedRound) {
        throw new Error(`PTN parser error: unexpected round number ${round}, expected ${expectedRound}`)
      }

      turns.push(parseTurn(player1turn))

      if (player2turn) {
        turns.push(parseTurn(player2turn))
      } else {
        expectingMore = false
      }

      expectedRound += 1
    }

    return {
      metadata,
      turns,
    }
  }

  throw new Error(`PTN parser error: unexpected input`)
}

/**
 * Extracts metedata records from the metadata section of a PTN file
 */
function parsePTNMetadataSection(metadataSection: string): Record<string, string> {
  /**
   * Matches a single line of metadata (accepts backslash-escaped double quotes)
   */
  const PTN_METADATA_PATTERN = /^\[(?<name>[A-Za-z0-9_]+)\s+"(?<value>(?:[^"\\]|\\.)*)"\]$/

  const metadata: Record<string, string> = {}

  const lines = metadataSection.split('\n').map(line => line.trim()).filter(line => line.length > 0)

  for (const line of lines) {
    const match = PTN_METADATA_PATTERN.exec(line)
    if (!match) {
      throw new Error(`PTN metadata parser error: invalid metadata line: ${line}`)
    }
    const { name, value } = match.groups!
    metadata[name] = value.replace(/\\(.)/g, '$1')
  }

  return metadata
}

/**
 * Removes bracketed and line comments from a PTN turn section (to simplify parsing)
 */
function cleanCommentsFromPTNTurnSection(turnSection: string): string {
  return turnSection
    .replace(/\{[^}]*\}/g, '')   // remove all {...} comments
    .replace(/;.*$/gm, '');      // remove all ;... comments to end of line
}

/**
 * Extracts rounds and moves from a cleaned PTN turn section.
 * 
 * @see cleanCommentsFromPTNTurnSection
 */
function* extractTurnsFromCleanedPTNTurnSection(cleanedTurnSection: string) {
  /**
   * Matches a single round in a PTN turn section (e.g. `11. Sd3?! 1d4-*`)
   */
  const PTN_ROUND_PATTERN = /^\s*(?<round>\d+)\.\s*(?<player1turn>[^\s*'!?]+)[*'!?]*(?:\s+(?<player2turn>[^\s*'!?]+)[*'!?]*)?$/

  const lines = cleanedTurnSection.split('\n').map(line => line.trim()).filter(line => line.length > 0)

  for (const line of lines) {
    const match = PTN_ROUND_PATTERN.exec(line)

    if (!match) {
      throw new Error(`PTN parse error: invalid round line:\n${line}`)
    }

    const { round, player1turn, player2turn = undefined } = match.groups!

    yield { round, player1turn, player2turn }
  }
}

/**
 * Parse PTN notation for a single turn.
 */
export function parseTurn(turn: string): Turn {
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

  const match = TURN_PATTERN.exec(turn)

  if (match) {
    const {
      count,
      stone,
      file,
      rank,
      direction,
      dropcounts
    } = match.groups!

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
