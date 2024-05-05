import React, { useState, useMemo, useEffect, useCallback, useReducer } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';

import Square from './Square';
import Options from './Options';

import {
  pieceData, toRowCol, isWhite,
  toNotation, copyBoard, isCheckmated, movePiece,
  initialGameState, gameReducer, findPieceBFS, checkForPromotion
} from '../../game-logic';

import { kingChecked } from '../../game-logic/king';

let socket;

const Board = ({ freshGame, setFreshGame }) => {

  const [loaded, setLoaded] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const [winner, setWinner] = useState('');
  const [player, setPlayer] = useState('white');
  const [offline, setOffline] = useState(false);
  const [checkedPlayer, setCheckedPlayer] = useState('');

  const [game, dispatch] = useReducer(gameReducer, initialGameState);

  // useEffect(() => {
  //   console.log(game);
  // }, [game])

  // Location of the selected piece is represented in algebraic notation (i.e. 'a8')
  const [selected, setSelected] = useState('');

  // Set to 'long', 'short', or 'ep'
  const [hoverState, setHoverState] = useState('');

  const { matchCode } = useParams();

  const fadeType = useMemo(() => {

    // Generates an integer that determines the board's animation pattern

    let total = 0;
    for (let char of matchCode) total += char.codePointAt();
    return total % 4;

  }, [matchCode])

  const loadData = (data) => {
    dispatch({ type: 'loadData', payload: data })
  };

  const updateGame = useCallback(gameData => {

    const {
      board, turn, whiteCanLong, whiteCanShort,
      blackCanLong, blackCanShort, enPassantTarget
    } = gameData

    // Needs error handling
    fetch(`/api/games/${matchCode}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
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
        data.whiteKing = findPieceBFS('e1', 'K', data.board);
        data.blackKing = findPieceBFS('e8', 'k', data.board);

        // Identifies if a pawn is currently awaiting promotion
        data.pawnPromotion = checkForPromotion(data.board);

        // Updates state with saved game data
        loadData(data);
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
      delete gameState.room;
      delete gameState.prevEnPassantTarget;
      loadData(gameState);
    })

    // Fires in response to reset game button in Options
    socket.on("reset", () => {
      dispatch({ type: 'reset' })
    })

    return (() => {
      socket.emit("leave", matchCode)
      socket.disconnect();
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  // Checks if the moving player's king is checked after each move
  useEffect(() => {

    const kingPosition = isWhite(game.turn) ? game.whiteKing : game.blackKing;

    if (kingChecked(...kingPosition, game.board, game.turn)) {
      setCheckedPlayer(game.turn);
    }

    else setCheckedPlayer('');

  }, [game.blackKing, game.whiteKing, game.board, game.turn])


  // If a king is in check, performs a more elaborate "checkmate" verification
  useEffect(() => {

    if (checkedPlayer) {

      const kingPosition = isWhite(checkedPlayer) ? game.whiteKing : game.blackKing

      const options = {
        canLong: false,
        canShort: false,
        enPassantTarget: game.enPassantTarget
      }

      if (isCheckmated(game.board, checkedPlayer, kingPosition, options)) {
        setWinner(isWhite(checkedPlayer) ? 'black' : 'white');
      }

    } else setWinner('');

  }, [checkedPlayer, game.blackKing, game.whiteKing, game.board, game.enPassantTarget])


  const updateStateAfterMove = (data) => {
    delete data.room;
    delete data.prevEnPassantTarget;
    loadData(data);
    setSelected('');
    setHoverState('');
  };

  const executeMove = (curr, target) => {

    const currRC = toRowCol(curr);
    const targetRC = toRowCol(target);

    const [currR, currC] = currRC;
    const currPiece = game.board[currR][currC];

    const newBoard = copyBoard(game.board);
    movePiece(currRC, targetRC, newBoard);

    const postMoveData = {
      room: matchCode,
      board: newBoard,
      enPassantTarget: '',
      whiteKing: [...game.whiteKing],
      blackKing: [...game.blackKing],
      whiteCanLong: game.whiteCanLong,
      whiteCanShort: game.whiteCanShort,
      blackCanLong: game.blackCanLong,
      blackCanShort: game.blackCanShort,
      prevEnPassantTarget: game.enPassantTarget,
      turn: game.turn === 'white' ? 'black' : 'white',
    }

    // Checks if moving the piece involves other state changes
    // Relevant for pawns, kings, and rooks
    const effectsFunction = pieceData[currPiece]['effects'];
    if (effectsFunction) effectsFunction(currRC, targetRC, postMoveData);

    // Saves new game state to database
    updateGame(postMoveData);

    // Sends new game state to other player
    socket.emit("move", postMoveData);

    if (freshGame === matchCode) setFreshGame('');

    // Updates local state
    updateStateAfterMove(postMoveData);
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

  const hoverHandler = (e) => {

    e.stopPropagation()

    const canLong = isWhite(player) ? game.whiteCanLong : game.blackCanLong;
    const canShort = isWhite(player) ? game.whiteCanShort : game.blackCanShort;

    if (canLong || canShort) {
      // Row 'e' under either of these conditions would house an un-moved king
      if (selected[0] === 'e' && e.target.className.includes('possible')) {
        if (e.target.id[0] === 'g') setHoverState('long');
        else if (e.target.id[0] === 'c') setHoverState('short');
      }
    }

    if (game.enPassantTarget === e.target.id
      && e.target.className.includes('targeted')) setHoverState('ep');

  }

  const possibleMoves = useMemo(() => {

    // Returns a set of all possible moves depending on the selected piece

    if (!selected) return new Set();

    const [row, col] = toRowCol(selected);
    const piece = game.board[row][col];
    const movesFunction = pieceData[piece]['moves'];

    const kingPosition = isWhite(player) ? game.whiteKing : game.blackKing;
    const canLong = isWhite(player) ? game.whiteCanLong : game.blackCanLong;
    const canShort = isWhite(player) ? game.whiteCanShort : game.blackCanShort;

    const options = {
      canLong,
      canShort,
      enPassantTarget: game.enPassantTarget
    }

    return new Set(movesFunction(row, col, game.board, player, kingPosition, options));

  }, [game.blackCanLong, game.blackCanShort, game.blackKing,
  game.whiteCanLong, game.whiteCanShort, game.whiteKing,
  game.board, game.enPassantTarget, player, selected]);

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

        const piece = game.board[r][c];
        const notation = toNotation([r, c]);

        const isSelectable = !winner && game.turn === player && !game.pawnPromotion && piece !== '_' && pieceData[piece]['player'] === player;

        const castleLongSquare = (isWhite(player) ? r === 7 : r === 0) && (c === 7 || c === 5);
        const castleShortSquare = (isWhite(player) ? r === 7 : r === 0) && (c === 0 || c === 3);

        const displayCastling =
          (castleLongSquare && hoverState === 'long') || (castleShortSquare && hoverState === 'short');

        const isEnPassantTarget = game.enPassantTarget === notation;
        const enPassantPawn = notation[0] === game.enPassantTarget[0] && notation[1] === selected[1];
        const displayEnPassant = enPassantPawn && hoverState === 'ep';

        const isPromoting = game.pawnPromotion === notation &&
          ((isWhite(player) && game.pawnPromotion[1] === '8') || (!isWhite(player) && game.pawnPromotion[1] === '1'));

        squares.push((
          <Square
            key={notation}

            piece={piece}
            notation={notation}

            // Square status props are passed as booleans for easier memoization
            // Prevents re-renders if square does not change status
            isSelectable={isSelectable}
            isSelected={selected === notation}
            isPossible={possibleMoves.has(notation)}

            isEnPassantTarget={isEnPassantTarget}
            isPromoting={isPromoting}

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

  }, [game.board, player, possibleMoves, game.turn, selected,
    winner, fadeType, game.enPassantTarget, game.pawnPromotion, hoverState])

  if (notFound) {
    return <div className='not-found fade-in-error'>Match Not Found</div>
  }

  if (!loaded) return null;

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
        onMouseOut={e => setHoverState('')}>
        {generateSquares}
      </div>
      <Options
        turn={game.turn}
        winner={winner}
        player={player}
        checkedPlayer={checkedPlayer}

        setPlayer={setPlayer}
        setOffline={setOffline}
        setSelected={setSelected}

        socket={socket}
        offline={offline}
        updateGame={updateGame} />
    </div >
  )
}

export default Board;
