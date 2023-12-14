import React, { useCallback, useEffect, useState } from "react";

import { isWhite } from "../../game-logic";

const Options = ({ player, setPlayer, socket, turn }) => {

  const [status, setStatus] = useState(1);

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
        <span id='status'>
          {status === 1 && (turn === 'white' ? 'White Moves' : 'Black Moves')}
          {status === 2 && 'Reset Game'}
          {status === 3 && `Switch to ${isWhite(player) ? 'Black' : 'White'}`}
        </span>
        <span id='hotkey-info'>
          {status === 2 && 'shift + r'}
          {status === 3 && 'spacebar'}
        </span>
      </div>
      <div>
        <button
          id='reset-btn'
          onClick={resetBoard}
          onMouseEnter={() => setStatus(2)}
          onMouseLeave={() => setStatus(1)}
        ><i className="fa-solid fa-power-off"></i>
        </button>
        <button
          id='switch-btn'
          onClick={switchPlayer}
          onMouseEnter={() => setStatus(3)}
          onMouseLeave={() => setStatus(1)}
        ><i className={`fa-${isWhite(player) ? 'regular' : 'solid'} fa-chess-knight`}></i>
        </button>
      </div>
      {/* <button onClick={toggleExamine}>
        <i className={`fa-${examine ? 'solid' : 'regular'} fa-eye`}></i>
      </button> */}
    </nav >
  )
}

export default Options;
