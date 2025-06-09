import { useState } from "react";
import ModalReviews from "../ModalReviews/ModalReviews";
import Link from "next/link";

function DynamicTabs({ items }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalReviews, setModalReviews] = useState([]);

  const handleTabClick = (index) => {
    setActiveIndex(index);
  };

  const handleViewMoreReviews = (reviews) => {
    setModalReviews(reviews);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <ul className="tabs col">
        {items.map((item, index) => (
          <li
            className={`tab col s${Math.floor(12 / items.length)}`}
            key={index}
          >
            <Link
              href={`#test-swipe-${index + 1}`}
              className={activeIndex === index ? "active" : ""}
              onClick={() => handleTabClick(index)}
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
      {items.map((item, index) => (
        <div
          key={index}
          id={`test-swipe-${index + 1}`}
          className={`col s12 ${activeIndex === index ? "active" : ""}`}
          style={{ padding: "10px" }}
        >
          {item.content}

          {item.active && (
            <p>
              <span
                style={{ cursor: "pointer", color: "#1919d0ab" }}
                onClick={() => handleViewMoreReviews(item.reviews)}
              >
                View more reviews
              </span>
            </p>
          )}
          <ModalReviews
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            reviews={modalReviews}
          />
        </div>
      ))}
    </div>
  );
}

export default DynamicTabs;
