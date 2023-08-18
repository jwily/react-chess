import React, { useCallback, useEffect } from "react";

import { start, isWhite } from "../../game-logic";

const Options = ({ setBoard, player, setPlayer }) => {

  // This stuff is mostly for debugging

  const resetBoard = useCallback(() => setBoard(start), [setBoard]);

  const switchPlayer = useCallback(() => {
    setPlayer((prev) => prev === 'white' ? 'black' : 'white');
  }, [setPlayer])

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey && e.key === 'r') {
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
      <button onClick={resetBoard}><i className="fa-solid fa-rotate-left"></i></button>
      <button onClick={switchPlayer}>
        <i className={'fa-solid fa-toggle-' + (isWhite(player) ? 'off' : 'on')}></i>
      </button>
    </nav >
  )
}

export default Options;
