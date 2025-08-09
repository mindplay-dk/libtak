import { Board, Position } from "./board"
import { Game, Reserve } from "./game"
import { opponent, PlayerNumber } from "./players"
import { FlatStone, StandingStone } from "./stones"

export type WinState = null // no winner
  | { condition: "road", winner: PlayerNumber }
  | { condition: "flat", winner: PlayerNumber }
  | { condition: "draw" }

export function hasWinner(game: Game): WinState {
  const hasRoad1 = hasRoadWin(game.board, 1)
  const hasRoad2 = hasRoadWin(game.board, 2)

  if (hasRoad1 || hasRoad2) {
    const winner = hasRoad1 && hasRoad2
      ? opponent(game.player) // double road win
      : (hasRoad1 ? 1 : 2)

    return { winner, condition: "road" }
  }
  
  const isFullBoard = game.board.squares.every((row) =>
    row.every((square) => square.length > 0),
  )

  const hasEmptyReserve = isEmpty(game.reserve[1]) && isEmpty(game.reserve[2])

  if (isFullBoard || hasEmptyReserve) {
    const count1 = countFlats(game, 1)
    const count2 = countFlats(game, 2)

    return count1 === count2
      ? { condition: "draw" }
      : { condition: "flat", winner: count1 > count2 ? 1 : 2 }
  }

  return null // no winning condition
}

function hasRoadWin(board: Board, player: number): boolean {
  const roads = createRoads(board, player)

  // Check horizontal road (left edge to right edge)
  for (let rank = 0; rank < board.size; rank++) {
    if (roads[rank][0] && hasRoad(roads, "horizontal", rank, 0)) {
      return true
    }
  }

  // Check vertical road (top edge to bottom edge)
  for (let file = 0; file < board.size; file++) {
    if (roads[0][file] && hasRoad(roads, "vertical", 0, file)) {
      return true
    }
  }

  return false
}

function createRoads(board: Board, player: number): boolean[][] {
  return map(board.squares, (square) => {
    if (square.length === 0) {
      return false
    }

    const topStone = square.at(-1)!

    return (topStone.player === player) && (topStone.type !== StandingStone)
  })
}

function hasRoad(
  roadMap: boolean[][],
  direction: "horizontal" | "vertical",
  startRank: number,
  startFile: number,
): boolean {
  const visited = map(roadMap, () => false)
  const queue: Position[] = [{ rank: startRank, file: startFile }]
  const size = roadMap.length
  const targetEdge = size - 1

  while (queue.length > 0) {
    const { rank, file } = queue.shift()!

    if (visited[rank][file]) {
      continue
    }
    
    visited[rank][file] = true

    // Check if we've reached the opposite edge
    if (direction === "horizontal" && file === targetEdge) return true
    if (direction === "vertical" && rank === targetEdge) return true

    // Add adjacent squares to queue
    const adjacents = [
      { rank: rank - 1, file }, // up
      { rank: rank + 1, file }, // down
      { rank, file: file - 1 }, // left
      { rank, file: file + 1 }, // right
    ]

    for (const pos of adjacents) {
      if (
        pos.rank >= 0 &&
        pos.rank < size &&
        pos.file >= 0 &&
        pos.file < size &&
        roadMap[pos.rank][pos.file] &&
        !visited[pos.rank][pos.file]
      ) {
        queue.push(pos)
      }
    }
  }

  return false
}

function countFlats(game: Game, player: number): number {
  let count = 0

  for (const row of game.board.squares) {
    for (const square of row) {
      if (square.length > 0) {
        const topStone = square.at(-1)!

        if (topStone.type === FlatStone && topStone.player === player) {
          count += 1
        }
      }
    }
  }

  return count
}

function isEmpty(reserve: Reserve) {
  return reserve.stones === 0 && reserve.capstones === 0
}

function map<T, U>(
  squares: readonly T[][],
  apply: (item: T, rank: number, file: number) => U,
): U[][] {
  return squares.map((row, rowIndex) =>
    row.map((item, colIndex) => apply(item, rowIndex, colIndex)),
  )
}
