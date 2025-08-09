import { describe, test, expect } from "vitest"
import dedent from "dedent"

import { parsePTN, parsePTNData } from "../notation/ptn"
import { hasWinner } from "./win"

describe("3.1. Road Win", () => {
  test("winding road win via capstone", () => {
    const game = parsePTN(dedent`
      [Size "5"]

      1. a5 e4
      2. d4 b5
      3. c4 b4
      4. e3 b3
      5. d3 b2
      6. c3 d2
      7. e3+ e3
      8. d3+ d3
      9. c3+ Cc2
      0-R
    `)

    expect(hasWinner(game)).toEqual({ condition: "road", winner: 2 })
  })

})

test("Rule 3.2: flat win", () => {
  const game = parsePTN(dedent(`
    [Size "3"]

    1. a3 c3
    2. b3 a2
    3. a1 b2
    4. c2 c1
    5. b1
    F-0
  `))

  expect(hasWinner(game)).toEqual({ condition: "flat", winner: 1 })
})

test("Rule 3.2: draw by flat count", () => {
  const game = parsePTN(dedent(`
    [Size "3"]

    1. a3 b3
    2. c3 a2
    3. Sa1 b2
    4. c2 c1
    5. b1
    1/2-1/2
  `))

  expect(hasWinner(game)).toEqual({ condition: "draw" })
})

test("Rule 3.3: win by double road", () => {
  const game = parsePTN(dedent(`
    [Size "3"]

    1. a3 b3
    2. c3 c2
    3. b2 c2+
    4. b3> a2
    5. b2< a3-
    6. b2 b1
    7. b2< b2
    8. a1 c1
    9. 2c3<11
    R-0
  `))

  expect(hasWinner(game)).toEqual({ condition: "road", winner: 1 })
})
