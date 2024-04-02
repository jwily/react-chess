import kingMoves from "./king";
import knightMoves from "./knight";
import pawnMoves from "./pawn";
import longRangeMoves from "./long-range";

export const isWhite = (player) => player === 'white';

const pawnMoveEffects = (player) => {

  const dir = isWhite(player) ? 1 : -1;
  // const promotionRank = isWhite(player) ? 0 : 7;

  return (currRC, targetRC, data) => {

    const currR = currRC[0];
    const [targetR, targetC] = targetRC;

    if (Math.abs(currR - targetR) === 2) {
      data.enPassantTarget = toNotation([targetR + dir, targetC])
    } else if (toNotation([targetR, targetC]) === data.prevEnPassantTarget) {
      data.board[currR][targetC] = '_';
    }

    // if (targetR === promotionRank) {
    //   data.turn = data.turn === 'white' ? 'black' : 'white';
    // }

    return data;

  }
}

const kingMoveEffects = (player) => {

  const kingPosition = `${player}King`;
  const canLong = `${player}CanLong`;
  const canShort = `${player}CanShort`;

  const startingRow = isWhite(player) ? 7 : 0;
  const rookPiece = isWhite(player) ? 'R' : 'r';

  return (currRC, targetRC, data) => {

    const currC = currRC[1];
    const targetC = targetRC[1];

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
}

const rookMoveEffects = (player) => {

  const canLong = `${player}CanLong`;
  const canShort = `${player}CanShort`;

  return (currRC, targetRC, data) => {

    const currC = currRC[1];

    if (data[canShort] && currC === 7) {
      data[canShort] = false;
    } else if (data[canLong] && currC === 0) {
      data[canLong] = false;
    }

    return data;

  }
}

// Traditionally, uppercase denotes white
// while lowercase denotes black

// Used to access a piece's relevant data
export const pieceData = {
  'K': {
    player: 'white',
    name: 'king',
    moves: kingMoves,
    effects: kingMoveEffects('white')
  },
  'Q': {
    player: 'white',
    name: 'queen',
    moves: longRangeMoves('queen'),
    effects: null
  },
  'B': {
    player: 'white',
    name: 'bishop',
    moves: longRangeMoves('bishop'),
    effects: null
  },
  'N': {
    player: 'white',
    name: 'knight',
    moves: knightMoves,
    effects: null
  },
  'R': {
    player: 'white',
    name: 'rook',
    moves: longRangeMoves('rook'),
    effects: rookMoveEffects('white')
  },
  'P': {
    player: 'white',
    name: 'pawn',
    moves: pawnMoves,
    effects: pawnMoveEffects('white')
  },
  'k': {
    player: 'black',
    name: 'king',
    moves: kingMoves,
    effects: kingMoveEffects('black')
  },
  'q': {
    player: 'black',
    name: 'queen',
    moves: longRangeMoves('queen'),
    effects: null
  },
  'b': {
    player: 'black',
    name: 'bishop',
    moves: longRangeMoves('bishop'),
    effects: null
  },
  'n': {
    player: 'black',
    name: 'knight',
    moves: knightMoves,
    effects: null
  },
  'r': {
    player: 'black',
    name: 'rook',
    moves: longRangeMoves('rook'),
    effects: rookMoveEffects('black')
  },
  'p': {
    player: 'black',
    name: 'pawn',
    moves: pawnMoves,
    effects: pawnMoveEffects('black')
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

  board[targetR][targetC] = board[currR][currC];
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

export const isCheckmated = (board, player, kingPosition, options) => {

  let count = 0;
  const pieces = isWhite(player) ? 'KQBNRP' : 'kqbnrp';

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {

      const piece = board[r][c];
      if (piece !== '_' && pieces.includes(piece)) {

        const movesFunction = pieceData[piece]['moves'];
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

// export const findPieceBFS = (start, target, board) => {

//   const queue = [start];
//   const visited = new Set([start]);

//   const deltas = [
//     [0, 1],
//     [0, -1],
//     [1, 0],
//     [-1, 0],
//     [1, 1],
//     [-1, -1],
//     [-1, 1],
//     [1, -1],
//   ]

//   while (queue.length) {

//     const curr = queue.shift();
//     const [currR, currC] = toRowCol(curr);

//     const piece = board[currR][currC];
//     if (piece === target) return [currR, currC];

//     for (const [diffR, diffC] of deltas) {

//       const newR = currR - diffR;
//       const newC = currC - diffC;

//       const rowCheck = newR > -1 && newR < 8;
//       const colCheck = newC > -1 && newC < 8;

//       if (rowCheck && colCheck) {

//         const square = toNotation([newR, newC]);

//         if (!visited.has(square)) {

//           visited.add(square);
//           queue.push(square);

//         }
//       }
//     }
//   }

//   return [null, null];
// }
