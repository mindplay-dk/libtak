import { Stone } from "./stones"

export const SIZE_MIN = 3
export const SIZE_MAX = 8

/**
 * An empty board is represented in memory as follows:
 * 
 * ```
 *                               ranks: index:
 *      [[[ ],[ ],[ ],[ ],[ ]],   '5'     0
 *       [[ ],[ ],[ ],[ ],[ ]],   '4'     1
 *       [[ ],[ ],[ ],[ ],[ ]],   '3'     2
 *       [[ ],[ ],[ ],[ ],[ ]],   '2'     3
 *       [[ ],[ ],[ ],[ ],[ ]]]   '1'     4
 * 
 * files: 'A' 'B' 'C' 'D' 'E'
 * index:  0   1   2   3   4
 * 
 * ```
 * 
 * Note that ranks are numbered in reverse, bc if you need to debug,
 * it's helpful to have the squares show up in the order you'd see
 * them on an actual board laid out in front of you.
 */
export type Board = {
  /** The size is also the carry limit */
  size: number
  squares: { readonly [R in RankNum]: { readonly [F in FileNum]: Square }}
}

export const Board = (size: number, squares: Stone[][][]): Board => ({ size, squares })

/** list of stones from bottom (index 0) to top */
export type Square = Stone[]

declare const $RankNum: unique symbol
declare const $FileNum: unique symbol
declare const $dimension: unique symbol

export type RankNum = number & { [$dimension]: typeof $RankNum }
export type FileNum = number & { [$dimension]: typeof $FileNum }

export type Position = {
  /** Ranks (rows) are numbered up the side of the board (so 0 is the first row "1" at the bottom) */
  rank: RankNum
  /** Files (columns) are lettered across the bottom of the board (so 0 is the first column "A" on the left) */
  file: FileNum
}

export const Position = (rank: number, file: number): Position =>
  ({ rank: rank as RankNum, file: file as FileNum })

export function createBoard(size: number): Board {
  return {
    size,
    squares: new Array(size) // files ("columns", A, B, C, ...)
      .fill(null)
      .map(() => new Array(size) // ranks ("rows", 1, 2, 3, ...)
        .fill(null)
        .map(() => []) // empty Squares
      )
  }
}
