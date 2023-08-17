import knightMoves from "./knight";

// Traditionally, uppercase denotes white
// while lowercase denotes black

// Used to access a piece's relevant data
export const data = {
  'K': {
    player: 'white',
  },
  'Q': {
    player: 'white',
  },
  'R': {
    player: 'white',
  },
  'B': {
    player: 'white',
  },
  'N': {
    player: 'white',
    moves: knightMoves
  },
  'P': {
    player: 'white',
  },
  'k': {
    player: 'black',
  },
  'q': {
    player: 'black',
  },
  'r': {
    player: 'black',
  },
  'b': {
    player: 'black',
  },
  'n': {
    player: 'black',
    moves: knightMoves
  },
  'p': {
    player: 'black',
  },
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
  return [nums.indexOf(num), letters.indexOf(letter)]
}


// Creates a shallow copy of the board state matrix

export const copyBoard = (board) => {
  return board.map((row) => [...row]);
}
