import knightMoves from "./knight";
import pawnMoves from "./pawn";

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
  'R': {
    player: 'white',
    name: 'rook',
  },
  'B': {
    player: 'white',
    name: 'bishop',
  },
  'N': {
    player: 'white',
    name: 'knight',
    moves: knightMoves
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
  'r': {
    player: 'black',
    name: 'rook',
  },
  'b': {
    player: 'black',
    name: 'bishop',
  },
  'n': {
    player: 'black',
    name: 'knight',
    moves: knightMoves
  },
  'p': {
    player: 'black',
    name: 'pawn',
    moves: pawnMoves
  },
}

export const starts = {
  white: [
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
  ],
  black: [
    ['R', 'N', 'B', 'K', 'Q', 'B', 'N', 'R'],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    ['r', 'n', 'b', 'k', 'q', 'b', 'n', 'r']
  ]
}

export const rotateBoard = (board) => {
  return board.map(row => [...row].reverse()).reverse();
};


// These two functions convert from
// chess notation to coordinates and back

// i.e. 'a8' to [0, 0] and vice versa

const notations = {
  white: {
    nums: [8, 7, 6, 5, 4, 3, 2, 1],
    letters: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
  },
  black: {
    nums: [1, 2, 3, 4, 5, 6, 7, 8],
    letters: ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a']
  }
}

export const toNotation = (row, col, player) => {

  const letters = notations[player].letters;
  const nums = notations[player].nums;
  return letters[col] + nums[row];
}

export const toRowCol = (string, player) => {

  const letters = notations[player].letters;
  const nums = notations[player].nums;

  const letter = string[0];
  const num = parseInt(string[1]);

  return [nums.indexOf(num), letters.indexOf(letter)];
}


// Creates a shallow copy of the board state matrix

export const copyBoard = (board) => {
  return board.map((row) => [...row]);
}
