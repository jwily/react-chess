import { toRowCol } from "../../game-logic"

const seaAnimation = (row, col, isEven) => {

  const diff = Math.abs(row - col);

  if (diff === 0) return isEven ? 3 : 0;
  else if (diff <= 2) return isEven ? 2 : 1;
  else if (diff <= 4) return isEven ? 1 : 2;
  else return isEven ? 0 : 3;
}

const flowerAnimation = (row, col, isEven) => {

  if (row === 0 || col === 0 || row === 7 || col === 7) return isEven ? 3 : 0;
  else if (row === 1 || col === 1 || row === 6 || col === 6) return isEven ? 2 : 1;
  else if (row === 2 || col === 2 || row === 5 || col === 5) return isEven ? 1 : 2;
  else return isEven ? 0 : 3;

}

const sunAnimation = (row, col, isEven) => {

  if ((row >= 5) && (col >= 5)) return isEven ? 3 : 0;
  else if ((row >= 3) && (col >= 3)) return isEven ? 2 : 1;
  else if ((row >= 1) && (col >= 1)) return isEven ? 1 : 2;
  else return isEven ? 0 : 3;

}

const lightAnimation = (row, col, isEven) => {

  if (isEven) return Math.floor((row + col) % 4)
  else return 3 - Math.floor((row + col) % 4)

}

const chooseAnimation = (notation, fadeType) => {

  const [row, col] = toRowCol(notation);
  const isEven = fadeType % 2 === 0;

  if (fadeType <= 1) return seaAnimation(row, col, isEven);
  else if (fadeType <= 3) return flowerAnimation(row, col, isEven);
  else if (fadeType <= 5) return sunAnimation(row, col, isEven);
  else return lightAnimation(row, col, isEven);

}

export default chooseAnimation;
