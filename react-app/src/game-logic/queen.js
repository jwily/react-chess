import bishopMoves from "./bishop";
import rookMoves from "./rook";

const queenMoves = (r, c, board, player) => {
  return [...bishopMoves(r, c, board, player), ...rookMoves(r, c, board, player)];
}

export default queenMoves;
