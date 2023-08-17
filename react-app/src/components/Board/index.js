import React, { useState } from 'react';
import { data, starts, toRowCol } from '../../game-logic';
import Square from './Square';
import Options from './Options';

const Board = () => {

  const [player, setPlayer] = useState('white')
  const [board, setBoard] = useState(starts[player]);

  // Location of the selected piece as well as
  // possible spaces to move to are represented
  // in algebraic notation (i.e. 'a8')
  // for ease of comparison in JavaScript
  const [selected, setSelected] = useState('');
  const [turn, setTurn] = useState('white');

  const possible = (() => {
    if (!selected) return [];

    const [row, col] = toRowCol(selected, player);
    const piece = board[row][col];
    const movesFunction = data[piece].moves;

    if (!movesFunction) return [];

    return movesFunction(row, col, board, player);
  })();

  return (

    // Clicking "off" the board de-selects pieces
    <div className='off-board'
      onClick={() => {
        if (selected) setSelected('');
      }}
    >
      <div className='board'>
        {board.map((row, rIndex) => (
          <div key={rIndex} className="row">
            {row.map((piece, cIndex) => {

              // For each row, creating 8 Squares
              // each Square is given relevant state data
              return <Square
                key={cIndex}

                // Coordinates
                row={rIndex}
                col={cIndex}

                // State of the board
                board={board}

                // The occupying piece, if present
                piece={piece !== ' ' ? piece : null}

                // State data for manipulation of the board
                player={player}
                turn={turn}
                selected={selected}
                possible={possible}
                setSelected={setSelected}
                setBoard={setBoard}
                setTurn={setTurn}
              />
            })}
          </div>
        ))}
      </div>
      <Options setBoard={setBoard} player={player} setPlayer={setPlayer} />
    </div >
  )
}

export default Board;
