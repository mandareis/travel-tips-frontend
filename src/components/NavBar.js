import React from "react";
import { NavLink } from "react-router-dom";
import { observer } from "mobx-react";
import { useTravelStore } from "../TipsContext";

function NavBar(props) {
  const store = useTravelStore();
  return (
    <div className="nav-bar-container">
      <div id="home-btn">
        <NavLink to="/">
          <i className="fas fa-home fa-lg"></i>
        </NavLink>
      </div>
      <div id="search-btn">
        <NavLink to="/search">
          <i className="fas fa-search fa-lg"></i>
        </NavLink>
      </div>
      <div id="love-btn">
        <NavLink to="/likes">
          <i className="fas fa-heart fa-lg"></i>
        </NavLink>
      </div>
      {/* {console.log(store.user.user_id)} */}
      {store.user?.user_id ? (
        <div id="config-btn">
          <NavLink to="/settings">
            <i className="fas fa-cog fa-lg"></i>
          </NavLink>
        </div>
      ) : null}
      <div id="sign-out-btn">
        <a href="#" onClick={props.onLogOut}>
          <i className="fas fa-sign-out-alt fa-lg"></i>
        </a>
      </div>
    </div>
  );
}

export default observer(NavBar);
