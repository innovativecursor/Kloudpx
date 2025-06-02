import "./AccountSettingsTabContent.css";

const AccountSettingsTabContent = () => {
  return (
    <>
      <div className="row">
        <div className="col l3 s6 input-field">
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
        <div className="col l3 s6 input-field">
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
        <div className="col l3 s6 input-field">
          <div className="input-group prepend">
            <div className="input-group-text input-account-grp-setting">
              <span className="material-symbols-outlined register-person-icon input-account-icon">
                source_environment
              </span>
            </div>
            <input
              className="browser-default mobile"
              name="companyName"
              placeholder="Company Name"
              type="text" // Change input type to text
            />
          </div>
        </div>
        <div className="col l3 s6 input-field">
          <div className="input-group prepend">
            <div className="input-group-text input-account-grp-setting">
              <span className="material-symbols-outlined register-person-icon input-account-icon">
                mail
              </span>
            </div>
            <input
              className="browser-default mobile"
              name="email"
              placeholder="Email Address"
              type="text" // Change input type to text
            />
          </div>
        </div>
        <div className="col l3 s6 input-field">
          <div className="input-group prepend">
            <div className="input-group-text input-account-grp-setting">
              <span className="material-symbols-outlined register-person-icon input-account-icon">
                lock
              </span>
            </div>
            <input
              className="browser-default mobile"
              name="newPassword"
              placeholder="New Password"
              type="text" // Change input type to text
            />
          </div>
        </div>
        <div className="col l3 s6 input-field">
          <div className="input-group prepend">
            <div className="input-group-text input-account-grp-setting">
              <span className="material-symbols-outlined register-person-icon input-account-icon">
                lock
              </span>
            </div>
            <input
              className="browser-default mobile"
              name="confirmPassword"
              placeholder="Confirm Password"
              type="text" // Change input type to text
            />
          </div>
        </div>
        <div className="col l3 s6 input-field">
          <div className="input-group prepend">
            <div className="input-group-text input-account-grp-setting">
              <span className="material-symbols-outlined register-person-icon input-account-icon">
                password
              </span>
            </div>
            <input
              className="browser-default mobile"
              name="currentPassword"
              placeholder="Current Password"
              type="text" // Change input type to text
            />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="checkout-btns account-setting-update-details-btn">
          <div className="btn-checkout">
            <button className="btn">Update Details</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AccountSettingsTabContent;
