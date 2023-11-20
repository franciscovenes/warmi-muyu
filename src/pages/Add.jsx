import { useContext, useEffect, useState, useRef, lazy, Suspense } from "react";
import { AuthenticationContext } from "../components/Authentication";
import TagsInput from "../components/TagsInput";
import AddParam from "../components/AddParam";
import { addNewItem, uploadFile, addNewDocRef, monitorItem } from "../api";
import "../css/add.css";
import {
  handleInputChange,
  trimInputsOnBlur,
  getEmptyFields,
} from "../utils/utils";

const Item = lazy(() => {
  return import("../components/Item");
});

export default function Add() {
  const { currentUser } = useContext(AuthenticationContext);

  // State with data to be added to new item
  const [data, setData] = useState({
    models: [],
    types: [],
    artisans: [],
    length: "",
    width: "",
    colors: [],
    matPrice: "",
    hours: "",
    price: "",
    conditions: [],
    states: [],
    location: "",
    observations: "",
  });

  // State with image to be added to new item (if uploaded)
  const [addImage, setAddImage] = useState(null);

  // State with message to be displayed for image upload
  const [imgUploadMessage, setImgUploadMessage] = useState({
    message: "Formatos soportados: .jpg/jpeg o .png",
    type: true,
  });

  // State to store the item just added to database.
  const [item, setItem] = useState({});

  // State to control if the item is being added
  const [loadItem, setLoadItem] = useState(false);

  // Creates a reference of the item do be added (stores its reference in the database)
  const newDocRef = useRef(addNewDocRef());

  // Creates a listener to changes in the referenced doc. If it changes (when it is added to the database), add its data to the item state
  useEffect(() => {
    const unsubscribe = monitorItem(newDocRef.current, setItem);
    return () => {
      unsubscribe();
    };
  }, []);

  // State controlling empty fields in the form
  const [emptyFields, setEmptyFields] = useState([]);

  // Handles image upload, reducing its size to a max width or height of 300px
  function handleFileUpload(e) {
    // store uploaded image in variable
    const uploadedImage = e.target.files[0];

    if (
      uploadedImage &&
      (uploadedImage.type === "image/jpeg" ||
        uploadedImage.type === "image/png")
    ) {
      // if the image format is correct, open reader for editing
      let reader = new FileReader();

      reader.onload = (event) => {
        // create new image
        const img = new Image();
        img.onload = () => {
          // sets new height and width
          const MAX_WIDTH = 300;
          const MAX_HEIGHT = 300;

          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height = height * (MAX_WIDTH / width);
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = width * (MAX_HEIGHT / height);
              height = MAX_HEIGHT;
            }
          }

          // resizes image and saves in new file
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          ctx.canvas.toBlob((blob) => {
            const file = new File([blob], "uploaded-image", {
              type: "image/jpeg",
              lastModified: Date.now(),
            });

            // if the file is created, add to AddImage state. Display error message otherwise
            if (file) {
              setAddImage(file);
              setImgUploadMessage({
                message: "Imagen cargada",
                type: true,
              });
            } else {
              setImgUploadMessage({
                message: "Error al cargar imagen. Inténtalo nuevamente!",
                type: false,
              });
            }
          });
        };

        // set image source
        img.src = event.target.result;
      };

      // after defining all the rules for edition, perform editing on uploadedImage
      reader.readAsDataURL(uploadedImage);
    } else {
      setImgUploadMessage({
        message:
          "Formato de imagen no soportado. Formatos soportados: .jpg/jpeg o .png",
        type: false,
      });
    }
  }

  async function addItem(event) {
    setLoadItem(true);
    event.preventDefault();
    // Check if required fields aren't empty
    if (!getEmptyFields(setEmptyFields, data).length) {
      // Add image file to firestore storage (name equals newDocRef id). Store image URL
      const downloadURL = addImage
        ? await uploadFile(addImage, addImage.type, newDocRef.current.id)
        : false;

      // Data to send to the items collection as a doc (firebase)
      const docData = {
        model: data.models[0].toLowerCase(),
        type: data.types[0].toLowerCase(),
        artisan: data.artisans[0].toLowerCase(),
        length: data.length,
        width: data.width,
        matPrice: data.matPrice,
        hours: data.hours,
        price: data.price,
        condition: data.conditions[0].toLowerCase(),
        state: data.states[0].toLowerCase(),
        location: data.location,
        observations: data.observations,
        inputUser: currentUser.displayName,
        imageURL: downloadURL,
        colors: data.colors.map((color) => color.toLowerCase()),
      };

      // Add data to firestore database by setting it to newDocRef
      await addNewItem(newDocRef.current, docData);

      // clean data
      setData({
        models: [],
        types: [],
        artisans: [],
        length: "",
        width: "",
        colors: [],
        matPrice: "",
        hours: "",
        price: "",
        conditions: [],
        states: [],
        location: "",
        observations: "",
      });

      // clean image
      setAddImage(null);

      // reset image upload message
      setImgUploadMessage({
        message: "Formatos soportados: .jpg/jpeg o .png",
        type: true,
      });
    }
    setLoadItem(false);
  }

  return (
    <div className="add-container">
      <form className="form" name="add-form">
        <div className="add-form-first">
          {/* Model */}
          <AddParam name="models">
            <TagsInput name="models" tags={data.models} setFunc={setData} />
          </AddParam>

          {/* Type */}
          <AddParam name="types">
            <TagsInput name="types" tags={data.types} setFunc={setData} />
          </AddParam>

          {/* Artisan */}
          <AddParam name="artisans">
            <TagsInput name="artisans" tags={data.artisans} setFunc={setData} />
          </AddParam>

          {/* Product condition */}
          <AddParam name="conditions">
            <TagsInput
              name="conditions"
              tags={data.conditions}
              setFunc={setData}
            />
          </AddParam>

          {/* Product State */}
          <AddParam name="states">
            <TagsInput name="states" tags={data.states} setFunc={setData} />
          </AddParam>

          {/* Product colors */}
          <AddParam name="colors">
            <TagsInput name="colors" tags={data.colors} setFunc={setData} />
          </AddParam>

          {/* Location */}
          <label htmlFor="add-location" className="form-label">
            Ubicación:
          </label>
          <input
            id="add-location"
            className="form-input"
            type="text"
            placeholder="Añadir ubicación del producto (opcional)"
            onChange={(e) => handleInputChange(e, setData)}
            name="location"
            value={data.location}
            onBlur={(e) => trimInputsOnBlur(e, setData)}
          />

          {/* Observations */}
          <label className="form-label" htmlFor="add-observations">
            Observaciones:
          </label>
          <input
            id="add-observations"
            className="form-input"
            type="text"
            placeholder="Añadir observaciones (opcional)"
            onChange={(e) => handleInputChange(e, setData)}
            name="observations"
            value={data.observations}
            onBlur={(e) => trimInputsOnBlur(e, setData)}
          />
        </div>

        <div className="add-form-second">
          {/* Length */}
          <label htmlFor="add-length" className="form-label">
            Largo (cm):
          </label>
          <input
            id="add-length"
            className="form-input"
            type="text"
            placeholder="Añadir largo (cm)"
            onChange={(e) => handleInputChange(e, setData)}
            name="length"
            value={data.length}
          />

          {/* Width */}
          <label htmlFor="add-width" className="form-label">
            Ancho (cm):
          </label>
          <input
            id="add-width"
            className="form-input"
            type="text"
            placeholder="Añadir ancho (cm)"
            onChange={(e) => handleInputChange(e, setData)}
            name="width"
            value={data.width}
          />

          {/* Mat Price */}
          <label htmlFor="add-matPrice" className="form-label">
            Precio materiales:
          </label>
          <input
            id="add-matPrice"
            className="form-input"
            type="text"
            placeholder="Añadir precio de los materiales (USD)"
            onChange={(e) => handleInputChange(e, setData)}
            name="matPrice"
            value={data.matPrice}
          />

          {/* Working time */}
          <label htmlFor="add-hours" className="form-label">
            Horas de trabajo:
          </label>
          <input
            id="add-hours"
            className="form-input"
            type="text"
            placeholder="Añadir num. de horas de trabajo"
            onChange={(e) => handleInputChange(e, setData)}
            name="hours"
            value={data.hours}
          />

          {/* Final Price */}
          <label htmlFor="add-price" className="form-label">
            Precio de venta:
          </label>
          <input
            id="add-price"
            className="form-input"
            type="text"
            placeholder="Añadir precio de venta (USD)"
            onChange={(e) => handleInputChange(e, setData)}
            name="price"
            value={data.price}
          />
        </div>

        {/* Add image */}
        <div className="add-form-image">
          <label htmlFor="add-form-image-input" className="form-label">
            Cargar imagen:
          </label>
          <input
            id="add-form-image-input"
            className="add-form-image-input"
            type="file"
            accept=".jpg,.jpeg,.png"
            onChange={handleFileUpload}
          />

          {addImage && (
            <img
              className="add-form-image-preview"
              src={URL.createObjectURL(addImage)}
              alt="Image Preview"
            />
          )}
          <p
            className={`add-form-image-message ${
              !imgUploadMessage.type && "form-text-err"
            }`}
          >
            {imgUploadMessage.message}
          </p>
        </div>

        {/* Submit form button */}
        <button
          onClick={addItem}
          className="add-form-btn btn"
          disabled={loadItem}
        >
          {loadItem ? "Añadiendo..." : "Añadir datos"}
        </button>
      </form>

      {/* Warning for empty fields */}
      {emptyFields.length > 0 && (
        <div className="add-results-empty form-text-err">
          <p>Los siguientes campos obligatorios están vacíos:</p>
          <ul className="add-results-empty-list">
            {emptyFields.map((el, i) => (
              <li key={i}>{el}</li>
            ))}
          </ul>
          <p>No se pudo añadir el item a la base de datos.</p>
        </div>
      )}
      {/* Show added item, if successful */}
      <div className="add-results">
        {Object.keys(item).length > 0 && (
          <Suspense fallback={<h2>Cargando item...</h2>}>
            <Item data={item} docRef={newDocRef.current} />
          </Suspense>
        )}
      </div>
    </div>
  );
}
