import React, { useState, useRef, useEffect } from "react";
import { observer } from "mobx-react";
import { useTravelStore } from "../TipsContext";

const SuggestionFormInput = (props) => {
  return (
    <div className="suggestion-form">
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
    if (eleRef.current && !autocompleteRef.current) {
      console.log("a");
      let ac = new google.maps.places.Autocomplete(eleRef.current);
      autocompleteRef.current = ac;
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
    return () => {
      if (listenerRef.current) {
        google.maps.event.removeListener(listenerRef.current);
      }
    };
  }, []);
  return (
    <div>
      <input
        type="text"
        name="Location"
        placeholder="Enter a location"
        ref={eleRef}
      ></input>
    </div>
  );
};

function SuggestionForm() {
  const store = useTravelStore();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [place, setPlace] = useState(null);
  return (
    <div>
      <form>
        <span>Create a new suggestion:</span>
        <SuggestionFormInput
          type="text"
          icon=""
          value={title}
          name="title"
          placeholder="Title"
          onChange={(e) => setTitle(e.target.value)}
        />
        <SuggestionFormInput
          type="text"
          icon=""
          value={description}
          name="title"
          placeholder="Description"
          longtext
          onChange={(e) => setDescription(e.target.value)}
        />
        <pre style={{ width: "100%" }}>
          place: {JSON.stringify(place, null, 2)}
        </pre>
        <LocationAutocomplete onPlaceChanged={(place) => setPlace(place)} />
      </form>
    </div>
  );
}
export default observer(SuggestionForm);
