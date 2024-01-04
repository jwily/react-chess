import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { pieceData, start, toRowCol, isWhite, toNotation, copyBoard } from '../../game-logic';
import Square from './Square';
import Options from './Options';
import { io } from 'socket.io-client';
import { useParams } from 'react-router-dom';

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
      const res = await fetch(`/api/games/${matchCode}`);
      if (res.ok) {
        const data = await res.json();

        // Sets king positions on game load
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

        // Updates state with data from back end
        setBoard(data.board);
        setTurn(data.turn);
        setLoaded(true);
      } else {
        setNotFound(true);
      }
    })();

    socket = io();

    socket.on("move", (gameState) => {
      if (freshGame === matchCode) setFreshGame('');
      setBoard(gameState.board);
      setWhiteKing(gameState.whiteKing);
      setBlackKing(gameState.blackKing);
      setTurn(prev => prev === 'white' ? 'black' : 'white');
    })

    socket.on("reset", () => {
      setBoard(start);
      setTurn("white");
      setWhiteKing([7, 4]);
      setBlackKing([0, 4]);
    })

    return (() => {
      socket.disconnect();
    })

  }, [])

  const executeMove = async (curr, target) => {
    const [currR, currC] = toRowCol(curr);
    const [targetR, targetC] = toRowCol(target);

    const currPiece = board[currR][currC];

    const newBoard = copyBoard(board);

    newBoard[targetR][targetC] = currPiece;
    newBoard[currR][currC] = '.';

    updateGame(newBoard, turn === 'white' ? 'black' : 'white');

    let whiteKingMoved = false;
    let blackKingMoved = false;

    if (currPiece === 'K') {
      whiteKingMoved = true;
      setWhiteKing([targetR, targetC]);
    }
    else if (currPiece === 'k') {
      blackKingMoved = true;
      setBlackKing([targetR, targetC]);
    }

    const socketData = {
      board: newBoard,
      whiteKing: whiteKingMoved ? [targetR, targetC] : whiteKing,
      blackKing: blackKingMoved ? [targetR, targetC] : blackKing,
    }

    socket.emit("move", socketData);

    if (freshGame === matchCode) setFreshGame('');

    setSelected('');
    setBoard(newBoard);
    setTurn(prev => prev === 'white' ? 'black' : 'white');
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

    // All possible moves for the selected piece
    // A Set is used for a tiny bit of optimization

    if (!selected) return new Set();

    const [row, col] = toRowCol(selected);
    const piece = board[row][col];
    const movesFunction = pieceData[piece].moves;

    const kingPosition = isWhite(player) ? whiteKing : blackKing;

    return new Set(movesFunction(row, col, board, player, kingPosition));

  }, [board, player, selected, blackKing, whiteKing]);

  const generateRows = useMemo(() => {

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

          isSelectable={piece !== '.'
            && pieceData[piece].player === player
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

  if (!loaded) return null;

  if (notFound) {
    return <div className='not-found fade-in-v-fast'>Match Not Found</div>
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
        socket={socket}
        resetGame={updateGame} />
    </div >
  )
}

export default Board;
