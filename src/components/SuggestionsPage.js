import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { useTravelStore } from "../TipsContext";
import { parse } from "query-string";
import VotesUpOrDown from "./VotesUpOrDown";

function SuggestionsPage(props) {
  let params = parse(props.location.search);
  const [data, setData] = useState();
  const [err, setErr] = useState(false);
  // const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const store = useTravelStore();

  useEffect(() => {
    async function fetchSearch() {
      try {
        let response = await fetch(`/suggestions?city=${params.city}`);
        if (!response.ok) {
          setErr(true);
        } else {
          let data = await response.json();
          console.log(data);
          // setMessage("Here are your results for: ");
          setData(data);
          setErr(false);
          setIsLoading(false);
        }
      } catch (err) {
        setErr(true);
      }
    }
    fetchSearch();
  }, [params.city]);

  // apply message for search results
  //check if the city is in the database
  console.log(data);
  return (
    <div>
      {isLoading ? null : (
        <div className="suggestion-intro-container">
          <h3>{store?.user ? `Hello ${store.user.name}. Welcome!` : null}</h3>
          <p>
            This app is here to help you find places to visit by searching for
            it with a city's name. You can vote a place up if you have visited
            there, and if you really hated this place, you can also vote it
            down. I hope this app will inspire you on your next trip! Have fun!
          </p>
          {data ? (
            <p>Here are your results for: {params.city} </p>
          ) : (
            <p>No suggestions were found for: </p>
          )}
          {data.map((s, idx) => {
            return (
              <div className="votes-suggestion-container" key={idx}>
                <div>
                  <VotesUpOrDown suggestion={s} />
                </div>
                <div className="list-of-places-container">
                  <a href={`/suggestion/${s.id}`}>{s.place.name}</a>
                  <h5>
                    Location: {s.place.city},{s.place.country}
                  </h5>
                </div>
              </div>
            );
          })}
          <div className="paginate-btns">
            <button type="button" className="paginate-left">
              <i className="fas fa-arrow-alt-circle-left "></i>
            </button>
            <button type="button" className="paginate-left">
              <i className="fas fa-arrow-alt-circle-right paginate-right"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default observer(SuggestionsPage);
