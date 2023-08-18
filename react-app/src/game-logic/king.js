import { toNotation, isWhite } from ".";

const pawnCheck = (r, c, board, player) => {

  const direction = isWhite(player) ? -1 : 1;
  const leftPiece = board[direction + r][c + 1];
  const rightPiece = board[direction + r][c - 1];

  const enemyPawn = isWhite(player) ? 'p' : 'P';

  if (leftPiece === enemyPawn || rightPiece === enemyPawn) return true;

  return false;
}

const knightCheck = (r, c, board, player) => {

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

  const enemyKnight = isWhite(player) ? 'n' : 'N';

  for (let [deltaR, deltaC] of deltas) {

    const newR = r + deltaR;
    const newC = c + deltaC;
    const rCheck = 0 <= newR && newR < 8;
    const cCheck = 0 <= newC && newC < 8;

    if (rCheck && cCheck) {
      const piece = board[newR][newC];
      if (piece === enemyKnight) return true;
    }
  }

  return false
}

const diagonalCheck = (r, c, board, player) => {

  const directions = [[-1, -1], [-1, 1], [1, -1], [1, 1]];

  const enemyBishop = isWhite(player) ? 'b' : 'B';
  const enemyQueen = isWhite(player) ? 'q' : 'Q';

  for (const direction of directions) {
    const [rowDir, colDir] = direction;
    let newR = r + rowDir;
    let newC = c + colDir;

    while (newR >= 0 && newR < 8 && newC >= 0 && newC < 8) {

      const piece = board[newR][newC]

      if (piece !== enemyBishop && piece !== enemyQueen) {
        return false
      }

      if (piece === enemyBishop || piece === enemyQueen) {
        return true
      }

      newR += rowDir;
      newC += colDir;
    }
  }

  return false;
}


const verticalCheck = (r, c, board, player) => {

  const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

  const enemyRook = isWhite(player) ? 'r' : 'R';
  const enemyQueen = isWhite(player) ? 'q' : 'Q';

  for (const direction of directions) {
    const [rowDir, colDir] = direction;
    let newR = r + rowDir;
    let newC = c + colDir;

    while (newR >= 0 && newR < 8 && newC >= 0 && newC < 8) {

      const piece = board[newR][newC]

      if (piece !== enemyRook && piece !== enemyQueen) {
        return false
      }

      if (piece === enemyRook || piece === enemyQueen) {
        return true
      }

      newR += rowDir;
      newC += colDir;
    }
  }

  return false;
}

const kingMoves = (r, c, board, player) => {

  const deltas = [
    [-1, 1],
    [1, -1],
    [1, 1],
    [-1, -1],
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1]
  ];

  const moves = [];

  deltas.forEach((delta) => {
    const newR = r + delta[0];
    const newC = c + delta[1];
    const rCheck = 0 <= newR && newR < 8;
    const cCheck = 0 <= newC && newC < 8;

    if (rCheck && cCheck &&
      !pawnCheck(newR, newC, board, player) &&
      !knightCheck(newR, newC, board, player) &&
      !diagonalCheck(newR, newC, board, player) &&
      !verticalCheck(newR, newC, board, player)) {
      moves.push([newR, newC])
    }
  });

  return moves.map(([row, col]) => toNotation(row, col));
}

export default kingMoves;
