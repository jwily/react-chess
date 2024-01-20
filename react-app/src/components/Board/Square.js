import React, { useEffect, useState } from "react";

import { pieceData, toRowCol } from '../../game-logic';
import determineAnimation from "./animations";

const animationClasses = [
  ' fade-in-v-fast',
  ' fade-in-fast',
  ' fade-in-med',
  ' fade-in-slow',
]

const Square = React.memo(({ notation, piece, player, isSelectable, isSelected, isPossible, fadeType, displayCastling }) => {

  const [animated, setAnimated] = useState(true);

  // console.log('Square Rendered');

  useEffect(() => {

    const removeAnimation = setTimeout(() => {
      setAnimated(false);
    }, 850)

    return () => clearTimeout(removeAnimation);

  }, [])

  const isAttackable = isPossible && piece !== '_';

  const determineColor = () => {
    const [row, col] = toRowCol(notation);
    return (row + col) % 2 === 0 ? 'light square' : 'dark square'
  }

  const determineStatus = () => {
    // These statuses must be checked for in this order
    if (isAttackable) return ' targeted';
    else if (piece === '_' && isPossible) return ' possible';
    else if (isSelected) return ' selected';
    else if (isSelectable) return ' selectable';
    else return '';
  }

  const determingCastlingDisplay = () => {

    if (!displayCastling) return '';

    if (isPossible) return ` ${player} rook`
    else return ' transparent'

  }

  return (
    <span
      className={
        determineColor()
        + determineStatus()
        + (piece !== '_' ? ` ${pieceData[piece].player + ' ' + pieceData[piece].name}` : '')
        + (animated ? animationClasses[determineAnimation(notation, fadeType)] : '')
        + determingCastlingDisplay()
      }
      id={notation} >
    </span >
  )
})

export default Square;
