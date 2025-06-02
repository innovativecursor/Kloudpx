import "./MessagesTabContent.css";

const MessagesTabContent = () => {
  return (
    <div className="row">
      <div className="col l9 alert-box">
        <div className="alertBox alertBox--info">
          <div className="alertBox-column alertBox-icon">
            <span className="material-symbols-outlined info-message-icon">
              info
            </span>
          </div>
          <p className="alertBox-column alertBox-message">
            <span>{`Once you place an order you'll have full access to send messages from this page.`}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default MessagesTabContent;
