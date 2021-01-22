import { runInAction, toJS } from "mobx";
import React, { useState, useEffect } from "react";
import { useTravelStore } from "../TipsContext";
import VotesUpOrDown from "./VotesUpOrDown";

function DisplaySuggestion(props) {
  // might need refactoring
  //needs a try and catch  for errors
  const [isLoading, setIsLoadding] = useState(true);

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
        setIsLoadding(false);
        console.log(data);
      }
    }
    getSuggestion();
  }, [props.params.id, store]);

  return (
    <div>
      {isLoading ? null : (
        <div className="votes-info-container">
          <div style={{ marginRight: "3em" }}>
            <VotesUpOrDown suggestion={toJS(store.suggestion)} />
          </div>
          <div className="suggestion-box">
            <h3>{store.suggestion.title}</h3>
            <p>"{store.suggestion.description}"</p>
            <p>
              Continent: {store.suggestion.place.continent}, Country: &nbsp;
              {store.suggestion.place.country}, City: &nbsp;
              {store.suggestion.place.city}
            </p>
            <p>tags: {store.suggestion.labels}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default DisplaySuggestion;
