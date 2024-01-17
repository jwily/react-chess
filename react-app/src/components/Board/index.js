import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';

import Square from './Square';
import Options from './Options';

import {
  pieceData, start, toRowCol, isWhite,
  toNotation, copyBoard, isCheckmated
} from '../../game-logic';

import { kingChecked } from '../../game-logic/king';

let socket;

const Board = ({ freshGame, setFreshGame }) => {

  const [player, setPlayer] = useState('white');
  const [board, setBoard] = useState(start);
  const [offline, setOffline] = useState(false);

  // Location of the selected piece as well as possible spaces
  // to move to are represented in algebraic notation (i.e. 'a8')
  // for ease of comparison in JavaScript
  const [selected, setSelected] = useState('');

  const [turn, setTurn] = useState('white');
  const [loaded, setLoaded] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const [whiteKing, setWhiteKing] = useState([7, 4]);
  const [blackKing, setBlackKing] = useState([0, 4]);

  const [whiteCanLong, setWhiteCanLong] = useState(true);
  const [whiteCanShort, setWhiteCanShort] = useState(true);
  const [blackCanLong, setBlackCanLong] = useState(true);
  const [blackCanShort, setBlackCanShort] = useState(true);

  const [checkedPlayer, setCheckedPlayer] = useState('');
  const [winner, setWinner] = useState('');

  const { matchCode } = useParams();

  const updateGame = useCallback((board = start, turn = 'white') => {

    fetch(`/api/games/${matchCode}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        board, turn
      })
    })

  }, [matchCode])

  useEffect(() => {

    (async () => {
      // Grabs game state from database
      const res = await fetch(`/api/games/${matchCode}`);
      if (res.ok) {
        const data = await res.json();

        // Identifies where the kings are located
        for (let r = 0; r < 8; r++) {
          for (let c = 0; c < 8; c++) {
            const piece = data.board[r][c];
            if (piece === 'K') {
              setWhiteKing([r, c]);
            } else if (piece === 'k') {
              setBlackKing([r, c]);
            }
          }
        }

        // Updates state with game data
        setBoard(data.board);
        setTurn(data.turn);
        setWhiteCanLong(data.whiteCanLong);
        setWhiteCanShort(data.whiteCanShort);
        setBlackCanLong(data.blackCanLong);
        setBlackCanShort(data.blackCanShort);
        setLoaded(true);
      } else {
        // Shows error screen if no game data
        setNotFound(true);
      }
    })();

    socket = io();

    socket.emit("join", matchCode);

    socket.on("move", (gameState) => {
      if (freshGame === matchCode) setFreshGame('');
      setBoard(gameState.board);
      setTurn(prev => prev === 'white' ? 'black' : 'white');
      setWhiteKing(gameState.whiteKing);
      setBlackKing(gameState.blackKing);
    })

    // Fires in response to reset game button in options
    socket.on("reset", () => {
      setBoard(start);
      setTurn("white");
      setWhiteKing([7, 4]);
      setBlackKing([0, 4]);
    })

    return (() => {
      socket.emit("leave", matchCode)
      socket.disconnect();
    })

  }, [])

  useEffect(() => {

    // Checks if either king is checked after each move

    if (kingChecked(...whiteKing, board, 'white')) {
      setCheckedPlayer('white');
    }

    else if (kingChecked(...blackKing, board, 'black')) {
      setCheckedPlayer('black');
    }

    else setCheckedPlayer('');

  }, [blackKing, whiteKing, board])

  useEffect(() => {

    // If a king is checked, performs a more
    // elaborate "checkmate" verification

    if (checkedPlayer) {

      const kingPosition = isWhite(checkedPlayer) ? whiteKing : blackKing

      if (isCheckmated(board, checkedPlayer, kingPosition)) {
        setWinner(isWhite(checkedPlayer) ? 'black' : 'white');
      }

    } else setWinner('');

  }, [board, whiteKing, blackKing, checkedPlayer])

  const executeMove = async (curr, target) => {
    const [currR, currC] = toRowCol(curr);
    const [targetR, targetC] = toRowCol(target);

    const currPiece = board[currR][currC];

    const newBoard = copyBoard(board);

    // Piece is "moved" on the matrix
    newBoard[targetR][targetC] = currPiece;
    newBoard[currR][currC] = '.';

    // Saves new game state to database
    updateGame(newBoard, turn === 'white' ? 'black' : 'white');

    const socketData = {
      board: newBoard,
      whiteKing: whiteKing,
      blackKing: blackKing,
      room: matchCode
    }

    if (currPiece === 'K') {
      socketData.whiteKing = [targetR, targetC];
      setWhiteKing([targetR, targetC]);
    }

    else if (currPiece === 'k') {
      socketData.blackKing = [targetR, targetC];
      setBlackKing([targetR, targetC]);
    }

    // Sends new game state to other player
    socket.emit("move", socketData);

    if (freshGame === matchCode) setFreshGame('');

    // Local game state updated
    setSelected('');
    setBoard(newBoard);
    setTurn(prev => prev === 'white' ? 'black' : 'white');
  }

  const clickHandler = (e) => {
    // Does different things depending on square's class
    e.stopPropagation();
    if (e.target.className.includes('selectable')) {
      setSelected(e.target.id);
    } else if (e.target.className.includes('possible') || e.target.className.includes('target')) {
      executeMove(selected, e.target.id);
    } else {
      setSelected('');
    }
  };

  const possibleMoves = useMemo(() => {

    // Returns a set of all possible moves given a selected piece

    if (!selected) return new Set();

    const [row, col] = toRowCol(selected);
    const piece = board[row][col];
    const movesFunction = pieceData[piece].function;

    const kingPosition = isWhite(player) ? whiteKing : blackKing;

    return new Set(movesFunction(row, col, board, player, kingPosition));

  }, [board, player, selected, blackKing, whiteKing]);

  const generateSquares = useMemo(() => {

    const rows = []

    // Basically, the board matrix is traversed either
    // normally or in reverse depending on the player

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

          // Square status passed as booleans for memoization
          // Prevents re-renders if square does not change status
          isSelectable={
            !winner
            && turn === player
            && piece !== '.'
            && pieceData[piece].player === player
          }
          isSelected={selected === notation}
          isPossible={possibleMoves.has(notation)}

          player={player}
        />))
      }

      rows.push(<div key={r} className='row'>{row}</div>);
    }

    return rows;

  }, [board, player, possibleMoves, turn, selected, winner])

  if (notFound) {
    return <div className='not-found fade-in-v-fast'>Match Not Found</div>
  }

  if (!loaded) return null;

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
        {generateSquares}
      </div>
      <Options
        turn={turn}
        winner={winner}
        player={player}
        checkedPlayer={checkedPlayer}

        setPlayer={setPlayer}
        setOffline={setOffline}
        setSelected={setSelected}

        socket={socket}
        offline={offline}
        resetGame={updateGame} />
    </div >
  )
}

export default Board;
