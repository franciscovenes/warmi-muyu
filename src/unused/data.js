function getRandomColorsArray(colorsArray) {
  let arrCopy = [...colorsArray];
  let newArr = [];

  for (let i = 0; i < Math.ceil(Math.random() * colorsArray.length); i++) {
    let randNumber = Math.floor(Math.random() * arrCopy.length);
    let splicedItem = arrCopy.splice(randNumber, 1)[0];
    newArr.push(splicedItem);
  }
  return newArr;
}

export function getRandomItem() {
  return {
    model:
      elementsObj.models[Math.floor(Math.random() * elementsObj.models.length)],
    type: elementsObj.types[
      Math.floor(Math.random() * elementsObj.types.length)
    ],
    artisan:
      elementsObj.artisans[
        Math.floor(Math.random() * elementsObj.artisans.length)
      ],
    length: `${(Math.random() * 100).toFixed(2)}`,
    width: `${(Math.random() * 100).toFixed(2)}`,
    matPrice: `${(Math.random() * 100).toFixed(2)}`,
    hours: `${Math.ceil(Math.random() * 100)}`,
    price: `${(Math.random() * 100).toFixed(2)}`,
    condition:
      elementsObj.conditions[
        Math.floor(Math.random() * elementsObj.conditions.length)
      ],
    state:
      elementsObj.states[Math.floor(Math.random() * elementsObj.states.length)],
    location: `Location ${Math.floor(Math.random() * 100)}`,
    observations: `Observation ${Math.floor(Math.random() * 100)}`,
    inputUser: `Username ${Math.floor(Math.random() * 100)}`,
    imageURL: false,
    colors: getRandomColorsArray(elementsObj.colors),
  };
}

export const elementsObj = {
  types: ["Arete", "Pañuelo", "Anillo", "Collar", "Pulsera"],
  models: [...Array(21).keys()].slice(1).map((el) => `Modelo ${el}`),
  artisans: [
    "Elizabet Durazno",
    "Flor Zumba",
    "Marisol Corte",
    "Paulina Corte",
    "María Zumba",
    "Esther Durazno",
    "Daniela Samaniego",
  ],
  conditions: ["Buen estado", "Necesita reparación", "En reparación"],
  states: ["Vendido", "En stock", "En muestra"],
  colors: ["rojo", "amarillo", "verde", "violeta", "azul", "negro", "dorado"],
};
