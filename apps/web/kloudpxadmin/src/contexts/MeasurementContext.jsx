import { createContext, useContext, useState, useEffect } from "react";

export const MeasurementContext = createContext();

export const MeasurementProvider = ({ children }) => {
  const [measurementTypeOptions] = useState([
    { label: "Per Box", value: "perBox" },
    { label: "Per Piece", value: "perPiece" },
  ]);
  const [measurementType, setMeasurementType] = useState(null);
  const [measurementValue, setMeasurementValue] = useState("");
  const [piecesPerBox, setPiecesPerBox] = useState("");
  const [sellingPricePerBox, setSellingPricePerBox] = useState("");
  const [sellingPricePerPiece, setSellingPricePerPiece] = useState("");
  const [costPricePerBox, setCostPricePerBox] = useState("");
  const [costPricePerPiece, setCostPricePerPiece] = useState("");

  useEffect(() => {
    const pieces = parseFloat(piecesPerBox);
    const sellBox = parseFloat(sellingPricePerBox);
    const costBox = parseFloat(costPricePerBox);
    const sellPiece = parseFloat(sellingPricePerPiece);
    const costPiece = parseFloat(costPricePerPiece);

    if (measurementType?.value === "perBox" && pieces > 0) {
      if (!isNaN(sellBox))
        setSellingPricePerPiece((sellBox / pieces).toFixed(2));
      else setSellingPricePerPiece("");
      if (!isNaN(costBox)) setCostPricePerPiece((costBox / pieces).toFixed(2));
      else setCostPricePerPiece("");
    }

    if (measurementType?.value === "perPiece" && pieces > 0) {
      if (!isNaN(sellPiece))
        setSellingPricePerBox((sellPiece * pieces).toFixed(2));
      else setSellingPricePerBox("");
      if (!isNaN(costPiece))
        setCostPricePerBox((costPiece * pieces).toFixed(2));
      else setCostPricePerBox("");
    }
  }, [
    measurementType,
    piecesPerBox,
    sellingPricePerBox,
    costPricePerBox,
    sellingPricePerPiece,
    costPricePerPiece,
  ]);

  return (
    <MeasurementContext.Provider
      value={{
        measurementTypeOptions,
        measurementType,
        setMeasurementType,
        measurementValue,
        setMeasurementValue,
        piecesPerBox,
        setPiecesPerBox,

        sellingPricePerBox,
        setSellingPricePerBox,
        sellingPricePerPiece,
        setSellingPricePerPiece,
        costPricePerBox,
        setCostPricePerBox,
        costPricePerPiece,
        setCostPricePerPiece,
      }}
    >
      {children}
    </MeasurementContext.Provider>
  );
};

export const useMeasurementContext = () => useContext(MeasurementContext);
