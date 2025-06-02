import Link from "next/link";

const CategoryCards = ({ title, image, link }) => {
  return (
    <div className="category_widget">
      <div className="card">
        <div className="image_wrapper">
          <Link className="card-image" href={link}>
            <img src={image} alt="" className="responsive-img" />
          </Link>
        </div>
        <div className="card-action">
          <div className="truncate center">
            <Link href={link}>{title}</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryCards;
