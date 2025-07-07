import React from "react";

const IsBrandItem = ({ label, isBrand, setIsBrand }) => {
  return (
    <div className="mt-7 rounded-lg border border-gray-300">
      <label className="flex items-center gap-2 text-sm font-medium p-3">
        <input
          type="checkbox"
          checked={isBrand}
          onChange={(e) => setIsBrand(e.target.checked)}
          className="w-4 h-4"
        />
        {label}
      </label>
    </div>
  );
};

export default IsBrandItem;
