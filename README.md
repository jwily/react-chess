# Justo Chess

A personal project that I undertook to keep sharpen my React skills and discover what it takes algorithmically to "play" on a chess board represented by a matrix. Live play with websockets and a Flask + PostgreSQL back end.

I love tabletop games, and while I am not an avid chess player myself, I can't help but be in awe of the history and mystique surrounding this legendary game. Thus, when I decided to make use of my programming skills to begin exploring the world of tabletop games, I chose to begin with the grandfather of them all.

## Get Playing

[Justo Chess awaits](https://justochess.onrender.com/) ♞

If you haven't played before, just hit "New Match" on the home page and click the [copy] button at the top right corner of the match screen.
Once you've got your code, send it over to a friend, who can use the code they've received to join your match.

## How It Works

The board that you see and all the action that takes upon it renders off an 8 by 8 graph:

```
[
  ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
  ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
  ['.', '.', '.', '.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.', '.', '.', '.'],
  ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
  ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
]
```

I wanted to represent the board with a graph to practice the basics of traversal algorithms:

```
const bishopMoves = (r, c, board, player) => {

  const moves = [];

  // Define diagonal directions:
  // top-left, top-right, bottom-left, bottom-right
  const directions = [
    [-1, -1], [-1, 1], [1, -1], [1, 1]
  ];

  for (const direction of directions) {
    const [rowDir, colDir] = direction;
    let newR = r + rowDir;
    let newC = c + colDir;

    while (newR >= 0 && newR < 8 && newC >= 0 && newC < 8) {

      const targetPiece = board[newR][newC]

      if (targetPiece === '.') {
        moves.push([newR, newC]);
      } else if (!belongsToPlayer(targetPiece, player)) {
        // Add if enemy piece, then stop
        moves.push([newR, newC]);
        break
      } else {
        // Stop if an occupied square is encountered
        break;
      }
      newR += rowDir;
      newC += colDir;
    }
  }

  return moves;
}
```

The fun part was beginning to figure out what it would take to do things like prevent a playing from checking their own king!

```
export const endangersKing = (newPosition, currPosition, kingPosition, board, player) => {

  // When given a possible move,
  // this function creates a copy of the board
  // in which that move has taken place
  // and then checks if the king is endangered

  // This function is used to prohibit moves that would check one's own king

  const [newR, newC] = newPosition;
  const [currR, currC] = currPosition;
  const [kingR, kingC] = kingPosition;

  const newBoard = copyBoard(board);
  newBoard[newR][newC] = newBoard[currR][currC];
  newBoard[currR][currC] = '.';

  return kingChecked(kingR, kingC, newBoard, player);
}
```

### To Do
- Implement castling and en passant.
- Add a log of messages to communicate with and allow communication between players.
- Implement persistent user profiles and all the possibilities they would open up.
