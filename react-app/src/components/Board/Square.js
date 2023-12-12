import React from "react";

import { data, toNotation, toRowCol, copyBoard } from '../../game-logic';

const Square = React.memo(({ row, col, board, piece, turn, selected, possible,
  player, setSelected, setBoard, setTurn, socket }) => {

  console.log(`Square ${row} ${col}`)

  const colorPick = (row, col) => {
    // Determines if square itself is black or white
    return (row + col) % 2 === 0 ? 'white square' : 'black square';
  }

  // A few booleans that are based on state data
  const isSelectable = piece && data[piece].player === player;
  const isSelected = selected === toNotation(row, col);
  const isPossible = possible.includes(toNotation(row, col));

  const isAttackable = (() => {
    // Determines whether the square
    // is a potential target of an offensive move
    if (isPossible && piece) {

      const movingPlayer = player;
      const occupyingPlayer = data[piece].player;

      if (movingPlayer !== occupyingPlayer) {
        return true;
      }
    }
    return false;
  })();

  const determineStatus = () => {
    // These statuses must be checked for in this order
    if (isAttackable) return ' targeted';
    else if (!piece && isPossible) return ' possible';
    else if (isSelected) return ' selected';
    else if (isSelectable) return ' selectable';
    else return '';
  }

  const select = () => {
    setSelected(toNotation(row, col));
  }

  const deselect = () => {
    if (selected) setSelected('');
  }

  // const changeTurn = () => {
  //   if (turn === 'white') setTurn('black');
  //   else setTurn('white');
  // }

  const attack = () => {

    const [currR, currC] = toRowCol(selected);
    const newBoard = copyBoard(board);

    newBoard[row][col] = newBoard[currR][currC];
    newBoard[currR][currC] = '.';

    deselect();
    setBoard(newBoard);
    // changeTurn();

    socket.emit("game", newBoard)
  }

  const move = () => {

    const [currR, currC] = toRowCol(selected);
    const newBoard = copyBoard(board);

    // Swaps moving piece with an empty space
    [newBoard[currR][currC], newBoard[row][col]] =
      [newBoard[row][col], newBoard[currR][currC]];

    deselect();
    setBoard(newBoard);
    // changeTurn();

    socket.emit("game", newBoard)
  }

  return (
    <span
      className={
        colorPick(row, col)
        + determineStatus()
        + (piece ? ` ${data[piece].player + '-' + data[piece].name}` : '')
      }
      id={toNotation(row, col)}
      onClick={(e) => {
        e.stopPropagation();
        if (isAttackable) attack();
        else if (!piece && isPossible) move();
        else if (isSelected) deselect();
        else if (isSelectable) select();
        else deselect();
      }}
    >

      {/* <span className='position'>
        {toNotation(row, col)}
      </span> */}

    </span >
  )
})

export default Square;
