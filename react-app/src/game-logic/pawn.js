import { data, toNotation } from ".";

const pawnMoves = (r, c, board, player) => {

  const results = []

  if (r - 1 < 0) return results;

  const pawnPlayer = board[r][c] === 'P' ? 'white' : 'black';
  const firstMove = r === 6;

  if (board[r - 1][c] === ' ') {
    results.push([r - 1, c]);
  }

  if (results.length === 1 && board[r - 2][c] === ' ' && firstMove) {
    results.push([r - 2, c]);
  }

  const attacks = [[r - 1, c - 1], [r - 1, c + 1]];
  attacks.forEach(([newR, newC]) => {
    const rCheck = 0 <= newR && newR < 8;
    const cCheck = 0 <= newC && newC < 8;
    const targetAvailable = board[newR][newC] !== ' ';
    const isOpposing = data[board[newR][newC]]?.player !== pawnPlayer

    if (rCheck && cCheck && targetAvailable && isOpposing) results.push([newR, newC])
  })

  return results.map(([row, col]) => {
    return toNotation(row, col, player);
  });
}

export default pawnMoves;
