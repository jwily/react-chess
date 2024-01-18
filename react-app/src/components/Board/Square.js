import React, { useEffect, useState } from "react";

import { pieceData, toRowCol } from '../../game-logic';
import determineAnimation from "./animations";

const animationClasses = [
  'fade-in-v-fast',
  'fade-in-fast',
  'fade-in-med',
  'fade-in-slow',
]

const Square = React.memo(({ notation, piece, player, isSelectable, isSelected, isPossible, fadeType }) => {

  // console.log('Square Rendered')

  const [animated, setAnimated] = useState(true);

  useEffect(() => {

    const removeAnimation = setTimeout(() => {
      setAnimated(false);
    }, 850)

    return () => clearTimeout(removeAnimation);

  }, [])

  const isAttackable = (() => {

    // Determines whether the square
    // is a potential target of an offensive move

    if (isPossible && piece !== '.') {

      const movingPlayer = player;
      const occupyingPlayer = pieceData[piece].player;

      if (movingPlayer !== occupyingPlayer) {
        return true;
      }
    }

    return false;

  })();

  const determineColor = () => {
    const [row, col] = toRowCol(notation);
    return (row + col) % 2 === 0 ? 'white square' : 'black square'
  }

  const determineStatus = () => {
    // These statuses must be checked for in this order
    if (isAttackable) return ' targeted';
    else if (piece === '.' && isPossible) return ' possible';
    else if (isSelected) return ' selected';
    else if (isSelectable) return ' selectable';
    else return '';
  }

  return (
    <span
      className={
        determineColor()
        + determineStatus()
        + (piece !== '.' ? ` ${pieceData[piece].player + '-' + pieceData[piece].name}` : '')
        + (` ${animated ? animationClasses[determineAnimation(notation, fadeType)] : ''}`)
      }
      id={notation}>
    </span >
  )
})

export default Square;
