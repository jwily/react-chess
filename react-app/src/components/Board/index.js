import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';

import Square from './Square';
import Options from './Options';

import {
  pieceData, start, toRowCol, isWhite,
  toNotation, copyBoard, isCheckmated, movePiece
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
  const [enPassantTarget, setEnPassantTarget] = useState('');

  const [whiteCanLong, setWhiteCanLong] = useState(true);
  const [whiteCanShort, setWhiteCanShort] = useState(true);
  const [blackCanLong, setBlackCanLong] = useState(true);
  const [blackCanShort, setBlackCanShort] = useState(true);

  const [checkedPlayer, setCheckedPlayer] = useState('');
  const [winner, setWinner] = useState('');

  // Indicates either "long" or "short"
  const [displayLongOrShort, setDisplayLongOrShort] = useState('');

  // Is the en passant target square currently hovered?
  const [enPassantHovered, setEnPassantHovered] = useState(false);

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

  const updateGame = useCallback((
    board = start,
    turn = 'white',
    whiteCanLong = true,
    whiteCanShort = true,
    blackCanLong = true,
    blackCanShort = true,
    enPassantTarget = '') => {

    // Needs error handling
    fetch(`/api/games/${matchCode}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        board, turn, whiteCanLong, whiteCanShort,
        blackCanLong, blackCanShort, enPassantTarget
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
        setEnPassantTarget(data.enPassantTarget);
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
      setEnPassantTarget(gameState.enPassantTarget);
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
      setEnPassantTarget('');
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

      const options = {
        canLong: false,
        canShort: false,
        enPassantTarget
      }

      if (isCheckmated(board, checkedPlayer, kingPosition, options)) {
        setWinner(isWhite(checkedPlayer) ? 'black' : 'white');
      }

    } else setWinner('');

  }, [board, whiteKing, blackKing, checkedPlayer, enPassantTarget])

  const updateStateAfterMove = (data) => {

    const {
      board,
      whiteKing,
      blackKing,
      whiteCanLong,
      whiteCanShort,
      blackCanLong,
      blackCanShort,
      enPassantTarget,
    } = data;

    setBoard(board);
    setWhiteKing(whiteKing);
    setBlackKing(blackKing);
    setWhiteCanLong(whiteCanLong);
    setWhiteCanShort(whiteCanShort);
    setBlackCanLong(blackCanLong);
    setBlackCanShort(blackCanShort);
    setEnPassantTarget(enPassantTarget);

    setSelected('');
    setDisplayLongOrShort('');
    setTurn(prev => prev === 'white' ? 'black' : 'white');

  };

  const executeMove = (curr, target) => {

    const currRC = toRowCol(curr);
    const targetRC = toRowCol(target);

    const [currR, currC] = currRC;
    const currPiece = board[currR][currC];

    const newBoard = copyBoard(board);
    movePiece(currRC, targetRC, newBoard);

    const newData = {
      board: newBoard,
      whiteKing,
      blackKing,
      whiteCanLong,
      whiteCanShort,
      blackCanLong,
      blackCanShort,
      prevEnPassantTarget: enPassantTarget,
      enPassantTarget: '',
      room: matchCode
    }

    const specialFunction = pieceData[currPiece].special;

    if (specialFunction) specialFunction(currRC, targetRC, newData, player);

    // Saves new game state to database
    updateGame(newBoard, turn === 'white' ? 'black' : 'white',
      newData.whiteCanLong, newData.whiteCanShort,
      newData.blackCanLong, newData.blackCanShort,
      newData.enPassantTarget);

    // Sends new game state to other player
    socket.emit("move", newData);

    if (freshGame === matchCode) setFreshGame('');

    // Updates local state
    updateStateAfterMove(newData);
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

  const hoverHandler = (e, mouseOut = false) => {
    e.stopPropagation()

    if (mouseOut) {
      setDisplayLongOrShort('');
      setEnPassantHovered(false);
      return;
    }

    const canLong = isWhite(player) ? whiteCanLong : blackCanLong;
    const canShort = isWhite(player) ? whiteCanShort : blackCanShort;

    if (canLong || canShort) {

      // Row 'e' under these conditions would contain an un-moved king
      if (selected[0] === 'e' && e.target.className.includes('possible')) {

        if (e.target.id[0] === 'g') {
          setDisplayLongOrShort('long')
        }

        else if (e.target.id[0] === 'c') {
          setDisplayLongOrShort('short')
        }
      }
    }

    if (enPassantTarget) {

      if (enPassantTarget === e.target.id && e.target.className.includes('targeted')) {
        setEnPassantHovered(true);
      }

    }
  }

  const possibleMoves = useMemo(() => {

    // Returns a set of all possible moves given a selected piece

    if (!selected) return new Set();

    const [row, col] = toRowCol(selected);
    const piece = board[row][col];
    const movesFunction = pieceData[piece].function;

    const kingPosition = isWhite(player) ? whiteKing : blackKing;
    const canLong = isWhite(player) ? whiteCanLong : blackCanLong;
    const canShort = isWhite(player) ? whiteCanShort : blackCanShort;

    const options = {
      canLong,
      canShort,
      enPassantTarget
    }

    return new Set(movesFunction(row, col, board, player, kingPosition, options));

  }, [board, player, selected, blackKing, whiteKing, enPassantTarget,
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
        const notation = toNotation([r, c]);

        const isSelectable = !winner && turn === player && piece !== '_' && pieceData[piece].player === player;

        const castleLongSquare = (isWhite(player) ? r === 7 : r === 0) && (c === 7 || c === 5);
        const castleShortSquare = (isWhite(player) ? r === 7 : r === 0) && (c === 0 || c === 3);

        const displayCastling =
          (castleLongSquare && displayLongOrShort === 'long') || (castleShortSquare && displayLongOrShort === 'short');

        const isEnPassantTarget = enPassantTarget === notation;
        const enPassantPawn = enPassantTarget && notation[0] === enPassantTarget[0] && notation[1] === selected[1];
        const displayEnPassant = enPassantPawn && enPassantHovered;

        squares.push((
          <Square
            key={notation}

            notation={notation}
            piece={piece}

            // Square statuses passed as booleans for easier memoization
            // Prevents re-renders if square does not change status

            isSelectable={isSelectable}
            isSelected={selected === notation}
            isPossible={possibleMoves.has(notation)}

            isEnPassantTarget={isEnPassantTarget}

            // These two props will turn to 'true' under specific conditions
            // adding a class to the relevant squares to visually represent special moves
            displayCastling={displayCastling}
            displayEnPassant={displayEnPassant}

            fadeType={fadeType}

            player={player}
          />))
      }
    }

    return squares;

  }, [board, player, possibleMoves, turn, selected, winner, fadeType,
    displayLongOrShort, enPassantTarget, enPassantHovered])

  if (!loaded) return null;

  if (notFound) {
    return <div className='not-found fade-in-error'>Match Not Found</div>
  }

  return (
    <div className='off-board'
      onClick={(e) => {
        // Clicking "off" the board de-selects pieces
        if (selected !== '') setSelected('');
      }}>
      <div
        className='board'
        onClick={clickHandler}
        onMouseOver={hoverHandler}
        onMouseOut={e => hoverHandler(e, true)}>
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
