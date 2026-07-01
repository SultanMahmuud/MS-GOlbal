
export const DateConversionWithTime = (date, fallback = "Not set") => {
  if (!date) return fallback;

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return fallback;
  }

  return parsedDate.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
