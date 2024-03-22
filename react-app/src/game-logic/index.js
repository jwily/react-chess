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
    function: kingMoves,
    special: null
  },
  'Q': {
    player: 'white',
    name: 'queen',
    function: queenMoves,
    special: null
  },
  'B': {
    player: 'white',
    name: 'bishop',
    function: bishopMoves,
    special: null
  },
  'N': {
    player: 'white',
    name: 'knight',
    function: knightMoves,
    special: null
  },
  'R': {
    player: 'white',
    name: 'rook',
    function: rookMoves,
    special: null
  },
  'P': {
    player: 'white',
    name: 'pawn',
    function: pawnMoves,
    special: null
  },
  'E': {
    player: 'white',
    name: 'pawn',
    function: pawnMoves,
    special: null
  },
  'k': {
    player: 'black',
    name: 'king',
    function: kingMoves,
    special: null
  },
  'q': {
    player: 'black',
    name: 'queen',
    function: queenMoves,
    special: null
  },
  'b': {
    player: 'black',
    name: 'bishop',
    function: bishopMoves,
    special: null
  },
  'n': {
    player: 'black',
    name: 'knight',
    function: knightMoves,
    special: null
  },
  'r': {
    player: 'black',
    name: 'rook',
    function: rookMoves,
    special: null
  },
  'p': {
    player: 'black',
    name: 'pawn',
    function: pawnMoves,
    special: null
  },
  'e': {
    player: 'black',
    name: 'pawn',
    function: pawnMoves,
    special: null
  }
}

export const start = [
  ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
  ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
  ['_', '_', '_', '_', '_', '_', '_', '_'],
  ['_', '_', '_', '_', '_', '_', '_', '_'],
  ['_', '_', '_', '_', '_', '_', '_', '_'],
  ['_', '_', '_', '_', '_', '_', '_', '_'],
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

export const toNotation = (coordinates) => {
  const [row, col] = coordinates;
  return letters[col] + nums[row];
}

export const toRowCol = (string) => {
  const letter = string[0];
  const num = parseInt(string[1]);
  return [nums.indexOf(num), letters.indexOf(letter)];
}

export const isWhite = (player) => player === 'white';

export const isCheckmated = (board, player, kingPosition, options) => {

  let count = 0;
  const pieces = isWhite(player) ? 'KQBNRP' : 'kqbnrp';

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {

      const piece = board[r][c];
      if (piece !== '_' && pieces.includes(piece)) {

        const movesFunction = pieceData[piece].function;
        const possibleMoves = movesFunction(r, c, board, player, kingPosition, options);
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
