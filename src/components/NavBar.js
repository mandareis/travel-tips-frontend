import React, { useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { observer } from "mobx-react";
import { useTravelStore } from "../TipsContext";

function NavBar(props) {
  const history = useHistory();
  const [search, setSearch] = useState(null);
  const store = useTravelStore();

  const handlesRedirect = (e) => {
    e.preventDefault();
    history.push(`/suggestions?city=${encodeURIComponent(search)}`);
  };
  const enableFeatures = () => {
    if (store.user?.user_id) {
      return (
        <div className="private-features">
          <div id="add-sug-btn">
            <NavLink to="/add-suggestion">
              <i className="fas fa-lightbulb fa-lg"></i>
            </NavLink>
          </div>
          <div id="love-btn">
            <NavLink to="/favorites">
              <i className="fas fa-heart fa-lg"></i>
            </NavLink>
          </div>
          <div id="config-btn">
            <NavLink to="/settings">
              <i className="fas fa-cog fa-lg"></i>
            </NavLink>
          </div>
          <div id="sign-out-btn">
            <a href="#" onClick={props.onLogOut}>
              <i className="fas fa-sign-out-alt fa-lg"></i>
            </a>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="nav-bar-container">
      <div id="home-btn">
        <NavLink to="/">
          <i className="fas fa-home fa-lg"></i>
        </NavLink>
      </div>
      <div id="sugs-btn">
        <NavLink to="/suggestions">
          <i className="fas fa-atlas fa-lg"></i>
        </NavLink>
      </div>

      <div className="search-btn">
        <i className="fas fa-search fa-lg"></i>
        <form onSubmit={handlesRedirect}>
          <input
            id="input-sug"
            type="text"
            value={props.search}
            onChange={(e) => setSearch(e.target.value)}
            autoComplete="off"
            placeholder="search"
          />
        </form>
      </div>

      {enableFeatures()}
    </div>
  );
}

export default observer(NavBar);
