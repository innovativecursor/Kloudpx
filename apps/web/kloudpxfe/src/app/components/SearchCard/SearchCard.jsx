/* eslint-disable react/prop-types */
const SearchCard = ({ image, title }) => {
  return (
    <div className="col l4 m4 s4">
      <div className="card card-search-bar">
        <div className="card-content image-card-container">
          <img src={image} alt="" className="img-search-card" />
          <span className="img-title-card">{title}</span>
        </div>
      </div>
    </div>
  );
};

export default SearchCard;
