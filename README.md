# `libtak`

A TypeScript library for representing, parsing, and manipulating Tak game states, moves, and notations.

[![License](https://img.shields.io/badge/license-MPL--2.0-green)](https://opensource.org/license/mpl-2-0)

- **Core Models and Types**
  - Utility functions for board creation and updates, reserve management, etc.
  - `Board`, `Game`, `Stone`, `Turn`, and related types are provided for representing game states with strict type-checking.

- **Game Play Logic**
  - Full support for Tak rules, including opening rules, move validation, and winning conditions.
  - `play(game: Game, turn: Turn): Game` - apply a move or placement to a game state, returning the new state.
  - `hasWinner(game: Game): WinState` - detects road wins, flat wins, and draws according to Tak rules.

- **[Portable Tak Notation](https://ustak.org/portable-tak-notation/) (PTN) Support**
  - `parsePTNData(ptn: string): { metadata, turns }` - Parse PTN file contents into metadata and turns.
  - `createPTNData(turns: Turn[], boardSize, metadata): string` - Create PTN file contents from a list of turns.
  - `parsePTN(ptn: string): Game` - Parse a PTN file and recreate the resulting `Game` state.
  - `parseTurn(size: number, turn: string): Turn` - Parse a single PTN turn notation.

- **[Tak Positional System](https://ustak.org/tak-positional-system-tps/) (TPS) Support**
  - `parseTPS(tps: string): Game` - Parse a TPS string and return a `Game` instance.
  - `createTPS(game: Game): string` - Serialize a `Game` instance to a TPS string.
