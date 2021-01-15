import React from "react";
import { NavLink } from "react-router-dom";

function NavBar() {
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
      <div id="config-btn">
        <NavLink to="/settings">
          <i className="fas fa-cog fa-lg"></i>
        </NavLink>
      </div>
      <div id="sign-out-btn">
        <NavLink to="/">
          <i className="fas fa-sign-out-alt fa-lg"></i>
        </NavLink>
      </div>
    </div>
  );
}

export default NavBar;
