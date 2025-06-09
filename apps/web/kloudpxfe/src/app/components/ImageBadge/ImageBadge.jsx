const badgeStyle = {
  backgroundColor: "#ff5722",
  borderRadius: "10px",
  width: "80px",
  // padding: "5px 10px",
  fontSize: "12px",
  fontWeight: "800",
  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
  color: "#ffff",
};

function ImageBadge({ title }) {
  return (
    <div style={{ position: "absolute", top: "1rem", right: "1rem" }}>
      <span className="badge red" style={badgeStyle}>
        {title}
      </span>
    </div>
  );
}

export default ImageBadge;
