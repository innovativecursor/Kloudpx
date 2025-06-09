import { useEffect } from "react";
import M from "materialize-css"; // Import Materialize CSS library

const CountryDropdown = () => {
  useEffect(() => {
    // Initialize Materialize select
    const selectElement = document.getElementById("country_select");
    M.FormSelect.init(selectElement);
  }, []);

  return (
    <div className="row">
      <div className="input-field col s6">
        <select id="country_select">
          <option value="" disabled selected>
            Choose your country
          </option>
          <option value="1">United States of America</option>
          <option value="2">India</option>
          {/* Add more options for countries */}
        </select>
        <label htmlFor="country_select">Country</label>
      </div>
    </div>
  );
};

export default CountryDropdown;
