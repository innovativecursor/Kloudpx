/* eslint-disable react/prop-types */
const SearchListItem = ({ item, onRemove }) => {
  return (
    <div className="search-child-item">
      <div className="search-bar-icons-n-text">
        <div className="history-icon-search-bar">
          <span className="material-symbols-outlined history-icon">
            history
          </span>
        </div>
        <div>
          <span className="searched-item">{item}</span>
        </div>
      </div>
      <span className="remove-item" onClick={() => onRemove(item)}>
        Remove
      </span>
    </div>
  );
};

export default SearchListItem;
