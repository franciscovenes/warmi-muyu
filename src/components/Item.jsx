import PropTypes from "prop-types";
import "../css/item.css";
import { AiOutlineClose } from "react-icons/ai";
import { FaRegImage } from "react-icons/fa";
import { MdModeEdit } from "react-icons/md";
import { useState, useEffect } from "react";
import TagsInput from "./TagsInput";
import { removeItem, updateItem } from "../api";
import {
  handleInputChange,
  trimInputsOnBlur,
  getEmptyFields,
} from "../utils/utils";

export default function Item({ data, docRef }) {
  // State to keep track of item's data while editing
  const [internalData, setInternalData] = useState({ ...data });

  // State that keeps record of empty fields while editing the item
  const [emptyFields, setEmptyFields] = useState([]);

  // State that signals if the item is being edited
  const [edit, setEdit] = useState(false);

  // State that signals if each editable field in the item is being edited
  const [editField, setEditField] = useState({
    models: false,
    types: false,
    artisans: false,
    dimensions: false,
    colors: false,
    matPrice: false,
    hours: false,
    price: false,
    conditions: false,
    states: false,
    location: false,
    observations: false,
  });

  // State that signals if the item is being updated
  const [updateStatus, setUpdateStatus] = useState(false);

  // Updates the emptyFields state based upon changes on the item's internal data
  useEffect(() => {
    getEmptyFields(setEmptyFields, internalData);
  }, [internalData]);

  // Handles the editField state according to the field's name
  function handleEditField(name) {
    setEditField((prevEditField) => ({
      ...prevEditField,
      [name]: !prevEditField[name],
    }));
  }

  // Handles clicking the edit button, enabling and disabling editing .
  function handleEditItem() {
    if (edit) {
      setEditField({
        models: false,
        artisans: false,
        dimensions: false,
        colors: false,
        matPrice: false,
        hours: false,
        price: false,
        conditions: false,
        states: false,
        location: false,
        observations: false,
      });

      setEmptyFields([]);
    }

    setEdit((prevEdit) => !prevEdit);
  }

  // Resets the item internal data
  function resetInternalData() {
    if (edit) setInternalData({ ...data });
  }

  // Updates the item
  async function handleUpdateItem() {
    setUpdateStatus(true);

    // Creates object with data to be updated by comparing the item's internal data with the data originally received from its parent.
    const updateData = Object.entries(internalData)
      .filter((entry) => {
        return entry[1] !== data[entry[0]];
      })
      .map((entry) => {
        if (
          ["types", "models", "artisans", "conditions", "states"].includes(
            entry[0]
          )
        ) {
          return [`${entry[0].slice(0, -1)}`, entry[1][0].toLowerCase()];
        } else if (entry[0] === "colors") {
          return [entry[0], entry[1].map((el) => el.toLowerCase())];
        } else {
          return entry;
        }
      })
      .reduce((obj, entry) => {
        return Object.assign(obj, { [entry[0]]: entry[1] });
      }, {});

    // Update item with new data
    await updateItem(docRef, updateData);
    setUpdateStatus(false);
    handleEditItem();
  }

  return (
    <div className="item-container">
      {/* The item is divided into two areas: the first has a list of fields, the second has the model and type fields, the image, warnings, and control buttons*/}
      <div className="item-firstColumn">
        <ul className="item-list">
          {/* Each field will display differently,  depending on its update status*/}
          {/* Artisan field */}
          <li className="item-field-edit-row">
            {editField.artisans ? (
              <TagsInput
                name="artisans"
                tags={internalData.artisans}
                setFunc={setInternalData}
                edit
              />
            ) : (
              <h4 className="item-title">{internalData.artisans[0]}</h4>
            )}
            {/* Display the edit field button if item edit is enabled */}
            {edit && <MdModeEdit onClick={() => handleEditField("artisans")} />}
          </li>

          {/* Length and width fields */}
          <li>
            <h4 className="item-label">Dimensiones:</h4>
            <div className="item-field-edit-row item-field-edit-wrap">
              {editField.dimensions ? (
                <div className="item-edit-dimensions">
                  <label>L (cm): </label>
                  <input
                    type="text"
                    value={internalData.length}
                    onChange={(e) => handleInputChange(e, setInternalData)}
                    name="length"
                    className="item-edit-input"
                  />
                  <label>A (cm): </label>
                  <input
                    type="text"
                    value={internalData.width}
                    onChange={(e) => handleInputChange(e, setInternalData)}
                    name="width"
                    className="item-edit-input"
                  />
                </div>
              ) : (
                <span>
                  L: {internalData.length} cm x A: {internalData.width} cm
                </span>
              )}
              {edit && (
                <MdModeEdit onClick={() => handleEditField("dimensions")} />
              )}
            </div>
          </li>

          {/* Price of materials field */}
          <li>
            <h4 className="item-label">Costo de los materiales:</h4>
            <div className="item-field-edit-row ">
              {editField.matPrice ? (
                <input
                  type="text"
                  value={internalData.matPrice}
                  onChange={(e) => handleInputChange(e, setInternalData)}
                  name="matPrice"
                  className="item-edit-input"
                />
              ) : (
                <span>$ {internalData.matPrice} </span>
              )}
              {edit && (
                <MdModeEdit onClick={() => handleEditField("matPrice")} />
              )}
            </div>
          </li>

          {/* Hours field */}
          <li>
            <h4 className="item-label">Horas de trabajo: </h4>
            <div className="item-field-edit-row">
              {editField.hours ? (
                <input
                  type="text"
                  value={internalData.hours}
                  onChange={(e) => handleInputChange(e, setInternalData)}
                  name="hours"
                  className="item-edit-input"
                />
              ) : (
                <span>$ {internalData.hours} </span>
              )}
              {edit && <MdModeEdit onClick={() => handleEditField("hours")} />}
            </div>
          </li>

          {/* Price field */}
          <li>
            <h4 className="item-label">Precio de venta: </h4>
            <div className="item-field-edit-row">
              {editField.price ? (
                <input
                  type="text"
                  value={internalData.price}
                  onChange={(e) => handleInputChange(e, setInternalData)}
                  name="price"
                  className="item-edit-input"
                />
              ) : (
                <span>$ {internalData.price} </span>
              )}
              {edit && <MdModeEdit onClick={() => handleEditField("price")} />}
            </div>
          </li>

          {/* Colors field */}
          <li>
            <h4 className="item-label">Colores:</h4>
            <div className="item-field-edit-row">
              {editField.colors ? (
                <TagsInput
                  name="colors"
                  tags={internalData.colors}
                  setFunc={setInternalData}
                  edit
                />
              ) : (
                <span>{internalData.colors.join(", ")}</span>
              )}
              {edit && <MdModeEdit onClick={() => handleEditField("colors")} />}
            </div>
          </li>

          {/* Condition field */}
          <li>
            <h4 className="item-label">Condición:</h4>
            <div className="item-field-edit-row">
              {editField.conditions ? (
                <TagsInput
                  name="conditions"
                  tags={internalData.conditions}
                  setFunc={setInternalData}
                  edit
                />
              ) : (
                <span>{internalData.conditions[0]}</span>
              )}
              {edit && (
                <MdModeEdit onClick={() => handleEditField("conditions")} />
              )}
            </div>
          </li>

          {/* State field */}
          <li>
            <h4 className="item-label">Estado:</h4>
            <div className="item-field-edit-row">
              {editField.states ? (
                <TagsInput
                  name="states"
                  tags={internalData.states}
                  setFunc={setInternalData}
                  edit
                />
              ) : (
                <span>{internalData.states[0]}</span>
              )}
              {edit && <MdModeEdit onClick={() => handleEditField("states")} />}
            </div>
          </li>

          {/* Location field */}
          <li>
            <h4 className="item-label">Ubicación:</h4>
            <div className="item-field-edit-row">
              {editField.location ? (
                <input
                  type="text"
                  value={internalData.location}
                  onChange={(e) => handleInputChange(e, setInternalData)}
                  name="location"
                  className="item-edit-input"
                  onBlur={(e) => trimInputsOnBlur(e, setInternalData)}
                />
              ) : (
                <span>{internalData.location} </span>
              )}
              {edit && (
                <MdModeEdit onClick={() => handleEditField("location")} />
              )}
            </div>
          </li>

          {/* Observations field */}
          <li>
            <h4 className="item-label">Observaciones:</h4>
            <div className="item-field-edit-row">
              {editField.observations ? (
                <input
                  type="text"
                  value={internalData.observations}
                  onChange={(e) => handleInputChange(e, setInternalData)}
                  name="observations"
                  className="item-edit-input"
                  onBlur={(e) => trimInputsOnBlur(e, setInternalData)}
                />
              ) : (
                <span>{internalData.observations} </span>
              )}
              {edit && (
                <MdModeEdit onClick={() => handleEditField("observations")} />
              )}
            </div>
          </li>
        </ul>
      </div>

      <div className="item-secondColumn">
        <div
          className={`item-secondColumn-model ${
            editField.models || editField.types
              ? "item-secondColumn-model-edit"
              : ""
          }`}
        >
          {/* Model field */}
          <div className="item-secondColumn-model-editField">
            {editField.models ? (
              <TagsInput
                name="models"
                tags={internalData.models}
                setFunc={setInternalData}
                edit
              />
            ) : (
              <h4 className="item-title">{internalData.models[0]}</h4>
            )}
            {edit && <MdModeEdit onClick={() => handleEditField("models")} />}
          </div>
          {/* Type field */}
          <div className="item-secondColumn-model-editField">
            {editField.types ? (
              <TagsInput
                name="types"
                tags={internalData.types}
                setFunc={setInternalData}
                edit
              />
            ) : (
              <h4 className="item-title">{`(${internalData.types[0]})`}</h4>
            )}
            {edit && <MdModeEdit onClick={() => handleEditField("types")} />}
          </div>
        </div>

        {/* Image display - not editable */}
        {data.imageURL ? (
          <img
            className="item-image"
            src={data.imageURL}
            alt="Imagen del producto"
          />
        ) : (
          <FaRegImage className="item-noimage" />
        )}

        {/* Display warning: empty fields*/}
        {emptyFields.length > 0 && (
          <div className="item-error-message">
            <p>Los siguientes campos están vacíos: </p>
            <ul>
              {emptyFields.map((field, i) => (
                <li key={i}>{field}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Display warning: no need for update */}
        {edit && JSON.stringify(internalData) === JSON.stringify(data) && (
          <p className="item-error-message">No hay campos por actualizar</p>
        )}

        {/* Edit and update control buttons */}
        <div className="item-control">
          {edit && (
            <button
              className="btn item-update"
              onClick={handleUpdateItem}
              disabled={
                JSON.stringify(internalData) === JSON.stringify(data) ||
                emptyFields.length
              }
            >
              {updateStatus ? "Actualizando..." : "Actualizar"}
            </button>
          )}

          <button
            className="btn"
            onClick={() => {
              handleEditItem();
              resetInternalData();
            }}
          >
            {edit ? "Cerrar" : "Editar"}
          </button>

          <button
            className="btn"
            onClick={async () => await removeItem(docRef, data.imageURL)}
          >
            Delete <AiOutlineClose />
          </button>
        </div>
      </div>
    </div>
  );
}

Item.propTypes = {
  data: PropTypes.object,
  docRef: PropTypes.object,
};
