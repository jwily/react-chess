import knightMoves from "./knight";
import pawnMoves from "./pawn";
import bishopMoves from "./bishop";
import rookMoves from "./rook";

// Traditionally, uppercase denotes white
// while lowercase denotes black

// Used to access a piece's relevant data
export const data = {
  'K': {
    player: 'white',
    name: 'king',
  },
  'Q': {
    player: 'white',
    name: 'queen',
  },
  'B': {
    player: 'white',
    name: 'bishop',
    moves: bishopMoves
  },
  'N': {
    player: 'white',
    name: 'knight',
    moves: knightMoves
  },
  'R': {
    player: 'white',
    name: 'rook',
    moves: rookMoves
  },
  'P': {
    player: 'white',
    name: 'pawn',
    moves: pawnMoves
  },
  'k': {
    player: 'black',
    name: 'king',
  },
  'q': {
    player: 'black',
    name: 'queen',
  },
  'b': {
    player: 'black',
    name: 'bishop',
    moves: bishopMoves
  },
  'n': {
    player: 'black',
    name: 'knight',
    moves: knightMoves
  },
  'r': {
    player: 'black',
    name: 'rook',
    moves: rookMoves
  },
  'p': {
    player: 'black',
    name: 'pawn',
    moves: pawnMoves
  },
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

export const rotateBoard = (board) => {
  return board.map(row => [...row].reverse()).reverse();
};

// Creates a shallow copy of the board state matrix

export const copyBoard = (board) => {
  return board.map((row) => [...row]);
}


// These two functions convert from
// chess notation to coordinates and back
// i.e. 'a8' to [0, 0] and vice versa

const nums = [8, 7, 6, 5, 4, 3, 2, 1];
const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

export const toNotation = (row, col) => {
  return letters[col] + nums[row];
}

export const toRowCol = (string) => {
  const letter = string[0];
  const num = parseInt(string[1]);
  return [nums.indexOf(num), letters.indexOf(letter)];
}

export const isWhite = (player) => player === 'white';
