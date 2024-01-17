# justo chess

![chrome_VyRTpsDt7n](https://github.com/jwily/react-chess/assets/87846621/3e69e7b6-b160-4fa0-89de-66f462369287)

A personal project that I undertook to keep my React skills sharp and discover what it takes algorithmically to "play" on a chess board represented by a matrix.

Play live with a friend through the power of Socket.IO, Flask, and SQLAlchemy.

I love tabletop games, and while I am not an avid chess player myself, I can't help but be in awe of the history and mystique surrounding this legendary game. Thus, when I decided to make use of my programming skills to begin exploring the world of tabletop games, I chose to begin with the grandfather of them all.

### Why "justo"?

Before I learned JavaScript and Python, I spent years attaining fluency in Spanish. The process taught me much about myself and what I can accomplish, and changed my life in ways I could never have foreseen.

I chose the name "justo chess" both for what it invokes in English-speakers' minds and what it denotes in Spanish, with its etymological root in fairness and rightness and the connotation that my project is nothing more than good old chess, plain and simple.

## Get Playing

[justo awaits you](https://justochess.onrender.com/)

If you haven't played before, just hit "New Match" on the home page and click the "Copy Code" button at the top right corner of the match screen.
Once you've got your code, send it over to a friend, who can then use the code they've received to join your match.

If you'd like to just share a single screen with a friend in person, enable "Offline Mode," which will simply rotate the board after every move.

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

Background image credit to [Tyler Lastovich](https://unsplash.com/@lastly)
