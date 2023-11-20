import { useState, useEffect, lazy, Suspense } from "react";
import TagsInput from "../components/TagsInput";
import SearchParam from "../components/SearchParam";
import "../css/retrieve.css";
import { retrieveItems, monitorItemsCollection } from "../api";

const Item = lazy(() => {
  return import("../components/Item");
});

export default function Retrieve() {
  // State for search params
  const [searchData, setSearchData] = useState({
    models: [],
    types: [],
    artisans: [],
    conditions: [],
    states: [],
    colors: [],
  });

  // State for retrieved items
  const [searchResults, setSearchResults] = useState([]);

  // State to control if items are being requested
  const [loadItems, setLoadItems] = useState(false);

  // State to control which search parameters are open/active
  const [activeParams, setActiveParams] = useState({
    models: false,
    artisans: false,
    conditions: false,
    states: false,
    colors: false,
    types: false,
  });

  // State for displaying outcome message from retrieving items
  const [searchResultMsg, setSearchResultMsg] = useState("");

  // Create listener for changes in the items collection. Function updates the list of retrieve items whenever an item is removed or updated
  useEffect(() => {
    const unsubscribe = monitorItemsCollection(setSearchResults);
    return () => {
      unsubscribe();
    };
  }, []);

  // Shows/hides search parameters
  function handleShowParam(name, bool) {
    setActiveParams((prevActiveParams) => ({
      ...prevActiveParams,
      [name]: bool,
    }));

    !bool &&
      setSearchData((prevSearchData) => ({
        ...prevSearchData,
        [name]: [],
      }));
  }

  async function handleSearchItems(event) {
    event.preventDefault();
    setLoadItems(true);
    setSearchResults([]);
    setSearchResultMsg("");

    // Build search parameters array from searchData
    const searchParams = Object.entries(searchData)
      .filter((entry) => entry[1].length)
      .map((entry) => {
        if (
          ["types", "models", "artisans", "conditions", "states"].includes(
            entry[0]
          )
        ) {
          return [
            `${entry[0].slice(0, -1)}`,
            entry[1].map((el) => el.toLowerCase()),
          ];
        } else {
          return [entry[0], entry[1].map((el) => el.toLowerCase())];
        }
      });

    // Retrieve items
    const retrievedItems = await retrieveItems(searchParams);

    // If any items are retrieved, add them to the searchResults state. Display number of items retrieved.
    if (retrievedItems.length > 0) {
      setSearchResults(retrievedItems);
      setSearchResultMsg(`${retrievedItems.length} item(s) encontrado(s)`);
    } else {
      setSearchResultMsg(`0 items encontrados`);
    }

    setLoadItems(false);
  }
  return (
    <div className="retrieve-container">
      <form className="form" name="retrieve-form">
        {/* Models search param */}
        <SearchParam
          handleShowParam={handleShowParam}
          paramStatus={activeParams.models}
          name="models"
        >
          <TagsInput
            name="models"
            tags={searchData.models}
            setFunc={setSearchData}
            retrieve
          />
        </SearchParam>

        {/* Types search param */}
        <SearchParam
          handleShowParam={handleShowParam}
          paramStatus={activeParams.types}
          name="types"
        >
          <TagsInput
            name="types"
            tags={searchData.types}
            setFunc={setSearchData}
            retrieve
          />
        </SearchParam>

        {/* Artisans search param */}
        <SearchParam
          handleShowParam={handleShowParam}
          paramStatus={activeParams.artisans}
          name="artisans"
        >
          <TagsInput
            name="artisans"
            tags={searchData.artisans}
            setFunc={setSearchData}
            retrieve
          />
        </SearchParam>

        {/* Conditions search param */}
        <SearchParam
          handleShowParam={handleShowParam}
          paramStatus={activeParams.conditions}
          name="conditions"
        >
          <TagsInput
            name="conditions"
            tags={searchData.conditions}
            setFunc={setSearchData}
            retrieve
          />
        </SearchParam>

        {/* States search param */}
        <SearchParam
          handleShowParam={handleShowParam}
          paramStatus={activeParams.states}
          name="states"
        >
          <TagsInput
            name="states"
            tags={searchData.states}
            setFunc={setSearchData}
            retrieve
          />
        </SearchParam>

        {/* Colors search param */}
        <SearchParam
          handleShowParam={handleShowParam}
          paramStatus={activeParams.colors}
          name="colors"
        >
          <TagsInput
            name="colors"
            tags={searchData.colors}
            setFunc={setSearchData}
            retrieve
          />
        </SearchParam>

        {/* Button is enabled if there are any search params and retrieving is not in course */}
        <button
          className="btn form-btn"
          onClick={handleSearchItems}
          disabled={
            !Object.values(searchData).some((arr) => arr.length) || loadItems
          }
        >
          {loadItems ? "Buscando..." : "Buscar items"}
        </button>
      </form>

      {/* Show number of items retrieved */}
      {searchResultMsg && <h2>{searchResultMsg}</h2>}
      {/* Show retrieved items */}
      <div className="retrieve-results">
        {searchResults.length > 0 &&
          searchResults.map((obj) => (
            <Suspense key={obj.docRef.id} fallback={<h2>Cargando items...</h2>}>
              <Item
                key={obj.docRef.id}
                data={obj.docData}
                setData={setSearchResults}
                docRef={obj.docRef}
              />
            </Suspense>
          ))}
      </div>
    </div>
  );
}
