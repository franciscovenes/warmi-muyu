import { FaRegPlusSquare, FaRegWindowClose } from "react-icons/fa";
import Fade from "./Fade";
import "../css/searchParam.css";
import PropTypes from "prop-types";
import { getSpanishName } from "../utils/utils";

export default function SearchParam({
  paramStatus,
  handleShowParam,
  name,
  children,
}) {
  return (
    <div className="searchParam-container">
      {/* Displays open/close buttons and label */}
      <div className="form-label searchParam-label">
        {!paramStatus ? (
          <FaRegPlusSquare
            onClick={() => handleShowParam(name, true)}
            className="searchParam-btn"
          />
        ) : (
          <FaRegWindowClose
            onClick={() => handleShowParam(name, false)}
            className="searchParam-btn"
          />
        )}
        Seleccionar{" "}
        {getSpanishName(name, true)[0].toUpperCase() +
          getSpanishName(name, true).slice(1)}
      </div>
      {/* Displays children component */}
      <Fade show={paramStatus}>{children}</Fade>
    </div>
  );
}

SearchParam.propTypes = {
  paramStatus: PropTypes.bool,
  handleShowParam: PropTypes.func,
  name: PropTypes.string,
  children: PropTypes.node,
};
