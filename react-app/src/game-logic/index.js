import knightMoves from "./knight";
import kingMoves, { kingMoveEffects } from "./king";
import pawnMoves, { pawnMoveEffects } from "./pawn";
import longRangeMoves, { rookMoveEffects } from "./long-range";

export const isWhite = (player) => player === 'white';

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

export const initialGameState = {
  board: start,
  turn: 'white',
  whiteKing: [7, 4],
  blackKing: [0, 4],
  whiteCanLong: true,
  whiteCanShort: true,
  blackCanLong: true,
  blackCanShort: true,
  enPassantTarget: '',
  pawnPromotion: '',
}

export const gameReducer = (state, action) => {
  switch (action.type) {
    case 'updateField':
      return { ...state, [action.field]: action.value };

    case 'reset':
      return initialGameState;

    case 'loadData':
      return { ...state, ...action.payload };

    default:
      throw new Error('Unsupported action type');
  }
}

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

class Node {
  constructor(value) {
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}

class Queue {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  enqueue(value) {
    const newNode = new Node(value);

    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail.next = newNode;
      newNode.prev = this.tail;
      this.tail = newNode;
    }

    this.length++;
  }

  dequeue() {
    if (!this.head) return null;

    const temp = this.head;
    if (this.head === this.tail) {
      this.head = null;
      this.tail = null;
    } else {
      this.head = this.head.next;
      this.head.prev = null;
      temp.next = null;
    }

    this.length--;
    return temp.value;
  }
}

export const findPieceBFS = (start, target, board) => {

  const queue = new Queue();
  queue.enqueue(start)

  const visited = new Set([start]);

  const deltas = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
    [1, 1],
    [-1, -1],
    [-1, 1],
    [1, -1],
  ]

  while (queue.length) {

    const curr = queue.dequeue();
    const [currR, currC] = toRowCol(curr);

    const piece = board[currR][currC];
    if (piece === target) return [currR, currC];

    for (const [diffR, diffC] of deltas) {

      const newR = currR - diffR;
      const newC = currC - diffC;

      const rowCheck = newR > -1 && newR < 8;
      const colCheck = newC > -1 && newC < 8;

      if (rowCheck && colCheck) {

        const square = toNotation([newR, newC]);

        if (!visited.has(square)) {

          visited.add(square);
          queue.enqueue(square);

        }
      }
    }
  }

  return [null, null];
}

export const checkForPromotion = (board) => {

  const firstRow = board[0];
  const eigthRow = board[7];

  for (let i = 0; i <= 7; i++) {
    if (firstRow[i] === 'P') return toNotation([0, i]);
  }

  for (let i = 0; i <= 7; i++) {
    if (eigthRow[i] === 'p') return toNotation([7, i]);
  }

  return '';

}
