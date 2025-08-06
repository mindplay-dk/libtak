export const Player1 = 1 as const
export const Player2 = 2 as const

export type Player1 = typeof Player1
export type Player2 = typeof Player2

export type PlayerNumber = Player1 | Player2

export function Player(number: number): PlayerNumber {
  if (number !== 1 && number !== 2) {
    throw new Error(`invalid player number: ${number}`)
  }

  return number
}

export function opponent(player: PlayerNumber): PlayerNumber {
  return player === Player1 ? Player2 : Player1
}
