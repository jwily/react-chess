import { toNotation, isWhite, belongsToPlayer } from ".";
import { endangersKing } from "./king";

const pawnMoves = (r, c, board, player, kingPosition) => {

  // Basically figuring out which direction
  // the pawn should go based on the player
  const nextR = isWhite(player) ? r - 1 : r + 1;
  const firstMove = isWhite(player) ? r === 6 : r === 1;
  const firstMoveR = isWhite(player) ? r - 2 : r + 2;
  const attacks = [[nextR, c - 1], [nextR, c + 1]]

  const moves = []

  if (nextR < 0) return moves;

  if (board[nextR][c] === ' ') moves.push([nextR, c]);

  if (moves.length && firstMove && board[firstMoveR][c] === ' ') moves.push([firstMoveR, c]);

  attacks.forEach(([newR, newC]) => {
    const rCheck = 0 <= newR && newR < 8;
    const cCheck = 0 <= newC && newC < 8;
    const targetAvailable = board[newR][newC] !== ' ';

    if (rCheck && cCheck && targetAvailable) {

      const piece = board[newR][newC];

      if (!belongsToPlayer(piece, player)) moves.push([newR, newC])
    }
  })

  const legalMoves = moves.filter(([row, col]) => {
    return !endangersKing([row, col], [r, c], kingPosition, board, player)
  });

  return legalMoves.map(([row, col]) => toNotation(row, col));
}

export default pawnMoves;
