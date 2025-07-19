import { PlayerNumber } from "./players"

export type Stone = {
  player: PlayerNumber
  type: StoneType
}

export const FlatStone = 'F'
export const StandingStone = 'S'
export const CapStone = 'C'

export type FlatStone = typeof FlatStone
export type StandingStone = typeof StandingStone
export type CapStone = typeof CapStone

export type StoneType = FlatStone | StandingStone | CapStone
