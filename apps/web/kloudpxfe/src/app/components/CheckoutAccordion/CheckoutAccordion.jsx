import { useEffect } from "react";
import M from "materialize-css";

function CheckoutAccordion() {
  useEffect(() => {
    // Initialize Materialize accordion
    const elems = document.querySelectorAll(".collapsible");
    M.Collapsible.init(elems);
  }, []);

  return (
    <ul className="collapsible collapsible-emi-available">
      <li>
        <div className="collapsible-header">
          EMI Available{" "}
          <div style={{ position: "absolute", right: 10 }}>
            <i className="material-icons">expand_more</i>
          </div>
        </div>

        <div className="collapsible-body checkout-accordion-body">
          <span>
            Your order qualifies for EMI with valid credit cards (not available
            on purchase of Gold, Jewelry, Gift cards and Quiksie Sales pay balance
            top up).
            <span className="learn-more-checkout-accordion">Learn more</span>
          </span>
        </div>
      </li>
    </ul>
  );
}

export default CheckoutAccordion;
