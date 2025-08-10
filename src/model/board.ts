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
 *       [[ ],[ ],[ ],[ ],[ ]]]   '1'     4 (size-1)
 * 
 * files: 'A' 'B' 'C' 'D' 'E'
 * index:  0   1   2   3   4 (size-1)
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
  /** Squares addressed as squares[rank][file] */
  squares: readonly Square[][]
}

export const Board = (size: number, squares: Square[][]): Board => ({ size, squares })

/** list of stones from bottom (index 0) to top */
export type Square = Stone[]

export type Position = {
  /** Ranks (rows) are numbered up the side of the board (so 0 is the first row "1" at the bottom) */
  rank: number
  /** Files (columns) are lettered across the bottom of the board (so 0 is the first column "A" on the left) */
  file: number
}

export const Position = (rank: number, file: number): Position => ({ rank, file })

/**
 * Creates an empty Board.
 */
export function createBoard(size: number): Board {
  if (size < SIZE_MIN) {
    throw new Error(`Board size ${size} is too small (${SIZE_MIN} is the smallest allowed)`)
  }

  if (size > SIZE_MAX) {
    throw new Error(`Board size ${size} is too large (${SIZE_MAX} is the largest allowed)`)
  }

  return {
    size,
    squares: new Array(size) // ranks ("rows", 1, 2, 3, ...)
      .fill(null)
      .map(() => new Array(size) // files ("columns", A, B, C, ...)
        .fill(null)
        .map(() => []) // empty Squares
      )
  }
}

export type UpdateSquare = (square: Square, rank: number, file: number) => Square

/**
 * Maps an update function against every Square on the Board and returns an updated Board.
 */
export function updateBoard(board: Board, updateSquare: UpdateSquare): Board {
  return {
    size: board.size,
    squares: board.squares.map(((row, rank) =>
      row.map((square, file) =>
        updateSquare(square.slice(), rank, file)))),
  }
}
