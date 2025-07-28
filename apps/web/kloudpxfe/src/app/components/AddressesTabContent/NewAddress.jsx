import React from "react";

const NewAddress = () => {
  return (
    <div>
      <form className="mt-10 grid grid-cols-1 gap-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="font-medium text-xs dark-text">
              Name of Residency
            </label>
            <input
              type="text"
              placeholder="Write your house no. here..."
              className="w-full border-2 px-4 py-2 mt-1 rounded-lg placeholder:text-xs border-gray-300 backdrop-blur-lg"
            />
          </div>
          <div>
            <label className="font-medium text-xs dark-text">Unit</label>
            <input
              type="text"
              placeholder="Unit"
              className="w-full border-2 px-4 py-2 mt-1 rounded-lg placeholder:text-xs border-gray-300 backdrop-blur-lg"
            />
          </div>
        </div>

        <div>
          <label className="font-medium text-xs dark-text">Region</label>
          <input
            type="text"
            placeholder="Write your house no. here..."
            className="w-full border-2 px-4 py-2 mt-1 rounded-lg placeholder:text-xs border-gray-300 backdrop-blur-lg"
          />
        </div>

        <div>
          <label className="font-medium text-xs dark-text">Province City</label>
          <select className="w-full border-2 px-4 py-2 mt-1 rounded-lg placeholder:text-xs border-gray-300 backdrop-blur-lg">
            <option className="text-xs hidden">Select City</option>
            <option>City 1</option>
            <option>City 2</option>
          </select>
        </div>

        <div>
          <label className="font-medium text-xs dark-text">Barangay</label>
          <input
            type="text"
            placeholder="Write your house no. here..."
            className="w-full border-2 px-4 py-2 mt-1 rounded-lg placeholder:text-xs border-gray-300 backdrop-blur-lg"
          />
        </div>

        <div>
          <label className="font-medium text-xs dark-text">Zip Code</label>
          <input
            type="text"
            placeholder="Write your zip code here..."
            className="w-full border-2 px-4 py-2 mt-1 rounded-lg placeholder:text-xs border-gray-300 backdrop-blur-lg"
          />
        </div>

        <div className="pt-8">
          <button
            type="submit"
            className="bg-[#0070BA] text-white cursor-pointer w-full py-2.5 text-[10px] rounded-full font-medium hover:bg-[#005c96]"
          >
            Save & Proceed
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewAddress;
