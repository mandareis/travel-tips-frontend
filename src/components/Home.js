import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { useTravelStore } from "../TipsContext";
import { parse } from "query-string";
import { useHistory } from "react-router-dom";
import VotesUpOrDown from "./VotesUpOrDown";
import { action } from "mobx";

function Home(props) {
  const PAGE_SIZE = 5;
  let params = parse(props.location.search);
  const [data, setData] = useState(null);
  const history = useHistory();
  const [search, setSearch] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const store = useTravelStore();

  async function fetchSearch(city, page) {
    try {
      // if (!isLoading) {
      //   setIsLoading(true);
      let response = await fetch(`/suggestions?city=${city}&page=${page}`);

      if (!response.ok) {
        console.log("there's an error.");
      } else {
        let data = await response.json();
        setData(data);
        // not ideal. causes a re-render?
        if (data.length === 0 && page > 1) {
          setPage((page) => page - 1);
        }
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchSearch(params.city, page);
  }, [params.city, page]);

  const handlesRedirect = (e) => {
    e.preventDefault();
    if (search !== params.city) {
      setPage(1);
      history.push(`/?city=${encodeURIComponent(search)}`);
    }
  };

  useEffect(() => {
    const timer = setTimeout(
      action(() => {
        store.successfullyDeletedUser = null;
      }),
      2000
    );
    return () => clearTimeout(timer);
  }, [store.successfullyDeletedUser, store]);

  const handlesPagination = (direction) => {
    return () => {
      setPage((prevPage) => Math.max(prevPage + direction, 1));
    };
  };
  let handlesgoback = handlesPagination(-1);
  let handlesgoforward = handlesPagination(+1);

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
        {isLoading ? null : (
          <>
            {data.length > 0 ? (
              <div>
                <p>Here are your results for: {params.city} </p>
                <div className="paginate-container">
                  <button className="paginate-left" onClick={handlesgoback}>
                    <i className="fas fa-arrow-alt-circle-left "></i>
                  </button>
                  <button
                    className="paginate-right"
                    disabled={data.length < PAGE_SIZE}
                    onClick={handlesgoforward}
                  >
                    <i className="fas fa-arrow-alt-circle-right"></i>
                  </button>
                </div>
              </div>
            ) : null}
            {data.map((s, index) => {
              return (
                <div key={index}>
                  <div className="votes-suggestion-container">
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
