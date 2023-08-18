import { data, toNotation, isWhite } from ".";

const pawnMoves = (r, c, board, player) => {

  // Basically figuring out which direction
  // the pawn should go based on the player
  const nextR = isWhite(player) ? r - 1 : r + 1;
  const firstMove = isWhite(player) ? r === 6 : r === 1;
  const firstMoveR = isWhite(player) ? r - 2 : r + 2;
  const attacks = [[nextR, c - 1], [nextR, c + 1]]
  const pawnPlayer = board[r][c] === 'P' ? 'white' : 'black';

  const results = []

  if (nextR < 0) return results;

  if (board[nextR][c] === '.') results.push([nextR, c]);

  if (results.length && firstMove) results.push([firstMoveR, c]);

  attacks.forEach(([newR, newC]) => {
    const rCheck = 0 <= newR && newR < 8;
    const cCheck = 0 <= newC && newC < 8;
    const targetAvailable = board[newR][newC] !== '.';
    const isOpposing = data[board[newR][newC]]?.player !== pawnPlayer

    if (rCheck && cCheck && targetAvailable && isOpposing) results.push([newR, newC])
  })

  return results.map(([row, col]) => {
    return toNotation(row, col);
  });
}

export default pawnMoves;
