import { runInAction, toJS } from "mobx";
import React, { useState, useEffect } from "react";
import { useTravelStore } from "../TipsContext";
import VotesUpOrDown from "./VotesUpOrDown";
import { observer } from "mobx-react";

function DisplaySuggestion(props) {
  // might need refactoring
  // needs a try and catch  for errors
  // fix layout for votes, possibly by adding a row.
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
          <div>
            <div className="row">
              <VotesUpOrDown suggestion={toJS(store.suggestion)} />
            </div>
          </div>
          <div className="suggestion-box">
            <h2>{store.suggestion.title}</h2>
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

export default observer(DisplaySuggestion);
