"use client";
import Link from "next/link";
import { useState } from "react";
import { MdStar, MdStarBorder, MdStarHalf } from "react-icons/md"; // Import star icons from Material Icons

function ShowRating() {
  const [rating, setRating] = useState(4.5); // Initial rating value

  // Function to handle clicking on a star
  const handleStarClick = (clickedRating) => {
    if (rating === clickedRating) {
      // If the same star is clicked, set the rating to half
      setRating(clickedRating - 0.5);
    } else {
      setRating(clickedRating);
    }
  };

  // Function to generate stars based on rating
  const renderStars = () => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(
          <MdStar
            key={i}
            className="star"
            onClick={() => handleStarClick(i)}
            fontSize="25px"
            color="#ffdf00"
          />
        );
      } else if (i - 0.5 === rating) {
        stars.push(
          <MdStarHalf
            key={i}
            className="star"
            onClick={() => handleStarClick(i)}
            fontSize="25px"
            color="#ffdf00"
          />
        );
      } else {
        stars.push(
          <MdStarBorder
            key={i}
            className="star"
            onClick={() => handleStarClick(i)}
            fontSize="25px"
            color="#ffdf00"
          />
        );
      }
    }

    return stars;
  };

  return (
    <div className="flex">
      <div className="show_rating" data-rate-value={rating}>
        {renderStars()}
      </div>
      <div className="color-primary mg-l-10">{`${rating} Reviews`}</div>
    </div>
  );
}

export default ShowRating;
