export const numberDivide = (bainumerator, denominator) => {
  if (!bainumerator || !denominator) {
    return 0;
  }
  return Math.round((bainumerator / denominator) * 1000) / 1000;
};
