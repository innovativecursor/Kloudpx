const MoreOptions = ({ items }) => {
  return (
    <div className="col l4 m12 s12">
      <div className="card review-card-shop">
        <div className="card-content">
          <h5>Featured Brands</h5>
          <div className="row">
            {/* Map over the items array to generate item cards */}
            {items.map((item, index) => (
              <div className="col l6 m3 s6" key={index}>
                <div className="card card-search-bar card-mini card-mini-more-options">
                  <div className="card-content image-card-container">
                    <div className="col l12 s12">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="img-search-card"
                      />
                    </div>
                    <div style={{ marginLeft: "1rem" }}>
                      <span className="img-title-card">{item.title}</span>
                      {/* <span className="img-title-card">₹{item.price}</span> */}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoreOptions;
