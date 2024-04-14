import React from "react";

import './pieces.css';
import { isWhite } from "../../game-logic";

const Promotion = ({ player, data }) => {

  const pieces = isWhite(player) ? ['Q', 'N', 'R', 'B'] : ['q', 'n', 'r', 'b'];

  return (
    <span className={`promotion-grid ${player}`}>
      {pieces.map(piece => {

        const { color, name, image } = data[piece];
        const SVG = image;

        return (
          <button>
            <SVG className={color + ' ' + name} />
          </button>
        )
      })}
    </span>
  )

}

export default Promotion;
