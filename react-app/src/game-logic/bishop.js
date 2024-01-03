import { data, toNotation } from ".";

const bishopMoves = (r, c, board, player, kingPosition) => {

  const moves = [];

  // Define diagonal directions:
  // top-left, top-right, bottom-left, bottom-right
  const directions = [
    [-1, -1], [-1, 1], [1, -1], [1, 1]
  ];

  for (const direction of directions) {
    const [rowDir, colDir] = direction;
    let newR = r + rowDir;
    let newC = c + colDir;

    while (newR >= 0 && newR < 8 && newC >= 0 && newC < 8) {

      const targetPiece = board[newR][newC]

      if (targetPiece === '.') {
        moves.push([newR, newC]);
      } else if (player !== data[targetPiece].player) {
        // Add if enemy piece, then stop
        moves.push([newR, newC]);
        break
      } else {
        // Stop if an occupied square is encountered
        break;
      }
      newR += rowDir;
      newC += colDir;
    }
  }

  return moves.map(([row, col]) => toNotation(row, col));
}

export default bishopMoves;
