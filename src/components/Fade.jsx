import { useState, useEffect } from "react";
import "../css/fade.css";
import PropTypes from "prop-types";

export default function Fade({ show, children }) {
  // Stat determining the rendering of the component's child. It separates two logics: rendering and fading effect.
  const [renderChild, setRenderChild] = useState(show);

  useEffect(() => {
    if (show) setRenderChild(true);
  }, [show]);

  function onAnimationEnd() {
    if (!show) setRenderChild(false);
  }
  return (
    renderChild && (
      <div
        className={`${show ? "fadeIn" : "fadeOut"} fade-container`}
        onAnimationEnd={onAnimationEnd}
      >
        {children}
      </div>
    )
  );
}

Fade.propTypes = {
  children: PropTypes.node,
  show: PropTypes.bool,
};
