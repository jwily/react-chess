import React, { useEffect, useState } from "react";

import './pieces.css';

import { toRowCol } from '../../game-logic';
import determineAnimation from "./animations";

import { ReactComponent as King } from '../../images/king.svg'
import { ReactComponent as Queen } from '../../images/queen.svg'
import { ReactComponent as Bishop } from '../../images/bishop.svg'
import { ReactComponent as Rook } from '../../images/rook.svg'
import { ReactComponent as Knight } from '../../images/knight.svg'
import { ReactComponent as Pawn } from '../../images/pawn.svg'

const RENDER_DATA = {
  'K': {
    color: 'white',
    name: 'king',
    image: King,
  },
  'Q': {
    color: 'white',
    name: 'queen',
    image: Queen,
  },
  'B': {
    color: 'white',
    name: 'bishop',
    image: Bishop,
  },
  'R': {
    color: 'white',
    name: 'rook',
    image: Rook,
  },
  'N': {
    color: 'white',
    name: 'knight',
    image: Knight,
  },
  'P': {
    color: 'white',
    name: 'pawn',
    image: Pawn,
  },
  'k': {
    color: 'black',
    name: 'king',
    image: King,
  },
  'q': {
    color: 'black',
    name: 'queen',
    image: Queen,
  },
  'b': {
    color: 'black',
    name: 'bishop',
    image: Bishop,
  },
  'r': {
    color: 'black',
    name: 'rook',
    image: Rook,
  },
  'n': {
    color: 'black',
    name: 'knight',
    image: Knight,
  },
  'p': {
    color: 'black',
    name: 'pawn',
    image: Pawn,
  },
  '_': {
    color: null,
    name: null,
    image: null
  }
}

const animationClasses = [
  ' fade-in-v-fast',
  ' fade-in-fast',
  ' fade-in-med',
  ' fade-in-slow',
]

const Square = React.memo(({ notation, piece, player, isEnPassantTarget, isPromoting,
  isSelectable, isSelected, isPossible, fadeType, displayCastling, displayEnPassant }) => {

  const [animated, setAnimated] = useState(true);

  // console.log('Square Rendered');

  useEffect(() => {

    const removeAnimation = setTimeout(() => {
      setAnimated(false);
    }, 850)

    return () => clearTimeout(removeAnimation);

  }, [])

  let PieceComponent = RENDER_DATA[piece]['image'];

  if (isPossible && displayCastling) PieceComponent = Rook;

  const determinePieceClass = () => {

    let { color, name } = RENDER_DATA[piece];

    if (isPossible && displayCastling) {
      color = player;
      name = 'rook';
    };

    let transparent = '';

    if (displayEnPassant || (!isPossible && displayCastling)) {
      transparent = ' transparent';
    }

    return color + ' ' + name + transparent;

  }

  const isAttackable = isPossible && (piece !== '_' || isEnPassantTarget);

  const determineColor = () => {
    const [row, col] = toRowCol(notation);
    return (row + col) % 2 === 0 ? 'light square' : 'dark square'
  }

  const determineStatus = () => {
    if (isAttackable) return ' targeted';
    else if (isPossible) return ' possible';
    else if (isSelected) return ' selected';
    else if (isSelectable) return ' selectable';
    else return '';
  }

  return (
    <span
      className={
        determineColor()
        + determineStatus()
        + (animated ? animationClasses[determineAnimation(notation, fadeType)] : '')
      }
      id={notation} >
      {PieceComponent && <PieceComponent className={determinePieceClass(piece)} />}
    </span >
  )
})

export default Square;
