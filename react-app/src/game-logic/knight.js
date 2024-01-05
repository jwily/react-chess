import { toNotation } from ".";
import { endangersKing } from "./king";

const knightMoves = (r, c, board, player, kingPosition) => {

  // All hypothetical moves a knight can make
  // expressed in row and column changes

  const deltas = [
    [2, 1],
    [-2, 1],
    [-2, -1],
    [2, -1],
    [1, 2],
    [-1, 2],
    [-1, -2],
    [1, -2],
  ];

  const moves = [];

  // Calculates new possible ending locations
  // checks if those locations are within board constraints

  deltas.forEach((delta) => {
    const newR = r + delta[0];
    const newC = c + delta[1];
    const rCheck = 0 <= newR && newR < 8;
    const cCheck = 0 <= newC && newC < 8;

    if (rCheck && cCheck) {
      moves.push([newR, newC])
    }
  });

  const legalMoves = moves.filter(([row, col]) => {
    return !endangersKing([row, col], [r, c], kingPosition, board, player)
  });

  return legalMoves.map(([row, col]) => toNotation(row, col));
}

export default knightMoves;
