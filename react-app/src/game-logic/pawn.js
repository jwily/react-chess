import { toNotation, isWhite, belongsToPlayer } from ".";
import { endangersKing } from "./king";

const pawnMoves = (r, c, board, player, kingPosition, options) => {

  const { enPassantTarget } = options;

  // Pawn's direction based on player
  const dir = isWhite(player) ? -1 : 1

  if (r + dir < 0 || r + dir > 7) return;

  const unmoved = isWhite(player) ? r === 6 : r === 1;

  // The two spaces a pawn could possibly attack.
  const attacks = [[r + dir, c - 1], [r + dir, c + 1]]

  const moves = []

  if (board[r + dir][c] === '_') {
    moves.push([r + dir, c]);

    if (unmoved && board[r + dir * 2][c] === '_') {
      moves.push([r + dir * 2, c]);
    }
  }

  attacks.forEach(([newR, newC]) => {

    const cCheck = 0 <= newC && newC < 8;

    if (cCheck) {
      const targetPiece = board[newR][newC];
      const targetNotation = toNotation([newR, newC])

      if ((targetPiece !== '_' && !belongsToPlayer(targetPiece, player))
        || enPassantTarget === targetNotation) {
        moves.push([newR, newC])
      }
    }
  })

  const legalMoves = moves.filter(([row, col]) => {
    return !endangersKing([row, col], [r, c], kingPosition, board, player, enPassantTarget)
  });

  return legalMoves.map((coords) => toNotation(coords));
}

export default pawnMoves;
