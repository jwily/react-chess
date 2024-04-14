import React from "react";

import './pieces.css';

const Promotion = ({ player, data }) => {

  return (
    <span className={`promotion-grid ${player}`}>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </span>
  )

}

export default Promotion;
