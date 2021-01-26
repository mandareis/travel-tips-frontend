import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { useTravelStore } from "../TipsContext";
import { parse } from "query-string";
import { useHistory } from "react-router-dom";
import VotesUpOrDown from "./VotesUpOrDown";
import { action } from "mobx";

function Home(props) {
  let params = parse(props.location.search);
  const [data, setData] = useState();
  // const [err, setErr] = useState(false);
  const history = useHistory();
  const [search, setSearch] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const store = useTravelStore();

  useEffect(() => {
    console.log(`Home: load: ${new Date().toISOString()}`);
    return () => {
      console.log(`Home: unload: ${new Date().toISOString()}`);
    };
  }, []);

  async function fetchSearch(city) {
    try {
      if (!isLoading) {
        setIsLoading(true);
      }
      let response = await fetch(`/suggestions?city=${city}`);
      if (!response.ok) {
        // setErr(true);
        // setMessage("Please fill out the entire form.");
      } else {
        let data = await response.json();
        // setMessage("Here are your results for: ");
        setData(data);
        // setErr(false);
      }
    } catch (err) {
      // setErr(true);
      // setMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchSearch(params.city);
  }, [params.city]);

  const handlesRedirect = (e) => {
    e.preventDefault();
    if (search !== params.city) {
      history.push(`/?city=${encodeURIComponent(search)}`);
    }
  };
  // apply message for search results
  //check if the city is in the database

  useEffect(() => {
    const timer = setTimeout(
      action(() => {
        store.successfullyDeletedUser = null;
      }),
      2000
    );
    return () => clearTimeout(timer);
  }, [store.successfullyDeletedUser, store]);

  return (
    <div>
      {store.successfullyDeletedUser === true ? (
        <p style={{ color: "green" }}>
          You've successfully deleted your account.
        </p>
      ) : null}
      {store.successfullyLoggedOut === true ? (
        <p style={{ color: "green" }}>You've successfully logged out.</p>
      ) : null}
      <div className="suggestion-intro-container">
        <h3>{store?.user ? `Hello ${store.user.name}. Welcome!` : null}</h3>
        <p>
          This app is here to help you find places to visit by searching for it
          with a city's name. You can vote a place up if you have visited, and
          if you really did not like it there, you can also vote it down. I hope
          this app will inspire you on your next trip! Have fun!
        </p>
        <div className="search-container">
          <div className="input-prefix-icon">
            <i className="fas fa-search "></i>
          </div>
          <form onSubmit={handlesRedirect}>
            <input
              type="text"
              value={props.search}
              onChange={(e) => setSearch(e.target.value)}
              autoComplete="off"
              placeholder="Search for a city..."
            />
          </form>
        </div>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <>
            {data.length > 0 ? (
              <p>Here are your results for: {params.city} </p>
            ) : (
              <p>No results were found for {params.city}</p>
            )}

            {data.map((s, index) => {
              return (
                <div>
                  <div className="votes-suggestion-container" key={index}>
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
                  <div className="paginate-container">
                    <button type="button" className="paginate-left">
                      <i className="fas fa-arrow-alt-circle-left "></i>
                    </button>
                    <button type="button" className="paginate-left">
                      <i className="fas fa-arrow-alt-circle-right paginate-right"></i>
                    </button>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}

export default observer(Home);
