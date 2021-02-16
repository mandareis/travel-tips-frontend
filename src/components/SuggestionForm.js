import React, { useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { observer } from "mobx-react";
import { runInAction } from "mobx";
import { useTravelStore } from "../TipsContext";

const SuggestionFormInput = (props) => {
  return (
    <div className={`suggestion-form ${props.longtext ? "ic-big" : ""}`}>
      <div className="input-prefix-icon">
        <i className={`fas ${props.icon}`}></i>
      </div>
      <div>
        {props.longtext ? (
          <textarea
            value={props.value}
            placeholder={props.placeholder}
            rows="5"
            onChange={props.onChange}
            name={props.name}
          ></textarea>
        ) : (
          <input
            value={props.value}
            type={props.type}
            onChange={props.onChange}
            autoComplete="off"
            placeholder={props.placeholder}
            ref={props.ref}
          />
        )}
      </div>
    </div>
  );
};
/*global google*/
const LocationAutocomplete = (props) => {
  let eleRef = useRef(null);
  let autocompleteRef = useRef(null);
  let listenerRef = useRef(null);

  useEffect(() => {
    let config = {};
    if (props.citiesOnly) {
      config = { types: ["(cities)"] };
    }
    if (eleRef.current && !autocompleteRef.current) {
      // checks to see if there's no value in the ref
      let ac = new google.maps.places.Autocomplete(eleRef.current, config);

      autocompleteRef.current = ac;
      // ac gets assigned to autocompleteRef.current
      let listener = ac.addListener("place_changed", () => {
        const place = ac.getPlace();
        if (!place.geometry) {
          props.onPlaceChanged(null);
        } else {
          props.onPlaceChanged(place);
        }
      });
      listenerRef.current = listener;
    }
  }, [props]);

  useEffect(() => {
    if (autocompleteRef.current) {
      autocompleteRef.current.setComponentRestrictions({
        country: [props.country],
      });
    }
    if (eleRef.current) {
      eleRef.current.value = "";
      props.onPlaceChanged(null);
    }
  }, [props.country]);
  return (
    <div className="suggestion-form">
      <div className="input-prefix-icon">
        <i className={`fas ${props.icon}`}></i>
      </div>
      <input
        type="text"
        name="Location"
        placeholder={props.placeholder}
        icon={props.icon}
        ref={eleRef}
      ></input>
    </div>
  );
};

function SuggestionForm() {
  let history = useHistory();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [place, setPlace] = useState(null);
  const [city, setCity] = useState(null);
  const [error, setError] = useState(null);
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("US");
  const charLimit = 1500;
  const isDescriptionTooLong = description.length > charLimit;
  const store = useTravelStore();

  useEffect(() => {
    async function LoadCountries() {
      let countries = await getCountriesList();
      countries = countries.sort((a, b) => (a.country > b.country ? 1 : -1));

      setCountries(countries);
    }
    LoadCountries();
  }, []);

  const getCountriesList = async () => {
    // add try catch later
    let response = await fetch("/places/countries-list");

    let data = await response.json();
    return data;
  };

  const handleAddSuggestion = async (e) => {
    e.preventDefault();
    let allCountries = await getCountriesList();
    if (!store.user) {
      setError("You must be logged in to create a suggestion.");
      return;
    }
    if (!place) {
      setError("Please select a place");
      return;
    }
    if (!city) {
      setError("Please select a city");
      return;
    }
    let matchingCountry = null;
    let cityName = null;
    //iterating over the address_components to locate type="country"
    componentIter: for (let component of city.address_components) {
      if (component.types.includes("country")) {
        // located the country component
        // iterate over our static list of countries to find a matching country
        for (let country of allCountries) {
          if (component.short_name === country.code) {
            matchingCountry = country;
            //located matching country
            continue componentIter;
          }
        }
      }
      if (component.types.includes("locality")) {
        cityName = component.long_name;
      }
    }
    if (!cityName) {
      setError("Failed to find city. Please review your input");
      return;
    }
    if (!matchingCountry) {
      setError("Failed to match location. Please review your input.");
      return;
    }
    if (isDescriptionTooLong) {
      setError("Description is too long.");
      return;
    }
    let response = await fetch("/suggestions", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        place: {
          country,
          continent: matchingCountry.continent,
          city: cityName,
          name: place.name,
        },
        title,
        description,
      }),
    });
    let data = await response.json();

    if (!response.ok) {
      setError("Please fill out the entire form.");
    } else {
      runInAction(() => {
        history.push(`/suggestion/${data.id}`);
      });
    }
  };

  return (
    <div className="suggestion-form">
      <form
        className="suggestion-form-container"
        onSubmit={handleAddSuggestion}
      >
        <p style={{ color: "red" }}> {error}</p>
        <h4>Create a new suggestion:</h4>
        <select
          className="select-container"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        >
          {countries.map((c, id) => {
            return (
              <option value={c.code} key={id}>
                {c.country}
              </option>
            );
          })}
        </select>
        <LocationAutocomplete
          icon="fa-map-marker-alt"
          citiesOnly
          placeholder="Enter a city"
          onPlaceChanged={(city) => setCity(city)}
          country={country}
        />
        <LocationAutocomplete
          icon="fa-map-marker-alt"
          placeholder="Name of place"
          onPlaceChanged={(place) => setPlace(place)}
          country={country}
        />
        <SuggestionFormInput
          type="text"
          icon="fa-pen-nib"
          value={title}
          name="title"
          placeholder="Title"
          onChange={(e) => setTitle(e.target.value)}
        />
        <SuggestionFormInput
          type="text"
          icon="fa-comment"
          value={description}
          name="title"
          placeholder="Description"
          longtext
          onChange={(e) => setDescription(e.target.value)}
        />
        {!isDescriptionTooLong ? (
          <h6>Remaining Characters: {charLimit - description.length}</h6>
        ) : (
          <h6 style={{ color: "#d62828" }}>
            Remaining Characters: {charLimit - description.length}
          </h6>
        )}
        <div id="get-login-btn">
          <button type="submit" className="add-sug-btn">
            <i className="fas fa-paper-plane fa-lg"></i>
          </button>
        </div>
      </form>
    </div>
  );
}
export default observer(SuggestionForm);
