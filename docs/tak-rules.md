# Tak Rules

## 1. Starting Play

1.1. Board Setup

* The board must be square: standard sizes are 3×3, 4×4, 5×5, 6×6, 7x7, or 8×8.
* The board starts empty.
* Players each have a supply of stones and capstones based on board size:

| Board Size | Stones per Player | Capstones per Player |
| ---------- | ----------------- | -------------------- |
| 3×3        | 10                | 0                    |
| 4×4        | 15                | 0                    |
| 5×5        | 21                | 1                    |
| 6×6        | 30                | 1                    |
| 7x7        | 40                | 2                    |
| 8×8        | 50                | 2                    |

* Players begin with all their pieces in **reserve** (not yet on the board).

1.2. First Turn

* Determine the first player randomly in the first game; alternate thereafter.
* On the first two turns:
  * The first player places a Black flat stone.
  * Black then places a White flat stone.
* After these two placements, White takes the first regular turn.

## 2. Taking Turns

On a turn, a player must **either** place a piece (from their reserve) **or** move a stack they control.

### 2.1. Placing Stones

2.1.1. Piece Types

* **Flat Stone**: Can be part of a road and can be stacked upon.
* **Standing Stone (Wall)**: Cannot be part of a road and cannot be stacked upon.
* **Capstone**: Counts as part of a road; cannot be stacked upon; can flatten walls.

2.1.2. Placement Rules

* Place one piece (flat, wall, or capstone) on any **empty** space.
* Pieces cannot be placed directly onto other pieces.
* Standing stones and capstones may only be placed from reserve; they cannot be created by movement.
* If a player places their last piece or fills the last board space, the game ends immediately.

### 2.2. Moving Stones

2.2.1. Movement

* Only the player whose piece is on top of a stack may move it.
* A move must be in a **straight line** (orthogonally); no diagonal moves.
* The moving player may take **up to the board's width** (the carry limit, e.g., 5 in a 5×5 game) of pieces from the top of a stack.

2.2.2. Dropping Stones

* At least one stone must be dropped on each space along the path.
* Pieces dropped must come from the **bottom** of the carried stack.
* Stones may be dropped onto flat stones (or empty squares) but not onto standing stones or capstones.
* There is **no limit** to how tall a stack may become.

2.2.3. Flattening Walls

* A **capstone** may flatten a **standing stone** (wall) by moving onto it **alone**, as the final step of a move.
* A capstone may be part of a taller stack during movement, but must be the **only piece** to move onto the wall.
* A capstone may flatten a wall *even if the wall is on top of a stack*; the wall becomes a flat stone, and the stack beneath remains unchanged.

## 3. Winning

3.1. Road Win

* A player wins by forming a continuous orthogonal path (a **road**) connecting opposite board edges.
* Only flat stones and capstones may be part of a road; standing stones do not count.
* The road may lie across flat stones or capstones on top of stacks.
* Roads may turn, but must be orthogonal; diagonal connections do not count.
* The game ends immediately when a road is completed.

3.2. Flat Win

* If a player places their last piece, or if the board is full and no road exists, the game ends.
* The player with the **most flat stones on top of stacks** wins.
* Do not count covered flats, standing stones, or capstones.
* If the count is tied, the game is a **draw**.

3.3. Double Road (Rare)

* If both players complete a road in the same move, the **active** player always wins, *regardless* of whose road is completed.

3.4. Calling "Tak"

* Declaring "Tak" when threatening a win is **optional**, like calling "check" in chess.
