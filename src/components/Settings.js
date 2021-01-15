import React from "react";
import { NavLink } from "react-router-dom";

function Settings() {
  return (
    <div className="settings">
      <div id="user-edit">
        <NavLink to="/edituser">
          <i className="fas fa-user-edit fa-2x"></i>
          <p>Update User</p>
        </NavLink>
      </div>

      <div className="user-delete">
        <i className="fas fa-user-times fa-2x"></i>
        <p>Delete Account</p>
      </div>
    </div>
  );
}
export default Settings;
