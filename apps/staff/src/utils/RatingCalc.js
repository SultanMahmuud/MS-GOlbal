// utils/RatingSum.js
export const RatingCal = (reviews = []) => {
  const validRates = reviews
    .map((r) => r?.rate)
    .filter((r) => typeof r === "number" && r > 0);

  const sum = validRates.reduce((acc, val) => acc + val, 0);
  const average = validRates.length ? sum / validRates.length : 0;

  return average;
};
