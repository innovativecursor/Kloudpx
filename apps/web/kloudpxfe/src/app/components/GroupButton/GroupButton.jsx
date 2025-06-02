const GroupButton = () => {
  return (
    <div className="col grp-btn-main-content">
      <div className="view-as-text">
        <span>View as : </span>
      </div>

      <div className="card-group-btn">
        <button className="group-button btn-primary">
          <span className="material-symbols-outlined grid_view_icn">
            grid_view
          </span>
        </button>
        <button className="group-button btn-primary">
          <span className="material-symbols-outlined grid_view_icn">
            table_rows
          </span>
        </button>
      </div>
    </div>
  );
};

export default GroupButton;
