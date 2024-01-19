import { toRowCol } from "../../game-logic"

const seaAnimation = (row, col) => {

  const diff = Math.abs(row - col);

  if (diff === 0) return 3;
  else if (diff <= 2) return 2;
  else if (diff <= 4) return 1;
  else return 0;
}

const flowerAnimation = (row, col) => {

  if (row === 0 || col === 0 || row === 7 || col === 7) return 3;
  else if (row === 1 || col === 1 || row === 6 || col === 6) return 2;
  else if (row === 2 || col === 2 || row === 5 || col === 5) return 1;
  else return 0;

}

const sunAnimation = (row, col) => {

  if ((row >= 5) && (col >= 5)) return 0;
  else if ((row >= 3) && (col >= 3)) return 1;
  else if ((row >= 1) && (col >= 1)) return 2;
  else return 3;
}

const lightAnimation = (row, col) => {

  return Math.floor((row + col) % 4)

}

const animationLibrary = {
  0: seaAnimation,
  1: flowerAnimation,
  2: sunAnimation,
  3: lightAnimation,
}

const determineAnimation = (notation, fadeType) => {

  const [row, col] = toRowCol(notation);
  const animationFunction = animationLibrary[fadeType];

  return animationFunction(row, col)

}

export default determineAnimation;
