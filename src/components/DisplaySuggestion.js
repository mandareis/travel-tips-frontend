import { runInAction } from "mobx";
import React, { useState, useEffect } from "react";
import { useTravelStore } from "../TipsContext";
import VotesUpOrDown from "./VotesUpOrDown";

function DisplaySuggestion(props) {
  // might need refactoring
  //needs a try and catch  for errors
  const [isLoading, setIsLoadding] = useState(true);
  const [location, setLocation] = useState(null);
  const store = useTravelStore();

  useEffect(() => {
    async function getSuggestion() {
      if (
        !store.suggestion ||
        String(store.suggestion.id) !== props.params.id
      ) {
        const response = await fetch(`/suggestions/${props.params.id}`);
        let data = await response.json();
        runInAction(() => {
          store.suggestion = data;
        });
        console.log(data);
      }
      const response2 = await fetch(`/places/${props.params.id}`);
      let data2 = await response2.json();
      setLocation(data2);
      setIsLoadding(false);
    }
    getSuggestion();
  }, [props.params.id, store]);

  return (
    <div className="votes-info-container">
      <VotesUpOrDown />
      {isLoading ? null : (
        <div className="suggestion-box">
          <h3>{store.suggestion.title}</h3>
          <p>"{store.suggestion.description}"</p>
          <p>
            Continent: {location.continent}, Country: &nbsp;
            {location.country}, City: &nbsp;
            {location.city}
          </p>
          <p>tags: {store.suggestion.labels}</p>
        </div>
      )}
    </div>
  );
}

export default DisplaySuggestion;
