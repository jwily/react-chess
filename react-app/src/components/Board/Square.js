import React from "react";

import { data } from '../../game-logic';

const Square = React.memo(({ color, notation, piece, isSelectable, isSelected, isPossible, player }) => {

  const isAttackable = (() => {
    // Determines whether the square
    // is a potential target of an offensive move
    if (isPossible && piece) {

      const movingPlayer = player;
      const occupyingPlayer = data[piece].player;

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
        + (piece ? ` ${data[piece].player + '-' + data[piece].name}` : '')
      }
      id={notation}
    >
      {/* <span className='position'>
        {notation}
      </span> */}
    </span >
  )
})

export default Square;
