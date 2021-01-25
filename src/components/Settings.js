import React from "react";
import { NavLink } from "react-router-dom";
import DeleteUser from "./DeleteUser";

function Settings() {
  return (
    <div className="settings">
      <div id="user-edit">
        <NavLink to="/edit-user">
          <i className="fas fa-user-edit fa-2x"></i>
          <p>Update User</p>
        </NavLink>
      </div>
      <div id="user-password">
        <NavLink to="/change-password">
          <i className="fas fa-key fa-2x"></i>
          <p>Change Password</p>
        </NavLink>
      </div>
      <div id="user-delete">
        <DeleteUser />
      </div>
    </div>
  );
}
export default Settings;
