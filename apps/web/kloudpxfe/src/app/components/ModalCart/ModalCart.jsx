import React, { useEffect } from "react";
import M from "materialize-css";
import airJordan from "@/assets/air-jordan-1.png";

const ModalCart = ({ open, handleClose }) => {
  useEffect(() => {
    // Initialize Materialize modal
    const modalElement = document.getElementById("modal-cart");
    const options = {};
    M.Modal.init(modalElement, options);
  }, []);

  return (
    <div id="modal-cart" className={`modal ${open ? "open" : ""}`}>
      <div className="modal-content">
        <h4>Shopping Cart</h4>
        <div className="row">
          <div className="col s6">
            <div className="row">
              <div className="col s12">
                <img
                  src={airJordan}
                  alt="Product"
                  style={{ width: "100%", borderRadius: 8 }}
                />
              </div>
              <div className="col s12">
                <p>Air Jordan Shoes</p>
                <p>Price: $200.00</p>
              </div>
            </div>
          </div>
          <div className="col s6">
            <p>Your cart contains:</p>
            <h6>1 item</h6>
            <h5>$860.00</h5>
            <button
              className="btn waves-effect waves-light"
              onClick={handleClose}
              style={{ marginTop: 20 }}
            >
              Continue Shopping
            </button>
            <button
              className="btn red waves-effect waves-light"
              onClick={handleClose}
              style={{ marginTop: 10 }}
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalCart;
