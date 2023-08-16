import React, { useState } from 'react';

const Board = () => {

  const nums = [8, 7, 6, 5, 4, 3, 2, 1]
  const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

  const [board, setBoard] = useState(
    [
      ['', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', ''],
    ]
  )

  console.log(board);

  const colorPick = (row, col) => {
    return (row + col) % 2 === 0 ? 'white square' : 'black square';
  }

  return (
    <div>
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((col, colIndex) => (
            <span key={colIndex}
              className={colorPick(rowIndex, colIndex)}
              id={nums[rowIndex] + letters[colIndex]}>
              {col}
            </span>
          ))}
        </div>
      ))}
    </div>
  )
}

export default Board;
