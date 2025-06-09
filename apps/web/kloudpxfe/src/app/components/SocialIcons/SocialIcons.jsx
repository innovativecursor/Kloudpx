import { useEffect } from "react";
import M from "materialize-css";
import { FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { MdFacebook, MdPrint } from "react-icons/md";

const SocialIcons = () => {
  useEffect(() => {
    // Initialize tooltips when component mounts
    const tooltips = document.querySelectorAll(".tooltipped");
    M.Tooltip.init(tooltips, {});
  }, []);

  return (
    <div className="row">
      <div className="col l4 social-icons-product-desc">
        <span
          className="tooltipped"
          data-position="left"
          data-tooltip="Facebook"
        >
          <MdFacebook size="20px" style={{ color: "#0866ff" }} />
        </span>
        {/* <span className="tooltipped" data-position="bottom" data-tooltip="Mail">
          <i className="mdi mdi-email" style={{ color: "#5e7ec1" }} />
        </span> */}
        <span className="tooltipped" data-position="top" data-tooltip="Print">
          <MdPrint size="20px" style={{ color: "#5e7ec1" }} />
        </span>
        <span
          className="tooltipped"
          data-position="bottom"
          data-tooltip="Twitter"
        >
          <FaXTwitter size="20px" style={{ color: "#66b4f0" }} />
        </span>
        <span
          className="tooltipped"
          data-position="right"
          data-tooltip="LinkedIn"
        >
          {/* <i className="mdi mdi-linkedin" style={{ color: "#868686" }} /> */}
          <FaLinkedin size="20px" style={{ color: "#868686" }} />
        </span>
      </div>
    </div>
  );
};

export default SocialIcons;
