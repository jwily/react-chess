import React, { useCallback, useEffect, useState } from "react";

import { isWhite } from "../../game-logic";

const Options = ({ player, setPlayer, socket, turn }) => {

  const [status, setStatus] = useState('turn');

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
          {status === 'turn' && (turn === 'white' ? 'White Moves' : 'Black Moves')}
          {status === 'reset' && 'Reset Game'}
          {status === 'switch' && `Switch to ${isWhite(player) ? 'Black' : 'White'}`}
        </span>
        <span id='hotkey-info'>
          {status === 'reset' && 'shift + r'}
          {status === 'switch' && 'spacebar'}
        </span>
      </div>
      <div>
        <button
          id='reset-btn'
          onClick={resetBoard}
          onMouseEnter={() => setStatus('reset')}
          onMouseLeave={() => setStatus('turn')}
        ><i className="fa-solid fa-power-off"></i>
        </button>
        <button
          id='switch-btn'
          onClick={switchPlayer}
          onMouseEnter={() => setStatus('switch')}
          onMouseLeave={() => setStatus('turn')}
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
