import React from "react";

import './pieces.css';
import { isWhite } from "../../game-logic";

const Promotion = ({ player, data, promotionOpen, setPromotionOpen }) => {

  const pieces = isWhite(player) ? ['Q', 'N', 'R', 'B'] : ['q', 'n', 'r', 'b'];

  if (!promotionOpen) return null;

  return (
    <div className={`promotion-grid white`}>
      {pieces.map(piece => {

        const { color, name, image } = data[piece];
        const SVG = image;

        return (
          <button key={name}>
            <SVG className={color + ' ' + name} />
          </button>
        )
      })}
      <button className='promotion-close'
        onClick={(e) => {
          e.stopPropagation();
          setPromotionOpen(false);
        }}>
        <i className='fa-solid fa-xmark'></i>
      </button>
    </div>
  )

}

export default Promotion;
