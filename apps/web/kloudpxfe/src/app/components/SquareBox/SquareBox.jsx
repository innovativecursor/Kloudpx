import "./SquareBox.css";

const SquareBox = ({ color }) => {
  return (
    <div className="square">
      <div className={`color ${color}`}></div>
    </div>
  );
};

export default SquareBox;
