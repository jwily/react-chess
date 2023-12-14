import React, { useCallback, useEffect } from "react";

import { start, isWhite } from "../../game-logic";

const Options = ({ setBoard, player, setPlayer, socket, turn }) => {

  // This stuff is mostly for debugging

  const resetBoard = useCallback(() => {
    socket.emit("reset");
  }, [socket]);

  const switchPlayer = useCallback(() => {
    setPlayer((prev) => prev === 'white' ? 'black' : 'white');
  }, [setPlayer])

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.shiftKey && e.key === 'R') {
        resetBoard()
      } else if (e.code === 'Space') {
        switchPlayer()
      }
    }

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [resetBoard, switchPlayer])

  return (
    <nav className='game-options'>
      <div>
        <button onClick={switchPlayer}>
          <i className={`fa-${isWhite(player) ? 'regular' : 'solid'} fa-chess-knight`}></i>
        </button>
        <button onClick={resetBoard}><i className="fa-solid fa-rotate-left"></i></button>
      </div>
      {/* <button onClick={toggleExamine}>
        <i className={`fa-${examine ? 'solid' : 'regular'} fa-eye`}></i>
      </button> */}
      <div>
        <span id='turn-status'>{turn === 'white' ? 'White Moves' : 'Black Moves'}</span>
      </div>
    </nav >
  )
}

export default Options;
