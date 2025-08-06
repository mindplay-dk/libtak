import { FileNum, RankNum, SIZE_MAX, SIZE_MIN, createBoard } from "../model/board";
import { createReserve, Game } from "../model/game";
import { PlayerNumber } from "../model/players";
import { FlatStone, StoneType } from "../model/stones";

/**
 * Parses a TPS string such as `x5/x5/x5/x5/x5 1 1` and returns a Board instance.
 */
export function parseTPS(tps: string): Game {
  /**
   * rows separated by '/', then space, then turn and move
   */
  const TPS_PATTERN = /^(?<boardDescription>[^ ]+)\s+(?<player>\d+)\s+(?<turn>\d+)$/

  const match = TPS_PATTERN.exec(tps.trim())

  if (!match) {
    throw new Error(`TPS parse error: invalid TPS format`)
  }

  const { boardDescription, player, turn } = match.groups!

  const rankStrings = boardDescription.split("/")

  const size = rankStrings.length

  if (size < SIZE_MIN || size > SIZE_MAX) {
    throw new Error(`TPS parse error: board size must be between ${SIZE_MIN} and ${SIZE_MAX}, got ${size}`)
  }

  if (player !== "1" && player !== "2") {
    throw new Error(`TPS parse error: invalid player number: ${player} (must be 1 or 2)`)
  }

  if (!/^[1-9]\d*$/.test(turn)) {
    throw new Error(`TPS parse error: invalid turn number: ${turn}`)
  }

  const board = createBoard(size)

  let rank = size -1

  for (const rankString of rankStrings) {
    let file = 0

    const squareStrings = rankString.split(",")

    for (const squareString of squareStrings) {
      if (file === size) {
        throw new Error(`TPS parse error: rank "${rankString}" has too many squares, expected ${size}`)
      }

      const match = /^x(?<count>\d*)?$/.exec(squareString)

      if (match) {
        const { count = "1" } = match.groups!

        file += +count
      } else if (/^[12]+[SC]?$/.test(squareString)) {
        const stones = squareString.match(/[12][SC]?/g)!

        for (const [player, type] of stones) {
          board.squares[rank as RankNum][file as FileNum].push({
            type: type as StoneType || FlatStone,
            player: +player as PlayerNumber,
          })
        }

        file += 1
      } else {
        throw new Error(`TPS parse error: invalid square "${squareString}" in rank "${rankString}"`)
      }
    }

    if (file !== size) {
      throw new Error(`TPS parse error: rank "${rankString}" has ${file} squares, expected ${size}`)
    }

    rank -= 1
  }

  return {
    board,
    reserve: {
      1: createReserve(size),
      2: createReserve(size),
    },
    player: +player as PlayerNumber,
    turn: +turn
  }
}
