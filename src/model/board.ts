import { Stone } from "./stones"

export type Board = {
  /** The size is also the carry limit */
  size: number
  squares: { readonly [R in Row]: { readonly [C in Column]: Square }}
}

export type Square = Stone[]

declare const _row: unique symbol
declare const _col: unique symbol
declare const _type: unique symbol

export type Row = number & { [_type]: typeof _row }
export type Column = number & { [_type]: typeof _col }

export type Position = {
  /** Row/Rank */
  row: Row
  /** Column/File */
  column: Column
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
