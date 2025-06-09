/* eslint-disable react/prop-types */

function CategoryMiniCard({ mainTitle, subTitle, imageUrl }) {
  return (
    <div className="col l12 m12 s12">
      <div className="category-6-mini-card">
        <div className="category-6-mini-card-content">
          <span className="category-6-mini-card-main-title">{mainTitle}</span>
          <span className="category-6-mini-card-sub-title">{subTitle}</span>
        </div>
        <img src={imageUrl} alt="" className="responsive-img category-6-img" />
      </div>
    </div>
  );
}

export default CategoryMiniCard;
