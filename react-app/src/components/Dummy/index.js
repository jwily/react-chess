import React from 'react';

const Dummy = () => {

  const newGame = async () => {
    await fetch("/api/games/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
      }),
    });
  }

  return (
    <div>
      <button onClick={newGame}>
        New Game
      </button>
    </div >
  )
}

export default Dummy;
