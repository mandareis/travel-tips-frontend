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
              <i className="fas fa-sign-out-alt fa-lg sign-out-btn"></i>
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
      {!store.user?.user_id ? (
        <div style={{display: "contents"}}>
         
         <div id="reg-nav">
         <NavLink to="/register">
          Register
         </NavLink>
       </div>
       <div  id="log-nav">
         <NavLink to="/login">
          Login
         </NavLink>
       </div>
        </div>
      
     
      ) : null}
      {enableFeatures()}
    </div>
  );
}

export default observer(NavBar);
