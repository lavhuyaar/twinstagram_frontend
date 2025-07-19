export const abbreviateNumber = (number?: number | null) => {
  if (number != 0 && !number) return;

  if (number >= 1000000000) {
    return (number / 1000000000).toFixed(1).replace(/\.0$/, "") + "b"; // billion (B)
  } else if (number >= 1000000) {
    return (number / 1000000).toFixed(1).replace(/\.0$/, "") + "m"; // million (M)
  } else if (number >= 1000) {
    return (number / 1000).toFixed(1).replace(/\.0$/, "") + "k"; // thousand (k)
  }
  return number.toString();
};

abbreviateNumber(1000);
abbreviateNumber(10000);
abbreviateNumber(2299999);
