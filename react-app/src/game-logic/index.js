import kingMoves from "./king";
import queenMoves from "./queen";
import bishopMoves from "./bishop";
import knightMoves from "./knight";
import rookMoves from "./rook";
import pawnMoves from "./pawn";

// Traditionally, uppercase denotes white
// while lowercase denotes black

// Used to access a piece's relevant data
export const pieceData = {
  'K': {
    player: 'white',
    name: 'king',
    function: kingMoves
  },
  'Q': {
    player: 'white',
    name: 'queen',
    function: queenMoves
  },
  'B': {
    player: 'white',
    name: 'bishop',
    function: bishopMoves
  },
  'N': {
    player: 'white',
    name: 'knight',
    function: knightMoves
  },
  'R': {
    player: 'white',
    name: 'rook',
    function: rookMoves
  },
  'P': {
    player: 'white',
    name: 'pawn',
    function: pawnMoves
  },
  'E': {
    player: 'white',
    name: 'pawn',
    function: pawnMoves
  },
  'k': {
    player: 'black',
    name: 'king',
    function: kingMoves
  },
  'q': {
    player: 'black',
    name: 'queen',
    function: queenMoves
  },
  'b': {
    player: 'black',
    name: 'bishop',
    function: bishopMoves
  },
  'n': {
    player: 'black',
    name: 'knight',
    function: knightMoves
  },
  'r': {
    player: 'black',
    name: 'rook',
    function: rookMoves
  },
  'p': {
    player: 'black',
    name: 'pawn',
    function: pawnMoves
  },
  'e': {
    player: 'black',
    name: 'pawn',
    function: pawnMoves
  }
}

export const start = [
  ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
  ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
  ['.', '.', '.', '.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.', '.', '.', '.'],
  ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
  ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
]

// Creates a deep copy of the board state matrix

export const copyBoard = (board) => {
  return board.map((row) => [...row]);
}

// These two functions convert from
// chess notation to coordinates and back
// i.e. 'a8' to [0, 0] and vice versa

const nums = '87654321';
const letters = 'abcdefgh';

export const toNotation = (row, col) => {
  return letters[col] + nums[row];
}

export const toRowCol = (string) => {
  const letter = string[0];
  const num = parseInt(string[1]);
  return [nums.indexOf(num), letters.indexOf(letter)];
}

export const isWhite = (player) => player === 'white';

export const isCheckmated = (board, player, kingPosition) => {

  let count = 0;
  const pieces = isWhite(player) ? 'KQBNRP' : 'kqbnrp';

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {

      const piece = board[r][c];
      if (piece !== '.' && pieces.includes(piece)) {

        const movesFunction = pieceData[piece].function;
        const possibleMoves = movesFunction(r, c, board, player, kingPosition);
        count += possibleMoves.length;
      }
    }
  }

  return count === 0;
}

export const belongsToPlayer = (piece, player) => {

  const lowercased = piece.toLowerCase();
  if (isWhite(player)) return lowercased !== piece;
  else return lowercased === piece;

}
