import React, { useState } from 'react';

const Board = () => {

  const nums = [8, 7, 6, 5, 4, 3, 2, 1]
  const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

  // const [board, setBoard] = useState(
  //   [
  //     [1, 2, 3, 4],
  //     [1, 2, 3, 4],
  //     [1, 2, 3, 4],
  //     [1, 2, 3, 4],
  //   ]
  // );

  const rows = nums.map((num) => {
    return (
      <div className='row' key={num}>
        {letters.map((letter) => {

          const color = (letters.indexOf(letter) + nums.indexOf(num)) % 2 === 0 ?
            'white square' :
            'black square'

          return <div className={color}
            key={letter + num} id={letter + num}></div>
        })
        }
      </div >
    )
  })

  return (
    <div id='board'>
      {rows}
    </div>
  )
}

export default Board;
