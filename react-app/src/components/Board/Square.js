import React, { useEffect, useState } from "react";

import { pieceData } from '../../game-logic';
import chooseAnimation from "./animations";

const animationClasses = [
  'fade-in-v-fast',
  'fade-in-fast',
  'fade-in-med',
  'fade-in-slow',
]

const Square = React.memo(({ color, notation, piece, player, isSelectable, isSelected, isPossible, fadeType }) => {

  // console.log('Square Rendered');

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
    if (isPossible && piece) {

      const movingPlayer = player;
      const occupyingPlayer = pieceData[piece].player;

      if (movingPlayer !== occupyingPlayer) {
        return true;
      }
    }

    return false;

  })();

  const determineStatus = () => {
    // These statuses must be checked for in this order
    if (isAttackable) return ' targeted';
    else if (!piece && isPossible) return ' possible';
    else if (isSelected) return ' selected';
    else if (isSelectable) return ' selectable';
    else return '';
  }

  return (
    <span
      className={
        color
        + determineStatus()
        + (piece ? ` ${pieceData[piece].player + '-' + pieceData[piece].name}` : '')
        + (` ${animated ? animationClasses[chooseAnimation(notation, fadeType)] : ''}`)
      }
      id={notation}
    >
      {/* {chooseAnimation(notation, 0)} */}
    </span >
  )
})

export default Square;
