import { useState } from "react";
import { AiOutlinePlus, AiOutlineClose } from "react-icons/ai";
import { addElement, isNewElement } from "../api";
import { getSpanishName } from "../utils/utils";
import PropTypes from "prop-types";
import ReactPortal from "./ReactPortal";
import Fade from "./Fade";
import "../css/addParam.css";

export default function AddParam({ name, children }) {
  const spanishName = getSpanishName(name);

  // State that controls visibility of modal to add new element
  const [showAddInput, setShowAddInput] = useState(false);

  // State with input text for adding new element
  const [element, setElement] = useState("");

  // State for the outcome of adding new element (text to display + boolean to track the operation's success)
  const [addElementMsg, setAddElementMsg] = useState({
    text: "",
    success: false,
  });

  // State for button status during an ongoing add operation
  const [addElementStatus, setAddElementStatus] = useState(false);

  // Handle input text in add element modal - for controlled component
  function handleInputChange(event) {
    setElement(event.target.value);
  }

  // Placeholder text for each add element input
  const placeholder = {
    models: "Añadir nombre del modelo",
    types: "Añadir nombre del tipo de producto",
    artisans: "Añadir nombre de la artesana",
    conditions: "Añadir nombre de la condición",
    states: "Añadir nombre del estado",
    colors: "Añadir nombre del color",
  };

  // Controls opening an closing of addElement modal
  function handleElementBox() {
    // When closing addElement modal, reset text and clean outcome message
    if (showAddInput) {
      setElement("");

      setTimeout(() => {
        setAddElementMsg({
          text: "",
          success: false,
        });
      }, 3000);
    }
    setShowAddInput((prevState) => !prevState);
  }

  // Handles adding new element
  async function handleAddElement(e) {
    e.preventDefault();
    setAddElementStatus(true);

    // Check if element is new or already in the collection
    const isNew = await isNewElement(name, element.toLowerCase());

    // If element is new, add to collection
    if (isNew) {
      await addElement(name, element.toLowerCase());
      setAddElementMsg({
        text: `${element} añadido`,
        success: true,
      });
    } else {
      setAddElementMsg((prevMsg) => ({
        ...prevMsg,
        text: `Elemento ya existente!`,
      }));
    }

    handleElementBox();
    setAddElementStatus(false);
  }

  return (
    <div className="addParam-container">
      <div className="addParam-firstRow">
        <div className="form-label">
          Seleccionar {spanishName[0].toUpperCase() + spanishName.slice(1)}
        </div>
        {addElementMsg.text && (
          <span
            className={`addParam-addElement-msg ${
              !addElementMsg.success ? "addParam-addElement-msg-error" : ""
            }`}
          >
            {addElementMsg.text}
          </span>
        )}
        {!showAddInput && (
          <div
            className="addParam-addElement-openBoxBtn"
            onClick={handleElementBox}
          >
            Nuevo <AiOutlinePlus />{" "}
          </div>
        )}
      </div>
      <ReactPortal wrapperElementId="react-portal-container">
        <Fade show={showAddInput}>
          <div className="addParam-addElement-modal">
            <div className="addParam-addElement-box">
              <input
                className="addParam-addElement-input"
                type="text"
                placeholder={placeholder[name]}
                onChange={handleInputChange}
                value={element}
                onBlur={() => setElement((prevElement) => prevElement.trim())}
              />
              <button
                onClick={handleAddElement}
                className="addParam-addElement-addBtn"
                disabled={element.length === 0}
              >
                {addElementStatus ? "Añadiendo..." : "Añadir"}
                {!addElementStatus && <AiOutlinePlus />}
              </button>
              {!addElementStatus && (
                <AiOutlineClose
                  className="addParam-addElement-close"
                  onClick={handleElementBox}
                />
              )}
            </div>
          </div>
        </Fade>
      </ReactPortal>
      {children}
    </div>
  );
}

AddParam.propTypes = {
  children: PropTypes.node,
  name: PropTypes.string,
};
