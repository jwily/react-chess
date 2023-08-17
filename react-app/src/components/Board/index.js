import React, { useState } from 'react';
import Square from './Square';

const Board = () => {

  const [board, setBoard] = useState(
    [
      ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
      ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', 'N', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
      ['R', ' ', 'B', 'Q', 'K', 'B', 'N', 'R']
    ]
  );

  // Represents the square of a selected piece
  // and the squares that piece can move to
  // in chess notation (a8, b8, etc.)
  const [selected, setSelected] = useState('');
  const [possible, setPossible] = useState([]);
  const [turn, setTurn] = useState('white');

  return (

    // Clicking "off" the board de-selects pieces
    <div className='off-board'
      onClick={(e) => {
        setSelected('');
        setPossible([]);
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
                turn={turn}
                selected={selected}
                possible={possible}
                setSelected={setSelected}
                setPossible={setPossible}
                setBoard={setBoard}
                setTurn={setTurn}
              />
            })}
          </div>
        ))}
      </div>
    </div >
  )
}

export default Board;
