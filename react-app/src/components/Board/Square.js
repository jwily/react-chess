import React, { useEffect, useState } from "react";

import { isWhite, toRowCol } from '../../game-logic';
import determineAnimation from "./animations";

import { ReactComponent as WhiteKing } from '../../images/no_shadow/w_king_svg_NoShadow.svg'
import { ReactComponent as WhiteQueen } from '../../images/no_shadow/w_queen_svg_NoShadow.svg'
import { ReactComponent as WhiteBishop } from '../../images/no_shadow/w_bishop_svg_NoShadow.svg'
import { ReactComponent as WhiteRook } from '../../images/no_shadow/w_rook_svg_NoShadow.svg'
import { ReactComponent as WhiteKnight } from '../../images/no_shadow/w_knight_svg_NoShadow.svg'
import { ReactComponent as WhitePawn } from '../../images/no_shadow/w_pawn_svg_NoShadow.svg'

import { ReactComponent as BlackKing } from '../../images/no_shadow/b_king_svg_NoShadow.svg'
import { ReactComponent as BlackQueen } from '../../images/no_shadow/b_queen_svg_NoShadow.svg'
import { ReactComponent as BlackBishop } from '../../images/no_shadow/b_bishop_svg_NoShadow.svg'
import { ReactComponent as BlackRook } from '../../images/no_shadow/b_rook_svg_NoShadow.svg'
import { ReactComponent as BlackKnight } from '../../images/no_shadow/b_knight_svg_NoShadow.svg'
import { ReactComponent as BlackPawn } from '../../images/no_shadow/b_pawn_svg_NoShadow.svg'

const SVG_MAP = {
  'K': WhiteKing,
  'Q': WhiteQueen,
  'B': WhiteBishop,
  'R': WhiteRook,
  'N': WhiteKnight,
  'P': WhitePawn,
  'k': BlackKing,
  'q': BlackQueen,
  'b': BlackBishop,
  'r': BlackRook,
  'n': BlackKnight,
  'p': BlackPawn,
  '_': null,
}

const animationClasses = [
  ' fade-in-v-fast',
  ' fade-in-fast',
  ' fade-in-med',
  ' fade-in-slow',
]

const Square = React.memo(({ notation, piece, player, isEnPassantTarget,
  isSelectable, isSelected, isPossible, fadeType, displayCastling, displayEnPassant }) => {

  const [animated, setAnimated] = useState(true);

  // console.log('Square Rendered');

  useEffect(() => {

    const removeAnimation = setTimeout(() => {
      setAnimated(false);
    }, 850)

    return () => clearTimeout(removeAnimation);

  }, [])

  let PieceComponent = SVG_MAP[piece];

  if (isPossible && displayCastling) {
    if (isWhite(player)) PieceComponent = WhiteRook;
    else PieceComponent = BlackRook;
  }

  const determinePieceClass = () => {

    let color = piece.toLowerCase() !== piece ? 'white' : 'black';
    if (isPossible && displayCastling) color = player;

    const sizing = piece.toLowerCase() === 'p' ? ' pawn' : ' piece';

    let transparent = '';

    if (displayEnPassant || (!isPossible && displayCastling)) {
      transparent = ' transparent';
    }

    return color + sizing + transparent;

  }

  const isAttackable = isPossible && (piece !== '_' || isEnPassantTarget);

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
