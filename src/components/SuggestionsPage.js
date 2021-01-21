import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { useTravelStore } from "../TipsContext";
import { parse } from "query-string";
import VotesUpOrDown from "./VotesUpOrDown";

function SuggestionsPage(props) {
  let params = parse(props.location.search);
  const [data, setData] = useState();
  const [err, setErr] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const store = useTravelStore();

  useEffect(() => {
    async function fetchSearch() {
      try {
        let response = await fetch(`/suggestions?city=${params.city}`);

        if (!response.ok) {
          setMessage("No suggestions were found for");
          setErr(true);
        } else {
          let data = await response.json();
          console.log(data);
          setMessage("Here are your results for: ");
          setData(data);
          setErr(false);
          setIsLoading(false);
        }
      } catch (err) {
        setErr(err.message);
      }
    }
    fetchSearch();
  }, [params.city]);

  // apply message for search results
  return (
    <div>
      {isLoading ? null : (
        <div>
          <h3>{store?.user ? `Hello ${store.user.name}. Welcome!` : null}</h3>
          {data.map((s, id) => {
            return (
              <div className="votes-suggestion-container">
                <div>
                  <VotesUpOrDown suggestion={s} />
                </div>
                <div key={id}>
                  <div style={{ display: "inline-flex" }}>
                    <h5>{s.place.name} </h5>&nbsp;
                    <h5> {s.title}</h5>
                  </div>
                  <p>
                    Location: {s.place.city},{s.place.country}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default observer(SuggestionsPage);
