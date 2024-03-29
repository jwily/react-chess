import React, { useState, useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import Board from './components/Board';
import Home from "./components/Home";

import WhiteKing from './images/no_shadow/w_king_svg_NoShadow.svg'
import WhiteQueen from './images/no_shadow/w_queen_svg_NoShadow.svg'
import WhiteBishop from './images/no_shadow/w_bishop_svg_NoShadow.svg'
import WhiteRook from './images/no_shadow/w_rook_svg_NoShadow.svg'
import WhiteKnight from './images/no_shadow/w_knight_svg_NoShadow.svg'
import WhitePawn from './images/no_shadow/w_pawn_svg_NoShadow.svg'

import BlackKing from './images/no_shadow/b_king_svg_NoShadow.svg'
import BlackQueen from './images/no_shadow/b_queen_svg_NoShadow.svg'
import BlackBishop from './images/no_shadow/b_bishop_svg_NoShadow.svg'
import BlackRook from './images/no_shadow/b_rook_svg_NoShadow.svg'
import BlackKnight from './images/no_shadow/b_knight_svg_NoShadow.svg'
import BlackPawn from './images/no_shadow/b_pawn_svg_NoShadow.svg'

const imagePaths = [
  WhiteKing, WhiteQueen, WhiteBishop, WhiteRook, WhiteKnight, WhitePawn,
  BlackKing, BlackQueen, BlackBishop, BlackRook, BlackKnight, BlackPawn
]

function App() {

  const [imagesLoaded, setImagesLoaded] = useState({});
  const [freshGame, setFreshGame] = useState('');

  useEffect(() => {
    imagePaths.forEach(path => {
      const img = new Image();
      img.onload = () => setImagesLoaded(prev => ({ ...prev, [path]: true }));
      img.src = path;
    })
  }, [])

  if (!imagePaths.every(path => imagesLoaded[path])) return null;

  return (
    <>
      <Switch>
        <Route exact path='/'>
          <Home freshGame={freshGame} setFreshGame={setFreshGame} />
        </Route>
        <Route path='/encounter/:matchCode'>
          <Board freshGame={freshGame} setFreshGame={setFreshGame} />
        </Route>
        <Route>
          <div className="not-found">Page Not Found</div>
        </Route>
      </Switch>
    </>
  );
}

export default App;
