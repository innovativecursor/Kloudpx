import React, { useEffect } from "react";
import { useMeasurementContext } from "../../contexts/MeasurementContext";

const PriceDetails = () => {
  const {
    measurementType,
    piecesPerBox,
    sellingPricePerBox,
    setSellingPricePerBox,
    sellingPricePerPiece,
    setSellingPricePerPiece,
    costPricePerBox,
    setCostPricePerBox,
    costPricePerPiece,
    setCostPricePerPiece,
  } = useMeasurementContext();

  const pieces = parseFloat(piecesPerBox);
  const spBox = parseFloat(sellingPricePerBox);
  const spPiece = parseFloat(sellingPricePerPiece);
  const cpBox = parseFloat(costPricePerBox);
  const cpPiece = parseFloat(costPricePerPiece);

  useEffect(() => {
    if (measurementType?.value === "perBox" && pieces > 0) {
      if (!isNaN(spBox)) setSellingPricePerPiece((spBox / pieces).toFixed(2));
      if (!isNaN(cpBox)) setCostPricePerPiece((cpBox / pieces).toFixed(2));
    }

    if (measurementType?.value === "perPiece" && pieces > 0) {
      if (!isNaN(spPiece)) setSellingPricePerBox((spPiece * pieces).toFixed(2));
      if (!isNaN(cpPiece)) setCostPricePerBox((cpPiece * pieces).toFixed(2));
    }
  }, [
    measurementType,
    piecesPerBox,
    sellingPricePerBox,
    sellingPricePerPiece,
    costPricePerBox,
    costPricePerPiece,
  ]);

  return (
    <div className="space-y-10 mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Selling Price (Per Box)
          </label>
          <input
            type="number"
            className="w-full px-3 py-3.5 border border-gray-500 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={sellingPricePerBox}
            onChange={(e) => setSellingPricePerBox(e.target.value)}
            placeholder="Enter per box price"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Selling Price (Per Piece)
          </label>
          <input
            type="number"
            className="w-full px-3 py-3.5 border border-gray-500 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={sellingPricePerPiece}
            onChange={(e) => setSellingPricePerPiece(e.target.value)}
            placeholder="Auto or enter per piece price"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cost Price (Per Box)
          </label>
          <input
            type="number"
            className="w-full px-3 py-3.5 border border-gray-500 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={costPricePerBox}
            onChange={(e) => setCostPricePerBox(e.target.value)}
            placeholder="Enter cost price per box"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cost Price (Per Piece)
          </label>
          <input
            type="number"
            className="w-full px-3 py-3.5 border border-gray-500 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={costPricePerPiece}
            onChange={(e) => setCostPricePerPiece(e.target.value)}
            placeholder="Auto or enter cost price per piece"
          />
        </div>
      </div>
    </div>
  );
};

export default PriceDetails;
