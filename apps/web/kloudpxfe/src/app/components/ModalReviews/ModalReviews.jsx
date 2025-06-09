import { useEffect, useRef } from "react";
import M from "materialize-css";
import ShowRating from "../ShowRating/ShowRating";
import logo from "@/assets/quiksie-logo.svg";

function ModalReviews({ id, isOpen, onClose, reviews = [] }) {
  const modalRef = useRef(null);
  const modalInstance = useRef(null);

  useEffect(() => {
    // Initialize modal after component has mounted
    const modal = modalRef.current;
    modalInstance.current = M.Modal.init(modal, {
      onCloseEnd: onClose, // Call onClose function when the modal is closed

      onOpenStart: function () {
        this.$el.css({
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        });
      },
    });

    if (isOpen) {
      modalInstance.current.open();
    }

    modalInstance.current.el.appendChild(modal.querySelector(".modal-content"));
  }, [isOpen, onClose]);

  const handleCloseModal = () => {
    modalInstance.current.close();
  };

  return (
    <div ref={modalRef} id={id} className="modal modal-reviews">
      <div className="modal-content">
        {reviews.map((review, index) => (
          <div key={index}>
            <div className="col l6">
              <div className="col s12" style={{ display: "flex", gap: "10px" }}>
                <img
                  className="user-circle"
                  src="https://ps.w.org/user-avatar-reloaded/assets/icon-256x256.png?rev=2540745"
                  alt="Image"
                />

                <div
                  style={{
                    display: "grid",
                    textAlign: "left",
                    marginBottom: "1rem",
                  }}
                >
                  <span style={{ marginBottom: "0.5rem" }}>
                    {review.author}
                  </span>
                  <span>Reviewed in India on {review.date}</span>
                  <div
                    style={{
                      display: "flex",
                      marginTop: "1rem",
                      marginBottom: "1rem",
                      marginLeft: "-0.6rem",
                    }}
                    className="col l12 s12"
                  >
                    <p
                      style={{
                        fontSize: "13px",
                        fontWeight: "500",
                        color: "#d88f57",
                        margin: "0px",
                        cursor: "pointer",
                      }}
                    >
                      {review.viewPurchased}
                    </p>
                  </div>
                  <ShowRating />
                  <p style={{ marginBottom: "0.6rem" }}>{review.comment}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="modal-footer modal-customer-footer">
        <div className="img-modal">
          <img src={logo} alt="" />
        </div>

        <div className="col l12 s12 logo-customer-reviews">
          <h5>Customer Reviews</h5>
          <button
            className="modal-close close-btn-modal"
            onClick={handleCloseModal}
          >
            <span className="material-symbols-outlined">cancel</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalReviews;
