import React, { useState, useMemo, useEffect } from 'react';
import { data, start, toRowCol, isWhite, toNotation, copyBoard } from '../../game-logic';
import Square from './Square';
import Options from './Options';
import { io } from 'socket.io-client';
import { useParams } from 'react-router-dom';

let socket;

const Board = ({ freshGame, setFreshGame }) => {

  const [player, setPlayer] = useState('white')
  const [board, setBoard] = useState(start);
  const [offline, setOffline] = useState(false);

  // Location of the selected piece as well as possible spaces
  // to move to are represented in algebraic notation (i.e. 'a8')
  // for ease of comparison in JavaScript
  const [selected, setSelected] = useState('');
  const [turn, setTurn] = useState('white');
  const [loaded, setLoaded] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const [shouldUpdate, setShouldUpdate] = useState(false);

  const { matchCode } = useParams();

  useEffect(() => {

    (async () => {
      const res = await fetch(`/api/games/${matchCode}`);
      if (res.ok) {
        const game = await res.json();
        setBoard(game.board);
        setTurn(game.turn);
        setLoaded(true);
      } else {
        setNotFound(true);
      }
    })();

  }, [matchCode])

  useEffect(() => {

    socket = io();

    socket.on("game", (gameState) => {
      setBoard(gameState);
      setTurn(prev => prev === 'white' ? 'black' : 'white');
    })

    socket.on("reset", () => {
      setShouldUpdate(true);
      setBoard(start);
      setTurn("white");
    })

    return (() => {
      socket.disconnect();
    })
  }, [])

  useEffect(() => {

    const updateGame = () => {
      fetch(`/api/games/${matchCode}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          board, turn
        })
      })
    }

    let debounceTimer;

    if (shouldUpdate) {
      debounceTimer = setTimeout(() => {
        updateGame();
      })
    }

    return () => clearInterval(debounceTimer);

  }, [board, turn, shouldUpdate, matchCode])

  const executeMove = async (curr, target) => {
    const [currR, currC] = toRowCol(curr);
    const [targetR, targetC] = toRowCol(target);

    const newBoard = copyBoard(board);

    newBoard[targetR][targetC] = newBoard[currR][currC];
    newBoard[currR][currC] = '.';

    if (freshGame === matchCode) {
      setFreshGame('');
    };
    setSelected('');
    setShouldUpdate(true);
    setBoard(newBoard);
    setTurn(prev => prev === 'white' ? 'black' : 'white');
    socket.emit("game", newBoard);
  }

  const clickHandler = (e) => {

    e.stopPropagation();

    if (e.target.className.includes('selectable')) {
      setSelected(e.target.id);
    } else if (e.target.className.includes('possible')
      || e.target.className.includes('target')) {
      executeMove(selected, e.target.id);
    } else {
      setSelected('');
    }
  };

  const possibleMoves = useMemo(() => {
    if (!selected) return new Set();

    const [row, col] = toRowCol(selected);
    const piece = board[row][col];
    const movesFunction = data[piece].moves;

    return new Set(movesFunction(row, col, board, player));

  }, [board, player, selected]);

  const generateRows = useMemo(() => {

    const rows = []

    // Basically, the board state is read either
    // normally or in reverse depending on the player

    // The ternaries set the direction of the board
    for (let r = isWhite(player) ? 0 : 7;
      isWhite(player) ? r <= 7 : r >= 0;
      isWhite(player) ? r++ : r--) {

      const row = []

      for (let c = isWhite(player) ? 0 : 7;
        isWhite(player) ? c <= 7 : c >= 0;
        isWhite(player) ? c++ : c--) {

        const piece = board[r][c];
        const notation = toNotation(r, c);

        row.push((<Square
          key={c}

          notation={notation}
          piece={piece !== '.' ? piece : null}
          color={(r + c) % 2 === 0 ? 'white square' : 'black square'}

          isSelectable={piece !== '.'
            && data[piece].player === player
            && turn === player}
          isSelected={selected === notation}
          isPossible={possibleMoves.has(notation)}

          turn={turn}
          player={player}
        />))
      }

      rows.push(<div key={r} className='row'>{row}</div>);
    }

    return rows;

  }, [board, player, possibleMoves, turn, selected])

  if (notFound) {
    return 'Not Found'
  }

  if (!loaded) {
    return null;
  }

  return (
    // Clicking "off" the board de-selects pieces
    <div className='off-board'
      onClick={(e) => {
        if (selected !== '') {
          setSelected('');
        }
      }}
    >
      <div
        className='board'
        onClick={clickHandler}
      >
        {generateRows}
      </div>
      <Options
        player={player}
        setPlayer={setPlayer}
        turn={turn}
        offline={offline}
        setOffline={setOffline}
        setSelected={setSelected}
        socket={socket} />
    </div >
  )
}

export default Board;
