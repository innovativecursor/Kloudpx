import { useState } from "react";
import "./AddressesTabContent.css";
// Component for displaying the current address
const CurrentAddress = ({ address, userName, phoneNumber, companyName }) => {
  return (
    <div className="card-content card-current-address">
      <p className="address-title">{userName}</p>
      <p className="company-title">{companyName}</p>
      <p className="address-details address-details--postal">{address}</p>
      <span className="phone-number-address-tab">
        Phone : <p>{phoneNumber}</p>
      </span>
      <div className="btns-address-tab">
        <button className="btn btn-primary edit-btn">Edit</button>
        <button className="btn btn-primary delete-btn-address">Delete</button>
      </div>
    </div>
  );
};

// Component for entering a new address
const NewAddressForm = ({ onUpdate }) => {
  const [newAddress, setNewAddress] = useState("");

  const handleChange = (e) => {
    setNewAddress(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(newAddress);
    setNewAddress("");
  };

  return (
    <div className="card">
      <div className="card-content">
        <span className="card-title">New Address</span>
        <form onSubmit={handleSubmit}>
          <div className="input-field">
            <input
              id="new-address-input"
              type="text"
              value={newAddress}
              onChange={handleChange}
              required
            />
            <label htmlFor="new-address-input">Enter new address</label>
          </div>
          <button className="btn waves-effect waves-light" type="submit">
            Update Address
          </button>
        </form>
      </div>
    </div>
  );
};

const AddressesTabContent = () => {
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [currentAddress, setCurrentAddress] =
    useState(`01, Bldg No.69, Madhav Complex CHS Ltd.,
  Shanti Park, Mira Road East,
  Thane, India - 401107`);

  const handleUpdateAddress = (newAddress) => {
    setCurrentAddress(newAddress);
    setShowNewAddress(false);
  };

  return (
    <>
      <div className="row">
        <div className="col l6 m6 s12">
          <div className="card">
            {showNewAddress ? (
              <NewAddressForm onUpdate={handleUpdateAddress} />
            ) : (
              <CurrentAddress
                address={currentAddress}
                userName={"Vaishnav Parte"}
                companyName={"Myzow Solutions"}
                phoneNumber={"+91-8928027439"}
              />
            )}
          </div>
        </div>
        <div
          className="card col l6 m6 s12"
          onClick={() => setShowNewAddress(true)}
        >
          <div className="card-content card-add-text">
            <span className="material-symbols-outlined add-icon-address-tab">
              add
            </span>
            <p>New Address</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddressesTabContent;
