import React from "react";

import { rotateBoard, starts } from "../../game-logic";

const Options = ({ setBoard, player, setPlayer }) => {

  const resetBoard = () => setBoard(starts[player]);
  const switchPlayer = () => {
    setPlayer((prev) => prev === 'white' ? 'black' : 'white');
    setBoard((board) => rotateBoard(board));
  }

  return (
    <nav className='game-options'>
      <button onClick={resetBoard}><i className="fa-solid fa-rotate-left"></i></button>
      <button onClick={switchPlayer}>
        <i className={'fa-solid fa-toggle-' + (player === 'white' ? 'off' : 'on')}></i>
      </button>
    </nav >
  )
}

export default Options;
