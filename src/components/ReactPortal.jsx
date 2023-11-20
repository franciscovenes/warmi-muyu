import { createPortal } from "react-dom";
import PropTypes from "prop-types";
import { useState, useLayoutEffect } from "react";

export default function ReactPortal({ children, wrapperElementId }) {
  const [wrapperElement, setWrapperElement] = useState(null);

  // Create new DOM Element outside the normal flow
  useLayoutEffect(() => {
    let element = document.getElementById(wrapperElementId);
    let systemCreated = false;
    if (!element) {
      systemCreated = true;
      element = document.createElement("div");
      element.setAttribute("id", wrapperElementId);
      document.body.appendChild(element);
    }
    setWrapperElement(element);

    return () => {
      if (systemCreated && element.parentNode) {
        element.parentNode.removeChild(element);
      }
    };
  }, [wrapperElementId]);

  if (wrapperElement === null) return null;

  // Create portal: children maintains parent-child relationships in the component, but is placed outside the normal flow
  return createPortal(children, wrapperElement);
}

ReactPortal.propTypes = {
  children: PropTypes.node,
  wrapperElementId: PropTypes.string,
};
