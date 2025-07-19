import { PlayerNumber } from "./players"

export type Stone = {
  player: PlayerNumber
  type: StoneType
}

export const FlatStone = 'F' as const
export const StandingStone = 'S' as const
export const CapStone = 'C' as const

export type FlatStone = typeof FlatStone
export type StandingStone = typeof StandingStone
export type CapStone = typeof CapStone

export type StoneType = FlatStone | StandingStone | CapStone
