import { toNotation } from ".";
import { data } from ".";

const knightMoves = (r, c, board) => {

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

  const results = [];

  // Calculates new possible ending locations
  // checks if those locations are within board constraints

  deltas.forEach((delta) => {
    const newR = r + delta[0];
    const newC = c + delta[1];
    const rCheck = 0 <= newR && newR < 8;
    const cCheck = 0 <= newC && newC < 8;

    if (rCheck && cCheck) {
      results.push([newR, newC])
    }
  });

  return results.map(([r, c]) => {
    return toNotation(r, c);
  });
}

export default knightMoves
