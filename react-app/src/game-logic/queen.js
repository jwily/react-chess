import bishopMoves from "./bishop";
import rookMoves from "./rook";

const queenMoves = (r, c, board, player, kingPosition) => {
  return [...bishopMoves(r, c, board, player, kingPosition), ...rookMoves(r, c, board, player, kingPosition)];
}

export default queenMoves;
