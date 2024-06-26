import { toNotation, isWhite, copyBoard, belongsToPlayer } from ".";

// The various "Check" functions are used to detect
// whether a possible destination for the king
// would place it in the attack path of an enemy piece

const pawnCheck = (r, c, board, player) => {

  // Checks whether a pawn exists in either of
  // the two diagonal pieces in front of the king

  const direction = isWhite(player) ? -1 : 1;
  const leftPiece = board[direction + r][c + 1];
  const rightPiece = board[direction + r][c - 1];

  const enemyPawn = isWhite(player) ? 'p' : 'P';

  if (leftPiece === enemyPawn || rightPiece === enemyPawn) return true;

  return false;
}

const knightCheck = (r, c, board, player) => {

  // Checks whether an enemy knight exists
  // in the various L-shaped directions

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

const kingCheck = (r, c, board, player) => {

  // Checks whether moving would place the king
  // within one square of the enemy king

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

  const enemyKing = isWhite(player) ? 'k' : 'K';

  for (let [deltaR, deltaC] of deltas) {

    const newR = r + deltaR;
    const newC = c + deltaC;
    const rCheck = 0 <= newR && newR < 8;
    const cCheck = 0 <= newC && newC < 8;

    if (rCheck && cCheck) {
      const piece = board[newR][newC];
      if (piece === enemyKing) return true;
    }
  }

  return false
}

const diagonalCheck = (r, c, board, player) => {

  const directions = [[-1, -1], [-1, 1], [1, -1], [1, 1]];

  for (const direction of directions) {
    if (_diagonalCheck(r, c, board, player, direction)) return true;
  }

  return false;
}

const _diagonalCheck = (r, c, board, player, direction) => {

  // Checks whether an enemy bishop or queen
  // exists in the diagonal directions

  const enemyBishop = isWhite(player) ? 'b' : 'B';
  const enemyQueen = isWhite(player) ? 'q' : 'Q';
  const selfKing = isWhite(player) ? 'K' : 'k';

  const [rowDir, colDir] = direction;
  let newR = r + rowDir;
  let newC = c + colDir;

  while (newR >= 0 && newR < 8 && newC >= 0 && newC < 8) {

    const piece = board[newR][newC];

    if (piece !== '_' && piece !== enemyBishop && piece !== enemyQueen && piece !== selfKing) {
      return false;
    };

    if (piece === enemyBishop || piece === enemyQueen) {
      return true;
    }

    newR += rowDir;
    newC += colDir;
  }

}

const verticalCheck = (r, c, board, player) => {

  const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

  for (const direction of directions) {
    if (_verticalCheck(r, c, board, player, direction)) return true;
  }

  return false;
}


const _verticalCheck = (r, c, board, player, direction) => {

  // Checks whether an enemy rook or queen
  // exists in the diagonal directions

  const enemyRook = isWhite(player) ? 'r' : 'R';
  const enemyQueen = isWhite(player) ? 'q' : 'Q';
  const selfKing = isWhite(player) ? 'K' : 'k';

  const [rowDir, colDir] = direction;
  let newR = r + rowDir;
  let newC = c + colDir;

  while (newR >= 0 && newR < 8 && newC >= 0 && newC < 8) {

    const piece = board[newR][newC];

    if (piece !== '_' && piece !== enemyRook && piece !== enemyQueen && piece !== selfKing) {
      return false;
    };

    if (piece === enemyRook || piece === enemyQueen) {
      return true;
    }

    newR += rowDir;
    newC += colDir;
  }
}

// All of the "check" functions are neatly packaged here, returns a boolean

export const kingChecked = (r, c, board, player) => {
  return verticalCheck(r, c, board, player) ||
    diagonalCheck(r, c, board, player) ||
    knightCheck(r, c, board, player) ||
    pawnCheck(r, c, board, player) ||
    kingCheck(r, c, board, player)
}

export const endangersKing = (newPosition, currPosition, kingPosition, board, player, enPassantTarget) => {

  // When given a possible move, this function creates a copy of the board
  // in which that move has taken place and then checks if the king is endangered

  // This function is used to prohibit moves that would check one's own king

  const [newR, newC] = newPosition;
  const [currR, currC] = currPosition;
  const [kingR, kingC] = kingPosition;

  const newBoard = copyBoard(board);
  newBoard[newR][newC] = newBoard[currR][currC];
  newBoard[currR][currC] = '_';

  // Checking to see if it's an en passant scenario
  // The "enPassantTarget" argument is only passed during pawn moves
  if (enPassantTarget && toNotation(newPosition) === enPassantTarget) {
    newBoard[currR][newC] = '_';
  }

  return kingChecked(kingR, kingC, newBoard, player);
}

const castlingCheck = (board, player, isLong = true) => {

  const row = isWhite(player) ? 7 : 0;
  const columns = isLong ? [2, 3] : [5, 6];

  if (kingChecked(row, 4, board, player)) return false;

  for (let col of columns) {
    if (board[row][col] !== '_' || kingChecked(row, col, board, player)) {
      return false
    }
  }

  return true
}

export const kingMoveEffects = (player) => {

  const kingPosition = `${player}King`;
  const canLong = `${player}CanLong`;
  const canShort = `${player}CanShort`;

  const startingRow = isWhite(player) ? 7 : 0;
  const rookPiece = isWhite(player) ? 'R' : 'r';

  return (currRC, targetRC, data) => {

    const currC = currRC[1];
    const targetC = targetRC[1];

    data[kingPosition] = targetRC;

    if (targetC - currC === 2) {
      data.board[startingRow][7] = '_';
      data.board[startingRow][5] = rookPiece;
    } else if (currC - targetC === 2) {
      data.board[startingRow][0] = '_';
      data.board[startingRow][3] = rookPiece;
    }

    if (data[canLong]) {
      data[canLong] = false;
    }

    if (data[canShort]) {
      data[canShort] = false;
    }

    return data;

  }
}

const kingMoves = (r, c, board, player, kingPosition, options) => {

  const { canLong, canShort } = options;

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

    if (rCheck && cCheck) {

      const piece = board[newR][newC];
      const impassable = piece !== '_' && belongsToPlayer(piece, player);

      if (!impassable && !kingChecked(newR, newC, board, player))
        moves.push([newR, newC])
    }
  });

  if (canLong && castlingCheck(board, player)) moves.push(isWhite(player) ? [7, 2] : [0, 2]);
  if (canShort && castlingCheck(board, player, false)) moves.push(isWhite(player) ? [7, 6] : [0, 6]);

  return moves.map((coords) => toNotation(coords));
}

export default kingMoves;
