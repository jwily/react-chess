import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';

import Square from './Square';
import Options from './Options';

import {
  pieceData, start, toRowCol, isWhite,
  toNotation, copyBoard, isCheckmated, belongsToPlayer
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
  const [enPassant, setEnPassant] = useState([null, null])

  const [whiteCanLong, setWhiteCanLong] = useState(true);
  const [whiteCanShort, setWhiteCanShort] = useState(true);
  const [blackCanLong, setBlackCanLong] = useState(true);
  const [blackCanShort, setBlackCanShort] = useState(true);

  const [checkedPlayer, setCheckedPlayer] = useState('');
  const [winner, setWinner] = useState('');

  const { matchCode } = useParams();

  const fadeType = useMemo(() => {

    // Generates a number that determines
    // the fade-in animation of the board
    // based on the match code

    let total = 0;
    for (let char of matchCode) {
      total += char.codePointAt()
    }
    return total % 4;

  }, [matchCode])

  const updateGame = useCallback(
    (board = start, turn = 'white',
      whiteCanLong = true, whiteCanShort = true,
      blackCanLong = true, blackCanShort = true) => {

      fetch(`/api/games/${matchCode}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          board, turn, whiteCanLong, whiteCanShort, blackCanLong, blackCanShort
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
        // as well as any pawns open to en passant
        for (let r = 0; r < 8; r++) {
          for (let c = 0; c < 8; c++) {
            const piece = data.board[r][c];
            if (piece === 'K') {
              setWhiteKing([r, c]);
            } else if (piece === 'k') {
              setBlackKing([r, c]);
            } else if (piece.toLowerCase() === 'e') {
              setEnPassant([r, c]);
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
      setWhiteCanLong(gameState.whiteCanLong);
      setWhiteCanShort(gameState.whiteCanShort);
      setBlackCanLong(gameState.blackCanLong);
      setBlackCanShort(gameState.blackCanShort);
      setWhiteKing(gameState.whiteKing);
      setBlackKing(gameState.blackKing);
      setEnPassant(gameState.enPassant);
    })

    // Fires in response to reset game button in Options
    socket.on("reset", () => {
      setBoard(start);
      setTurn("white");
      setWhiteCanLong(true);
      setWhiteCanShort(true);
      setBlackCanLong(true);
      setBlackCanShort(true);
      setWhiteKing([7, 4]);
      setBlackKing([0, 4]);
      setEnPassant([null, null])
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

    let currPiece = board[currR][currC];
    const newBoard = copyBoard(board);

    // If a pawn was at risk of en passant last turn,
    // it is reverted to its "safe" state
    if (enPassant[0] !== null) {
      const [row, col] = enPassant;
      const pawn = newBoard[row][col]
      newBoard[row][col] = belongsToPlayer(pawn, 'white') ? 'P' : 'p';
    }

    // Piece is "moved" on the matrix
    newBoard[targetR][targetC] = currPiece;
    newBoard[currR][currC] = ' ';

    const updatedData = {
      board: newBoard,
      whiteKing,
      blackKing,
      whiteCanLong,
      whiteCanShort,
      blackCanLong,
      blackCanShort,
      enPassant: [null, null],
      room: matchCode
    }

    let pawnFirstMove = false;

    // If the moving piece is a king, rook, or a pawn
    // then a few things are check and tweaked
    const specialConditions = {

      'P': () => {
        if (Math.abs(currR - targetR) === 2) {
          newBoard[targetR][targetC] = 'E';
          pawnFirstMove = true;
          updatedData.enPassant = [targetR, targetC];
          setEnPassant([targetR, targetC])
        }
      },
      'p': () => {
        if (Math.abs(currR - targetR) === 2) {
          newBoard[targetR][targetC] = 'e';
          pawnFirstMove = true;
          updatedData.enPassant = [targetR, targetC];
          setEnPassant([targetR, targetC])
        }
      },
      'K': () => {
        updatedData.whiteKing = [targetR, targetC];
        setWhiteKing([targetR, targetC]);
        if (whiteCanLong) {
          updatedData.whiteCanLong = false;
          setWhiteCanLong(false);
        }
        if (whiteCanShort) {
          updatedData.whiteCanShort = false;
          setWhiteCanShort(false);
        }
      },
      'k': () => {
        updatedData.blackKing = [targetR, targetC];
        setBlackKing([targetR, targetC]);
        if (blackCanLong) {
          updatedData.blackCanLong = false;
          setBlackCanLong(false);
        }
        if (blackCanShort) {
          updatedData.blackCanShort = false;
          setBlackCanShort(false);
        }
      },
      'R': () => {
        if (whiteCanShort && currC === 7) {
          updatedData.whiteCanShort = false;
          setWhiteCanShort(false);
        }
        else if (whiteCanLong && currC === 0) {
          updatedData.whiteCanLong = false;
          setWhiteCanLong(false);
        }
      },
      'r': () => {
        if (blackCanShort && currC === 7) {
          updatedData.blackCanShort = false;
          setBlackCanShort(false);
        }
        else if (blackCanLong && currC === 0) {
          updatedData.blackCanLong = false;
          setBlackCanLong(false);
        }
      }
    }

    if (specialConditions[currPiece]) specialConditions[currPiece]();

    // Saves new game state to database
    updateGame(newBoard, turn === 'white' ? 'black' : 'white',
      updatedData.whiteCanLong, updatedData.whiteCanShort,
      updatedData.blackCanLong, updatedData.blackCanShort);

    // Sends new game state to other player
    socket.emit("move", updatedData);

    if (freshGame === matchCode) setFreshGame('');

    // Local game state updated
    setSelected('');
    setBoard(newBoard);
    if (!pawnFirstMove) setEnPassant([null, null]);
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
    const canLong = isWhite(player) ? whiteCanLong : blackCanLong;
    const canShort = isWhite(player) ? whiteCanShort : blackCanShort;

    return new Set(movesFunction(row, col, board, player, kingPosition));

  }, [board, player, selected, blackKing, whiteKing,
    blackCanLong, blackCanShort, whiteCanLong, whiteCanShort]);

  const generateSquares = useMemo(() => {

    const squares = []

    // Basically, the board matrix is traversed either
    // normally or in reverse depending on the player

    for (let r = isWhite(player) ? 0 : 7;
      isWhite(player) ? r <= 7 : r >= 0;
      isWhite(player) ? r++ : r--) {

      for (let c = isWhite(player) ? 0 : 7;
        isWhite(player) ? c <= 7 : c >= 0;
        isWhite(player) ? c++ : c--) {

        let piece = board[r][c];
        const notation = toNotation(r, c);

        const castlingData = {
          canLong: isWhite(player) ? whiteCanLong : blackCanLong,
          canShort: isWhite(player) ? whiteCanShort : blackCanShort,
          castleToLong: c === 2 && (isWhite(player) ? r === 7 : r === 0),
          castleFromLong: c === 0 && (isWhite(player) ? r === 7 : r === 0),
          castleToShort: c === 6 && (isWhite(player) ? r === 7 : r === 0),
          castleFromShort: c === 7 && (isWhite(player) ? r === 7 : r === 0),
        }

        squares.push((<Square
          key={notation}

          notation={notation}
          piece={piece}

          // Square statuses passed as booleans for easier memoization
          // Prevents re-renders if square does not change status

          isSelectable={!winner && turn === player && piece !== ' ' && pieceData[piece].player === player}
          isSelected={selected === notation}
          isPossible={possibleMoves.has(notation)}

          castleToLong={castlingData.castleToLong && castlingData.canLong}
          castleFromLong={castlingData.castleFromLong && castlingData.canLong}
          castleToShort={castlingData.castleToShort && castlingData.canShort}
          castleFromShort={castlingData.castleFromShort && castlingData.canShort}
          enPassant={enPassant[0] !== null && notation === toNotation(...enPassant)}

          fadeType={fadeType}

          player={player}
        />))
      }
    }

    return squares;

  }, [board, player, possibleMoves, turn, selected, winner, fadeType,
    whiteCanLong, whiteCanShort, blackCanLong, blackCanShort, enPassant])

  if (notFound) {
    return <div className='not-found fade-in-error'>Match Not Found</div>
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
