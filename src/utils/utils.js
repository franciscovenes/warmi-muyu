// Utility functions, used in more than one component

// Converts names to spanish, for display purposes
export function getSpanishName(name, retrieve) {
  let spanishName;
  switch (name) {
    case "models":
      spanishName = retrieve ? "modelos" : "modelo";
      break;
    case "artisans":
      spanishName = retrieve ? "artesanas" : "artesana";
      break;
    case "conditions":
      spanishName = retrieve ? "condiciones" : "condición";
      break;
    case "states":
      spanishName = retrieve ? "estados" : "estado";
      break;
    case "types":
      spanishName = retrieve ? "tipos de producto" : "tipo de producto";
      break;
    case "length":
      spanishName = "largo";
      break;
    case "width":
      spanishName = "ancho";
      break;
    case "matPrice":
      spanishName = "precio materiales";
      break;
    case "price":
      spanishName = "precio de venta";
      break;
    case "hours":
      spanishName = "horas de trabajo";
      break;
    case "location":
      spanishName = "ubicación";
      break;
    case "observations":
      spanishName = "observaciones";
      break;
    default:
      spanishName = "colores";
      break;
  }
  return spanishName;
}

// Formats numeric fields, stored as strings. Used in handleInputChange below
function formatNumbers(name, value) {
  let newValue =
    name === "hours"
      ? value.replace(/[^0-9]/g, "")
      : value
          .replace(/[^0-9.]/g, "")
          .replace(".", "x")
          .replace(/\./g, "")
          .replace("x", ".");

  return newValue;
}

// Handles controlled input components. Used in Add.jsx and Item.jsx (while editing fields)
export function handleInputChange(event, setFunc) {
  const { name, value } = event.target;

  const fields = ["width", "length", "matPrice", "price", "hours"];
  setFunc((prevState) => ({
    ...prevState,
    [name]: fields.includes(name) ? formatNumbers(name, value) : value,
  }));
}

// Trims location and observations fields. Used in Add.jsx and Item.jsx (while editing fields)
export function trimInputsOnBlur(event, setFunc) {
  const { name } = event.target;
  setFunc((prevState) => {
    return {
      ...prevState,
      [name]: prevState[name].trim(),
    };
  });
}

// Creates array with the names of empty form fields, returns it and sets corresponding state. Used in Add.jsx and Item.jsx (while editing fields)
export function getEmptyFields(setFunc, data) {
  const emptyFieldsNames = Object.entries(data)
    .filter(
      (entry) =>
        !entry[1].length &&
        !(
          entry[0] === "location" ||
          entry[0] === "observations" ||
          entry[0] === "imageURL"
        )
    )
    .map((entry) => {
      const spanishName = getSpanishName(entry[0]);
      return spanishName[0].toUpperCase() + spanishName.slice(1);
    });
  setFunc(emptyFieldsNames);
  return emptyFieldsNames;
}
