import YouTubeVideoContainer from "../YouTubeVideoContainer/YouTubeVideoContainer"; // Assuming you have a component for YouTube videos

const MoreItemsToConsider = ({ videoId, items }) => {
  return (
    <div className="col l8 m8 s12">
      <div className="card review-card-shop">
        <div className="card-content">
          <h5>More items to consider</h5>
          <div>
            <div className="col l6 m12 s12">
              <YouTubeVideoContainer videoId={videoId} />
            </div>
            <div className="row">
              {items.map((item, index) => (
                <div className="col l2 m4 s4" key={index}>
                  <div className="card card-search-bar card-mini">
                    <div className="card-content image-card-container">
                      <div className="col l10 s12">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="img-search-card"
                        />
                      </div>
                      <span className="img-title-card">{item.title}</span>
                      <span className="img-title-card">₹{item.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoreItemsToConsider;
