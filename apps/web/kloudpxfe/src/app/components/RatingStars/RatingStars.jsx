function RatingStars({ rating }) {
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <i
          key={i}
          className={`material-icons ${
            i <= rating ? "star-filled" : "star-empty"
          }`}
        >
          star
        </i>
      );
    }
    return stars;
  };

  return <div className="rating-stars">{renderStars()}</div>;
}

export default RatingStars;
