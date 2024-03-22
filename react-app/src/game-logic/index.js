import kingMoves from "./king";
import queenMoves from "./queen";
import bishopMoves from "./bishop";
import knightMoves from "./knight";
import rookMoves from "./rook";
import pawnMoves from "./pawn";

const pawnMoveEffects = (currRC, targetRC, data, player) => {

  const currR = currRC[0];
  const [targetR, targetC] = targetRC;

  const dir = isWhite(player) ? 1 : -1;

  if (Math.abs(currR - targetR) === 2) {
    data.enPassantTarget = toNotation([targetR + dir, targetC])
  } else if (toNotation([targetR, targetC]) === data.prevEnPassantTarget) {
    data.board[currR][targetC] = '_';
  }

  return data;
}

const kingMoveEffects = (currRC, targetRC, data, player) => {

  const currC = currRC[1];
  const targetC = targetRC[1];

  const kingPosition = `${player}King`;
  const canLong = `${player}CanLong`;
  const canShort = `${player}CanShort`;

  const startingRow = isWhite(player) ? 7 : 0;
  const rookPiece = isWhite(player) ? 'R' : 'r';

  data[kingPosition] = targetRC;

  if (targetC - currC === 2) {
    data.board[startingRow][7] = '_';
    data.board[startingRow][5] = rookPiece;
  } else if (currC - targetC === 2) {
    data.board[startingRow][0] = '_';
    data.board[startingRow][3] = rookPiece;
  }

  if (data[canLong]) {
    data[canLong] = false;
  }

  if (data[canShort]) {
    data[canShort] = false;
  }

  return data;
}

const rookMoveEffects = (currRC, targetRC, data, player) => {

  const currC = currRC[0];

  const canLong = `${player}CanLong`;
  const canShort = `${player}CanShort`;

  if (data[canShort] && currC === 7) {
    data[canShort] = false;
  } else if (data[canLong] && currC === 0) {
    data[canLong] = false;
  }

  return data;
}


// Traditionally, uppercase denotes white
// while lowercase denotes black

// Used to access a piece's relevant data
export const pieceData = {
  'K': {
    player: 'white',
    name: 'king',
    function: kingMoves,
    special: kingMoveEffects
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
    special: rookMoveEffects
  },
  'P': {
    player: 'white',
    name: 'pawn',
    function: pawnMoves,
    special: pawnMoveEffects
  },
  'k': {
    player: 'black',
    name: 'king',
    function: kingMoves,
    special: kingMoveEffects
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
    special: rookMoveEffects
  },
  'p': {
    player: 'black',
    name: 'pawn',
    function: pawnMoves,
    special: pawnMoveEffects
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

export const movePiece = (currRC, targetRC, board) => {

  const [currR, currC] = currRC;
  const [targetR, targetC] = targetRC;

  let currPiece = board[currR][currC];

  // Piece is "moved" on the matrix
  board[targetR][targetC] = currPiece;
  board[currR][currC] = '_';

  return board;

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
