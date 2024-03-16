import { toNotation, isWhite, belongsToPlayer } from ".";
import { endangersKing } from "./king";

const pawnMoves = (r, c, board, player, kingPosition) => {

  // Figure out which direction
  // the pawn should go based on the player
  const nextR = isWhite(player) ? r - 1 : r + 1;
  const firstMoveR = isWhite(player) ? r - 2 : r + 2;

  const startRow = isWhite(player) ? r === 6 : r === 1;

  // The two spaces a pawn could possibly attack.
  const attacks = [[nextR, c - 1], [nextR, c + 1]]

  const moves = []

  // Is this necessary? Shouldn't be once I implement promotion.
  if (nextR < 0) return moves;

  if (board[nextR][c] === '_') moves.push([nextR, c]);

  // If the pawn can move forward and is in its starting row,
  // it can move an additional space.
  if (moves.length && startRow && board[firstMoveR][c] === '_') moves.push([firstMoveR, c]);

  attacks.forEach(([newR, newC]) => {

    // With pawn promotion, row and col limit checks should be unnecessary.
    const rCheck = 0 <= newR && newR < 8;
    const cCheck = 0 <= newC && newC < 8;

    if (rCheck && cCheck) {
      const targetPiece = board[newR][newC];
      const enPassantPossible = board[r][newC].toLowerCase() === 'e';
      if ((targetPiece !== '_' && !belongsToPlayer(targetPiece, player)) || enPassantPossible) {
        moves.push([newR, newC])
      }
    }
  })

  const legalMoves = moves.filter(([row, col]) => {
    return !endangersKing([row, col], [r, c], kingPosition, board, player)
  });

  return legalMoves.map(([row, col]) => toNotation(row, col));
}

export default pawnMoves;
