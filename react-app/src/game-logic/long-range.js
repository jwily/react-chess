import { belongsToPlayer, toNotation } from ".";
import { endangersKing } from "./king";

const longRangeMoves = (piece) => {

  const directions = [];

  if (piece === 'bishop' || piece === 'queen') {
    directions.push([-1, -1], [-1, 1], [1, -1], [1, 1]);
  }

  if (piece === 'rook' || piece === 'queen') {
    directions.push([-1, 0], [1, 0], [0, -1], [0, 1]);
  }

  return (r, c, board, player, kingPosition) => {

    const moves = [];

    for (const direction of directions) {
      const [rowDir, colDir] = direction;
      let newR = r + rowDir;
      let newC = c + colDir;

      while (newR >= 0 && newR < 8 && newC >= 0 && newC < 8) {

        const targetPiece = board[newR][newC]

        if (targetPiece === '_') {
          moves.push([newR, newC]);
        } else if (!belongsToPlayer(targetPiece, player)) {
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

    const legalMoves = moves.filter(([row, col]) => {
      return !endangersKing([row, col], [r, c], kingPosition, board, player)
    });

    return legalMoves.map((coords) => toNotation(coords));
  }
}

export default longRangeMoves;
