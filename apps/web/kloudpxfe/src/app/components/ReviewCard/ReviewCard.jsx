import React from "react";
import ShowRating from "../ShowRating/ShowRating"; // Assuming you have a component named ShowRating

const ReviewCard = ({ items }) => {
  return (
    <div className="col l3 m6 s12">
      <div className="card review-card-shop">
        <div className="card-content">
          <>
            {items.map((item, index) => (
              <div key={index}>
                <h5>Review your purchase</h5>
                <img src={item} alt="" />
                <div>
                  <ShowRating />
                </div>
                <p className="see-more-text">See more...</p>
              </div>
            ))}
          </>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
