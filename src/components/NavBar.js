import React from "react";
import { NavLink } from "react-router-dom";
import { observer } from "mobx-react";
import { useTravelStore } from "../TipsContext";

function NavBar(props) {
  const store = useTravelStore();

  const enableFeatures = () => {
    if (store.user?.user_id) {
      return (
        <div className="private-features">
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
    } else {
      return null;
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
        <NavLink to="featured-suggestions">
          <i class="fas fa-atlas fa-lg"></i>
        </NavLink>
      </div>
      <div id="add-sug-btn">
        <NavLink to="/add-suggestion">
          <i class="fas fa-lightbulb fa-lg"></i>
        </NavLink>
      </div>
      <div id="love-btn">
        <NavLink to="/favorites">
          <i className="fas fa-heart fa-lg"></i>
        </NavLink>
      </div>

      <div className="search-btn">
        <i className="fas fa-search fa-lg"></i>
        <input
          id="input-sug"
          value=""
          // type="text"
          // onChange=""
          autoComplete="off"
          placeholder="search"
        />
        {enableFeatures()}
      </div>
    </div>
  );
}

export default observer(NavBar);