export const calculatePricePerPiece = ({
  spPerBox,
  cpPerBox,
  measurementValue,
  piecesPerBox,
  showMeasurementValue,
}) => {
  const divisor = showMeasurementValue
    ? parseFloat(measurementValue)
    : parseFloat(piecesPerBox);

  const spPerPiece =
    spPerBox && divisor && !isNaN(spPerBox) && !isNaN(divisor)
      ? (parseFloat(spPerBox) / divisor).toFixed(2)
      : "";

  const cpPerPiece =
    cpPerBox && divisor && !isNaN(cpPerBox) && !isNaN(divisor)
      ? (parseFloat(cpPerBox) / divisor).toFixed(2)
      : "";

  return { spPerPiece, cpPerPiece };
};
