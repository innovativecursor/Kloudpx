import { useState, useEffect } from "react";
import M from "materialize-css";
import CountryDropdown from "../CountryDropdown/CountryDropdown";
import CollapsibleWithRadioButton from "../CollapsibleWithRadioButton/CollapsibleWithRadioButton";
import AddressesTabContent from "../AddressesTabContent/AddressesTabContent";

function CheckoutContent() {
  const [activeCollapsible, setActiveCollapsible] = useState(0); // State to track active collapsible

  useEffect(() => {
    // Initialize Materialize collapsible
    const collapsibles = document.querySelectorAll(".collapsible");
    M.Collapsible.init(collapsibles, {});
  }, []); // Run only once after the component mounts

  const handleNext = () => {
    setActiveCollapsible(activeCollapsible + 1); // Move to the next collapsible
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col l12 s12 m9">
          <h4 className="cartItemsBlock-heading">Order Details</h4>
        </div>
        <div className="col l6 s12">
          {/* Collapsible 2: Address Inputs */}
          <ul
            className="collapsible shadow-none-collap"
            data-collapsible="accordion"
          >
            <li className={activeCollapsible === 1 ? "active" : ""}>
              <div className="collapsible-header">
                <h4>Shipping Address</h4>
              </div>
              <div className="collapsible-body">
                {/* <div className="row">
                  <div className="input-field col s6">
                    <div className="input-group prepend">
                      <div className="input-group-text input-account-grp-setting">
                        <i className="material-icons register-person-icon input-account-icon">
                          account_circle
                        </i>
                      </div>
                      <input
                        className="browser-default mobile"
                        name="firstName"
                        placeholder="First Name"
                        type="text" // Change input type to text
                      />
                    </div>
                  </div>
                  <div className="input-field col s6">
                    <div className="input-group prepend">
                      <div className="input-group-text input-account-grp-setting">
                        <i className="material-icons register-person-icon input-account-icon">
                          account_circle
                        </i>
                      </div>
                      <input
                        className="browser-default mobile"
                        name="lastName"
                        placeholder="Last Name"
                        type="text" // Change input type to text
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="input-field col s12">
                    <div className="input-group prepend">
                      <div className="input-group-text input-account-grp-setting">
                        <i className="material-icons register-person-icon input-account-icon">
                          home
                        </i>
                      </div>
                      <input
                        className="browser-default mobile"
                        name="address"
                        placeholder="Address"
                        type="text" // Change input type to text
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="input-field col s12">
                    <div className="input-group prepend">
                      <div className="input-group-text input-account-grp-setting">
                        <i className="material-icons register-person-icon input-account-icon">
                          home
                        </i>
                      </div>
                      <input
                        className="browser-default mobile"
                        name="confirmAddress"
                        placeholder="Confirm Address"
                        type="text" // Change input type to text
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="input-field col s6">
                    <div className="input-group prepend">
                      <div className="input-group-text input-account-grp-setting">
                        <i className="material-icons register-person-icon input-account-icon">
                          phone_iphone
                        </i>
                      </div>
                      <input
                        className="browser-default mobile"
                        name="mobileNumber"
                        placeholder="Mobile Number"
                        type="number" // Change input type to text
                      />
                    </div>
                  </div>
                  <CountryDropdown />
                </div>
                <div className="row">
                  <div className="input-field col s6">
                    <div className="input-group prepend">
                      <div className="input-group-text input-account-grp-setting">
                        <i className="material-icons register-person-icon input-account-icon">
                          flag
                        </i>
                      </div>
                      <input
                        className="browser-default mobile"
                        name="state"
                        placeholder="State/Province"
                        type="text" // Change input type to text
                      />
                    </div>
                  </div>
                  <div className="input-field col s6">
                    <div className="input-group prepend">
                      <div className="input-group-text input-account-grp-setting">
                        <i className="material-icons register-person-icon input-account-icon">
                          local_shipping
                        </i>
                      </div>
                      <input
                        className="browser-default mobile"
                        name="postalCode"
                        placeholder="Postal Code"
                        type="number" // Change input type to text
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col s12">
                    <label>
                      <input
                        type="checkbox"
                        className="filled-in"
                        checked="checked"
                      />
                      <span>
                        My billing address is the same as my shipping address.
                      </span>
                    </label>
                  </div>
                </div> */}
                <div className="col l12">
                  <LinkddressesTabContent />
                </div>

                <button className="btn btn-secondary" onClick={handleNext}>
                  Confirm Details
                </button>
              </div>
            </li>
          </ul>

          {/* Collapsible 3: Payment Inputs */}
          <ul
            className="collapsible shadow-none-collap"
            data-collapsible="accordion"
          >
            <li className={activeCollapsible === 2 ? "active" : ""}>
              <div className="collapsible-header">
                <h4>Payment</h4>
              </div>
              <div className="collapsible-body">
                {/* <CollapsibleWithRadioButton /> */}
                <button className="btn btn-secondary" onClick={handleNext}>
                  Place to Order
                </button>
              </div>
            </li>
          </ul>
        </div>
        <div className="col l6 s12">
          <div className="card">
            <div className="card-content">
              <div className="card-header-details-in-order-summary">
                <p>Order Summary</p>
                <p className="edit-cart">Edit cart</p>
              </div>
              <div className="divider"></div>
              <div className="second-half-summary">
                <div className="items-number-cart">
                  <p>1 item</p>
                </div>
                <div className="img-and-final-price">
                  <div>
                    <div className="text-and-size">
                      <img
                        className="order-summary-img"
                        src="https://cdn11.bigcommerce.com/s-j3ehq026w9/products/111/images/404/mug-today-is-a-good-day_1__54893.1580725321.220.290.jpg?c=1"
                        alt=""
                      />
                      <div>
                        <p className="items-on-order">
                          1 x [Sample] Smith Journal 13
                        </p>
                        <p className="size-items">Size small</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="order-price-summary">$650.00</p>
                  </div>
                </div>
              </div>
              <div className="divider"></div>
              <div className="third-half-summary">
                <div className="subtotal-summary-order">
                  <p className="shop-text">Subtotal</p>
                  <p className="shop-price">$650.00</p>
                </div>
                <div className="subtotal-summary-order">
                  <p className="shop-text">Shipping</p>
                  <p className="shop-price">--</p>
                </div>
                <div className="subtotal-summary-order">
                  <p className="shop-text">Tax</p>
                  <p className="shop-price">$0.00</p>
                </div>
                <div className="subtotal-summary-order">
                  <p className="coupon-gift-text">Coupon/Gift Certificate</p>
                </div>
              </div>
              <div className="divider"></div>
              <div className="fourth-half-summary">
                <h6>Total(USD)</h6>
                <h3>$650.00</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutContent;
