import { toNotation } from ".";

const kingMoves = (r, c, board, player) => {

  const deltas = [
    [-1, 1],
    [1, -1],
    [1, 1],
    [-1, -1],
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1]
  ];

  const moves = [];

  deltas.forEach((delta) => {
    const newR = r + delta[0];
    const newC = c + delta[1];
    const rCheck = 0 <= newR && newR < 8;
    const cCheck = 0 <= newC && newC < 8;

    if (rCheck && cCheck) {
      moves.push([newR, newC])
    }
  });

  return moves.map(([row, col]) => toNotation(row, col));
}

export default kingMoves;
