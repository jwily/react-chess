import { data, toNotation } from ".";

const pawnMoves = (r, c, board, player) => {

  const nextR = player === 'white' ? r - 1 : r + 1;
  const firstMove = player === 'white' ? r === 6 : r === 1;
  const firstMoveR = player === 'white' ? r - 2 : r + 2;
  const attacks = player === [[nextR, c - 1], [nextR, c + 1]]
  const pawnPlayer = board[r][c] === 'P' ? 'white' : 'black';

  const results = []

  if (nextR < 0) return results;

  if (board[nextR][c] === ' ') {
    results.push([nextR, c]);
  }

  if (results.length && board[firstMoveR][c] === ' ' && firstMove) {
    results.push([firstMoveR, c]);
  }

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
