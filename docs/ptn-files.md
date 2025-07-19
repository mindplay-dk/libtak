# [Portable Tak Notation](https://ustak.org/portable-tak-notation/)

_Portable Tak Notation (PTN) is a system for recording the moves of a game of Tak. It was developed by Benjamin Wochinski in 2015, during the beta phase of the game and is loosely based on the [PGN notation](https://en.wikipedia.org/wiki/Portable_Game_Notation) of chess._

When sharing a game recorded in PTN format, additional metadata must be included as specified in the PTN File Format. Below is a partial game example with the basic required elements. Following that is a full description of how the move notation is formatted and constructed.

#### Short PTN File Example

```
[Site "PlayTak.com"]
[Event "Online Play"]
[Date "2018.10.28"]
[Time "16:10:44"]
[Player1 "NohatCoder"]
[Player2 "fwwwwibib"]
[Clock "10:0 +20"]
[Result "R-0"]
[Size "6"]

1. a6 f6
2. d4 c4
3. d3 c3
4. d5 c5
5. d2 Ce4
6. c2 e3
7. e2 b2
8. Cb3 1e4<1
9. 1d3<1 Sd1
10. a3 1d1+1
```

### Basic Format

The basic arrangement of PTN moves is similar to that of the PGN of chess. Each move is first numbered. The number must be followed by a period. Then a space and the move notation for player 1, followed by another space and the move notation for player 2.

There is another space, or a newline, before the next move number.

### Board

The squares on the Tak board are identified with standard algebraic notation. The lower (or nearest) left square for player 1 is identified as `a1`, this will be called a _square identifier_. The files are lettered across the bottom of the board, and the ranks are numbered up the side. As the board size in Tak is able to vary, the upper right square can range from `d4` to `h8`. The file letters are always lowercase.

In general, the `a1` square is a dark square purely by force of habit, but as there is no difference due to orientation of squares in Tak this is not an official standard and makes no difference to play. Also, though the `1` rank is presumed to be on the player 1 side of the board, it is not strictly necessary for players to sit opposite one another since the pieces are placed arbitrarily on the board during play. Only ensure that the personal space of a player is not being encroached upon.

### Move Notation

PTN is essentially condensed english in the format of a set of instructions.  
For example:

Take `5` stones from square `b4` and move them `right` dropping `2` stones, `1` stone, then `2` stones as you come to each square.

OR in PTN format:

`5b4>212`

#### Stone Identifiers

At the beginning of a game of Tak, you start by placing pieces on the board. There are 3 piece types: Flat Stones, Standing Stones, and Capstones. These are called the _stone identifiers_ and are represented by an `F`, `S`, and `C` throughout the notation. These are always uppercase letters.

#### Direction Identifiers

When a stone or stack of stones is being moved on the Tak board, the direction of the move is indicated by the _direction identifiers_. The four possible move directions are represented by the symbols `<` `>` `+` `-`.

The `<` and `>` identifiers represent a movement across files. `<` moves toward the `a` file, and `>` moves the opposite direction, away from the `a` file. It is easiest to think of these simply as arrows which point in the direction of movement from player 1’s perspective, `<` moving to the _left_, and `>` moving to the _right_.

The `+` and `-` identifiers represent movement up and down ranks. `-` moves toward the `1` rank, and `+` moves the opposite direction, away from the `1` rank. It helps to think of these as simple mathematical operators, so that `+` indicates “adding” or moving _up_ in rank, and `-` indicates “subtraction” or moving _down_ in rank.

To simplify keeping notation by hand, player 2 may use directional notation from their perspective, but this should be noted on the record.

#### Placing Stones

The notation format for placing stones is: `(stone)(square)`.

It is recognized that flat stones will be by far the most common stone placed in a game of Tak, and so the stone identifier may be omitted in that case and a flat stone will be assumed.

##### Examples

| Move | Notation |
| --- | --- |
| Place flat stone at a1 | `a1` |
| Place capstone at b4 | `Cb4` |
| Place standing stone at d3 | `Sd3` |

#### Moving Stones

The notation format for moving one or more stones is: `(count)(square)(direction)(drop counts)(stone)`

1.  The _count_ of stones to be lifted from a square is given. This may be omitted only if the count is 1.
2.  The _square_ wich stones are being moved from is given. This is always required.
3.  The direction to move the stones is given. This is always required.
4.  The number of stones to drop on each square in the given direction are listed, without spaces. This may be omitted if all of the stones given in the count are dropped on a square immediately adjacent to the source square. If the stack is moving more than one square, all drop counts must be listed and must add up to equal the lift count from parameter 1 above.
5.  The stone type of the top stone of the moved stack is given. If the top stone is a flat stone the `F` identifier is never needed, flat stones are always assumed. If the top stone is a standing stone or capstone, the `S` or `C` can be used, though it is not required and infrequently used.

##### Examples

| Move | Notation |
| --- | --- |
| Move a single stone from a1 to b1 | `a1>` |
| Move 4 stones from c3 to d3 | `4c3>` |
| Move 3 stones from b2, dropping one each on b3, b4, b5 | `3b2+111` |
| Move 2 stones from d4 to d3. | `2d4-2` |
| Move 5 stones from e4 toward c4, dropping 2 and then 3 as you move | `5e4<23` |

### Game End

The result of the game is recorded in the notation after the final move, separated by a space.

A road win for player 1 and player 2 are notated respectively `R-0` and `0-R`.  
A flat win for player 1 and player 2 are notated respectively `F-0` and `0-F`.  
A win by resignation or time for player 1 and player 2 are notated respectively `1-0` and `0-1`.  
A draw is notated `1/2-1/2`.

### Informational Marks

Outside of the essential move notation there are 4 additional characters which can be added to a move to give additional information or commentary regarding that move. These are always placed _at the end_ of the move notation.

The most strongly recommended mark is the asterisk `*`. This is placed on a move where a capstone has flattened a standing stone. This helps greatly in recreating a game, especially if players wish to “undo” a move to explore an alternate line.

The second mark is a single quote `'`. This denotes a “tak”: the existence of a road opportunity on your next turn. Whether or not you verbally call the “tak”, it is recommended practice to included the mark in your notation to assist with later evaluation. Along with it two single quotes, or a double quote, `''` is used to denote a “Tinuë”: the existence of an unblockable road threat, and hence a guaranteed win. As tak threats are sometimes missed on the board, this mark might often be added to additional moves when reviewing a game.

The other two characters are the `!` and `?`, which are purely representative of a subjective evaluation of the move. The `!` denotes a surprising or especially good move, while the `?` represents a questionable move or blunder. They are often used in pairs to emphasize a move as (for example) an outright blunder `??` or questionable but surprising `?!`.

From worst to best the evaluations would roughly be: `??` `?` `?!` `!?` `!` `!!`

### Comments

Comments can be added anywhere between moves in the notation to add whatever information you like to the game.

Comments are enclosed in curly brackets `{ }` and separated from any other element by a space or newline. Within the brackets you can include any information you wish and use any character except for the closing bracket `}`, which would end the comment.
