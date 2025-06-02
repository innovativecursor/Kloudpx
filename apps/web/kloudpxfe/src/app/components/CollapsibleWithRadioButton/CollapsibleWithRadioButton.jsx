import { useState } from "react";
import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";
const CollapsibleWithRadioButton = () => {
  const [activeCollapsible, setActiveCollapsible] = useState(1);

  const handleCollapsibleChange = (collapsibleNumber) => {
    setActiveCollapsible(collapsibleNumber);
  };

  const [state, setState] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
    focus: "",
  });

  const handleInputChange = (evt) => {
    const { name, value } = evt.target;

    setState((prev) => ({ ...prev, [name]: value }));
  };

  const handleInputFocus = (evt) => {
    setState((prev) => ({ ...prev, focus: evt.target.name }));
  };

  return (
    <ul className="collapsible shadow-none-collap" data-collapsible="accordion">
      {/* First collapsible */}
      <li className={activeCollapsible === 1 ? "active" : ""}>
        <div className="collapsible-header collapsible-card-header">
          <h6>Credit Card</h6>
          <span className="material-symbols-outlined">expand_more</span>
        </div>
        <div className="collapsible-body collapsible-card-body">
          <div className="row">
            <Cards
              number={state.number}
              expiry={state.expiry}
              cvc={state.cvc}
              name={state.name}
              focused={state.focus}
            />
          </div>

          <div className="row">
            <div className="input-field col l6 s12">
              <label htmlFor="card_number">Card Number</label>
              <input
                id="card_number"
                type="number"
                name="number"
                value={state.number}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
              />
            </div>
            <div className="input-field col l6 s12">
              <label htmlFor="cardholder_name">Cardholder Name</label>
              <input
                id="cardholder_name"
                type="text"
                name="name"
                value={state.name}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
              />
            </div>
          </div>
          <div className="row">
            <div className="input-field col l6 s12">
              <label htmlFor="expiry_date">Expiry Date</label>
              <input
                id="expiry_date"
                className=""
                type="text"
                name="expiry"
                value={state.expiry}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
              />
            </div>
            <div className="input-field col l6 s12">
              <label htmlFor="cvc">CVC</label>
              <input
                id="cvc"
                type="number"
                name="cvc"
                value={state.cvc}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
              />
            </div>
          </div>
        </div>
      </li>
    </ul>
  );
};

export default CollapsibleWithRadioButton;
