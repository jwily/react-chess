import React from "react";

import { data, toNotation, toRowCol, copyBoard } from '../../game-logic';

const Square = ({ row, col, board, piece,
  turn, selected, possible,
  setSelected, setPossible, setBoard, setTurn }) => {

  const colorPick = (row, col) => {
    // Simply determines if square is black or white
    return (row + col) % 2 === 0 ? 'white square' : 'black square';
  }

  // Some booleans that are based on state data
  const isSelectable = piece && data[piece].player === turn;
  const isSelected = selected === toNotation(row, col);
  const isPossible = possible.includes(toNotation(row, col));

  const isTarget = () => {
    // Determines whether the square
    // is a potential target of an offensive move
    if (isPossible && piece) {

      const [currR, currC] = toRowCol(selected);
      const movingPiece = board[currR][currC];
      const movingPlayer = data[movingPiece].player;
      const occupyingPlayer = data[piece].player;

      if (movingPlayer !== occupyingPlayer) {
        return true;
      }
    }

    // Returns nothing otherwise
    return false;
  }

  const determineStatus = () => {
    // These statuses must be checked for in this order
    if (isTarget()) return ' targeted';
    else if (isPossible) return ' possible';
    else if (isSelected) return ' selected';
    else if (isSelectable) return ' selectable';
    else return '';
  }

  const select = () => {

    setSelected(toNotation(row, col));
    if (data[piece].moves) {
      setPossible(data[piece].moves(row, col, board));
    }

    else {
      setPossible([]);
    }
  }

  const deselect = () => {
    setSelected('');
    setPossible([]);
  }

  const attack = () => {

    const [currR, currC] = toRowCol(selected);
    const newBoard = copyBoard(board);

    newBoard[row][col] = newBoard[currR][currC];
    newBoard[currR][currC] = ' ';

    deselect();

    setBoard(newBoard);
  }

  const move = () => {

    const newBoard = copyBoard(board);
    const [currR, currC] = toRowCol(selected);

    [newBoard[currR][currC], newBoard[row][col]] = [newBoard[row][col], newBoard[currR][currC]];

    deselect();

    setBoard(newBoard);
  }

  return (
    <span
      className={
        colorPick(row, col)
        + determineStatus()
      }
      id={toNotation(row, col)}
      onClick={(e) => {
        e.stopPropagation();
        if (isTarget()) attack();
        else if (isPossible) move();
        else if (isSelected) deselect();
        else if (isSelectable) select();
        else deselect();
      }}
    >

      {!!piece && piece}

      <span className='position'>
        {toNotation(row, col)}
      </span>

    </span >
  )
}

export default Square;
