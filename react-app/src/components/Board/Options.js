import React from "react";

import { starts } from "../../game-logic";

const Options = ({ setBoard, player }) => {

  const resetBoard = () => setBoard(starts[player]);

  return (
    <nav className='game-options'>
      <button onClick={resetBoard}><i className="fa-solid fa-rotate-left"></i></button>
    </nav >
  )
}

export default Options;
