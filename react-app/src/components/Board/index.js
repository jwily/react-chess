import React, { useState, useMemo } from 'react';
import { data, start, toRowCol, isWhite } from '../../game-logic';
import Square from './Square';
import Options from './Options';

const Board = () => {

  const [player, setPlayer] = useState('white')
  const [board, setBoard] = useState(start);

  // Location of the selected piece as well as possible spaces
  // to move to are represented in algebraic notation (i.e. 'a8')
  // for ease of comparison in JavaScript
  const [selected, setSelected] = useState('');
  const [turn, setTurn] = useState('white');


  // Not really sure if the useMemo
  // adds any benefit here, to be honest
  const possible = useMemo(() => {
    if (!selected) return [];

    const [row, col] = toRowCol(selected,);
    const piece = board[row][col];
    const movesFunction = data[piece].moves;

    if (!movesFunction) return [];

    return movesFunction(row, col, board, player);
  }, [board, player, selected]);

  const generateRows = useMemo(() => {

    const rows = []

    // Basically, the board state is read either
    // normally or in reverse depending on the player

    // That's what all these ternaries are for
    for (let r = isWhite(player) ? 0 : 7;
      isWhite(player) ? r <= 7 : r >= 0;
      isWhite(player) ? r++ : r--) {

      const row = []

      for (let c = isWhite(player) ? 0 : 7;
        isWhite(player) ? c <= 7 : c >= 0;
        isWhite(player) ? c++ : c--) {

        const piece = board[r][c];
        row.push((<Square
          key={c}

          // Coordinates
          row={r}
          col={c}

          // State of the board
          board={board}

          // The occupying piece, if present
          piece={piece !== '.' ? piece : null}

          // State data for manipulation of the board
          player={player}
          turn={turn}
          selected={selected}
          possible={possible}
          setSelected={setSelected}
          setBoard={setBoard}
          setTurn={setTurn}
        />))
      }

      rows.push(<div key={r} className='row'>{row}</div>);

    }

    return rows;

  }, [board, player, possible, turn, selected])

  return (
    // Clicking "off" the board de-selects pieces
    <div className='off-board'
      onClick={() => { if (selected) setSelected('') }}>
      <div className='board'>
        {generateRows}
      </div>
      <Options setBoard={setBoard} player={player} setPlayer={setPlayer} />
    </div >
  )
}

export default Board;
