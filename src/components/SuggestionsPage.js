import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { useTravelStore } from "../TipsContext";
import { parse } from "query-string";
import VotesUpOrDown from "./VotesUpOrDown";

function SuggestionsPage(props) {
  let params = parse(props.location.search);
  const [data, setData] = useState([]);
  const [err, setErr] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const store = useTravelStore();

  useEffect(() => {
    async function fetchSearch() {
      try {
        let response = await fetch(`/suggestions?city=${params.city}`);

        if (!response.ok) {
          setErr(true);
          setMessage("No suggestions exist for this city.");
        } else {
          let data = await response.json();
          setData(data);
          setErr(false);
          setIsLoading(false);
          setMessage("Here are your results:");
        }
      } catch (err) {
        setMessage(err.message);
      }
    }
    fetchSearch();
  }, [params.city]);

  return (
    <div>
      {isLoading ? null : (
        <div>
          <h3>{store?.user ? `Hello ${store.user.name}. Welcome!` : null}</h3>
          {data.map((s, idx) => {
            return (
              <div className="votes-suggestion-container">
                <div>
                  <VotesUpOrDown suggestion={s} />
                </div>
                <div key={idx}>
                  <h4>{s.title}</h4>
                  <p>
                    City: {s.place.city},{s.place.country}
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
