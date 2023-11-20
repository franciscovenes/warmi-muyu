import { useState, useContext } from "react";
import "../css/tagsInput.css";
import PropTypes from "prop-types";
import { AiOutlineClose } from "react-icons/ai";
import { getSpanishName } from "../utils/utils";
import { AuthRequiredContext } from "./AuthRequired";

export default function TagsInput({
  retrieve = false,
  edit = false,
  name,
  tags,
  setFunc,
}) {
  // Retrieves elements lists from authenticaton component
  const { lists } = useContext(AuthRequiredContext);

  // State with text for controlled input
  const [inputText, setInputText] = useState("");

  // State with matched options to be displayed while typing input, according to info from the lists
  const [options, setOptions] = useState({
    name: "",
    elements: [],
  });

  // Handles input, finding matches and storing them in the options state
  function handleTagInput(event) {
    const { name, value } = event.target;
    let matches = [];

    if (value.length && Object.keys(lists).includes(name)) {
      matches = lists[`${name}`].filter((el) => {
        const regex = new RegExp(value, "gi");
        return el.match(regex);
      });
    }

    if (matches.length) {
      setOptions({
        name: name,
        elements: matches,
      });
    } else {
      setOptions({ name: "", elements: [] });
    }
  }

  // Handles adding clicked option to the corresponding data params states (data in Add.jsx, searchData in Retrieve.jsx or internalData in Item.jsx)
  function handleClickOptions(option, setFunc, tags) {
    if (tags.includes(option)) return;

    setFunc((prevState) => {
      return {
        ...prevState,
        [options.name]: [...prevState[options.name], option],
      };
    });
    setOptions({});
  }

  // Closes options box when clicked outside of it
  function handleBlur() {
    setTimeout(() => {
      setOptions({});
    }, 200);
  }

  // Removes clicked tag from the corresponding data params states (data in Add.jsx, searchData in Retrieve.jsx or internalData in Item.jsx)
  function removeTag(name, index, setFunc) {
    setFunc((prevState) => {
      return {
        ...prevState,
        [name]: prevState[name].filter((tag, i) => i !== index),
      };
    });
  }

  function handleInputChange(event) {
    const value = event.target.value;
    setInputText(value);
  }

  function clearText() {
    setInputText("");
  }

  return (
    <div className="tagsInput-container">
      <div className={`tagsInput-tags ${edit ? "tagsInput-tags-edit" : ""}`}>
        {/* Display tags */}
        {tags &&
          tags.map((tag, i) => (
            <div className="tagsInput-tag" key={i}>
              <span className="tagsInput-tag-name">{tag}</span>
              <AiOutlineClose
                className="tagsInput-tag-remove"
                onClick={() => removeTag(name, i, setFunc)}
              />
            </div>
          ))}

        {/* Limit insertion to 1 tag by hiding the input. No limit in the retrieve page and for color tags anywhere*/}
        {(tags.length < 1 || name === "colors" || retrieve) && (
          <input
            className={`tagsInput-input ${edit ? "tagsInput-input-edit" : ""}`}
            type="text"
            placeholder={`Añadir ${getSpanishName(name)}`}
            onChange={(event) => {
              handleInputChange(event);
              handleTagInput(event);
            }}
            name={name}
            value={inputText}
            onBlur={handleBlur}
            autoComplete="off"
          />
        )}
      </div>
      {/* Display options box/menu when typing the input */}
      <div className="tagsInput-options-container">
        {options.name?.length > 0 && (
          <ul className="tagsInput-options">
            {options.name === name &&
              options.elements.map((option, i) => {
                return (
                  <li
                    className="tagsInput-option"
                    key={i}
                    onClick={() => {
                      clearText();
                      handleClickOptions(option, setFunc, tags);
                    }}
                  >
                    {option}
                  </li>
                );
              })}
          </ul>
        )}
      </div>
    </div>
  );
}

TagsInput.propTypes = {
  name: PropTypes.string,
  tags: PropTypes.array,
  setFunc: PropTypes.func,
  edit: PropTypes.bool,
  retrieve: PropTypes.bool,
};
