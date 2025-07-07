export const calculatePricePerPiece = ({
  spPerBox,
  cpPerBox,
  piecesPerBox,
  // measurementValue,
  // showMeasurementValue,
}) => {
  const divisor = parseFloat(piecesPerBox);

  if (!divisor || isNaN(divisor) || divisor <= 0) {
    return { spPerPiece: "", cpPerPiece: "" };
  }

  const spPerPiece =
    spPerBox && !isNaN(spPerBox)
      ? (parseFloat(spPerBox) / divisor).toFixed(2)
      : "";

  const cpPerPiece =
    cpPerBox && !isNaN(cpPerBox)
      ? (parseFloat(cpPerBox) / divisor).toFixed(2)
      : "";

  return { spPerPiece, cpPerPiece };
};
