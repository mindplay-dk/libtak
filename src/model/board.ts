import { Stone } from "./stones"

export type Board = {
  /** The size is also the carry limit */
  size: number
  squares: { readonly [R in FileNum]: { readonly [C in RankNum]: Square }}
}

/** list of stones from bottom (index 0) to top */
export type Square = Stone[]

declare const $FileNum: unique symbol
declare const $RankNum: unique symbol
declare const $dimension: unique symbol

export type FileNum = number & { [$dimension]: typeof $FileNum }
export type RankNum = number & { [$dimension]: typeof $RankNum }

export type Position = {
  /** Files are lettered across the bottom of the board (so 0 is the first column "A" on the left) */
  file: FileNum
  /** Ranks are numbered up the side of the board (so 0 is the first row "1" at the bottom) */
  rank: RankNum
}

export function createBoard(size: number): Board {
  return {
    size,
    squares: new Array(size) // rows
      .fill(null)
      .map(() => new Array(size) // columns
        .fill(null)
        .map(() => []) // empty Squares
      )
  }
}
