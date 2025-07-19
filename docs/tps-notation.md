# [Tak Positional System](https://ustak.org/tak-positional-system-tps/)

The Tak Positional System (TPS) is a notational system used to describe the position of all pieces on the board at a given moment.

This page describes the technical specification for a TPS string and this should be considered standard. TPS was modeled after [FEN](https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation) for chess.

### TPS Tag Format

A TPS string follows the same basic format as other tags that can be used in a PTN File. It is enclosed in square brackets, the tag name is TPS, and the actual TPS string is enclosed in double quotes:

Example: `[TPS "x5/x5/x5/x5/x5 1 1"]`

The following sections go into detail regarding the TPS string.

### Turn and Move

The last two numbers in the TPS string (separated from the board state by spaces) are the turn identifier and the move counter, respectively.

The turn identifier is simply filled with either a `1` or a `2`, which denotes the player who’s turn it is to move next.

The move counter denotes which move is currently due to be played. This is never a `0`, the move due to be played at the beginning of the game is move `1`. For the purposes of notation and score keeping, a full “move” is counted as a turn taken by each player, as in chess. For example, after each player has made their initial move, the move counter would then be incremented to `2`, to show that the game is headed into the second move for each player.

### Board Description

The Board is described by row, starting at the “top”, or highest row number. Each row is divided by a forward slash `/`. Within each row, the pieces on each square are described by a list of numbers, separating each square by a comma `,`. The exception to this is the case of adjacent empty squares, which is described in the following.

#### Empty Squares

Empty squares are represented by an `x` in the TPS string.  
Multiple empty squares adjacent to each other in the same row can be condensed by specifying the number of them, as in `x3`.

Example of an empty 5×5 board `[TPS "x5/x5/x5/x5/x5 1 1"]`

#### Flat Stones

Flat stones are by far the most common piece occurring in a game of Tak, and so their presence on a square is indicated simply with a number to denote the owning player. For example, a board only with player 2 having a road accross row 5 is described as such: `2,2,2,2,2/x5/x5/x5/x5`

When there is a stack of stones on a square more numbers are added to the square description.

-   It is _very important_ to remember, the order of the stones for each square in TPS is from **bottom to top**.

A square with 2 flat stones on it, first a player 1 stone, and then a player 2 stone on top, would be denoted by a `12` for that square. This can be extrapolated out to any height stack, such as four stones for player 2 with then two player 1 stones on top would be notated as `222211`. This is continued, comma separated, for every square.

#### Standing and Cap Stones

Standing stones and Cap stones are identified by a trailing `S` or `C` on the notation for a square, as they can only occur on the top of a stack. So if the stone on the top of the stack in our last example were a standing stone, it would be notated as `222211S`.

-   Note that this modifies the last stone on the stack. It does not represent a stone itself since the player number must still be identified for the stone.

### TPS Full Example

`[TPS "x3,12,2S/x,22S,22C,11,21/121,212,12,1121C,1212S/21S,1,21,211S,12S/x,21S,2,x2 1 26"]`
