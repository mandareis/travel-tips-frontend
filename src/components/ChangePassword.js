import React, { useState, useEffect } from "react";
import { useTravelStore } from "../TipsContext";
import { motion } from "framer-motion";
import { observer } from "mobx-react";
import { NavLink } from "react-router-dom";
import { toJS } from "mobx";

const UpdateFormInput = (props) => {
  return (
    <div className="update-form">
      <div className="input-prefix-icon">
        <i className={`fas ${props.icon}`}></i>
      </div>
      <div>
        <input
          value={props.value}
          type={props.type}
          onChange={props.onChange}
          autoComplete="off"
          placeholder={props.placeholder}
        />
      </div>
    </div>
  );
};

function ChangePassword() {
  const store = useTravelStore();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [err, setErr] = useState(false);
  const [message, setMessage] = useState(null);
  const [isButtonAnimating, setIsButtonAnimating] = useState(false);

  const getUpdateBtn = () => {
    let UpdateBtn = {};
    if (err && isButtonAnimating) {
      UpdateBtn = {
        color: "#d62828",
      };
    }
    const innerUpdateBtn = (
      <button type="submit" className="update-btn" style={UpdateBtn}>
        <i className="fas fa-save fa-lg"></i>
      </button>
    );
    if (err && isButtonAnimating) {
      const movement = 12;
      return (
        <motion.div
          onAnimationComplete={() => {
            setIsButtonAnimating(false);
          }}
          animate={{
            translateX: [0, -movement, movement, -movement, movement, 0],
          }}
          transition={{ duration: 0.6, ease: "easeInOut", loop: 0 }}
        >
          {innerUpdateBtn}
        </motion.div>
      );
    }
    return innerUpdateBtn;
  };
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handlesUpdate = async (e) => {
    e.preventDefault();
    try {
      if (newPassword !== passwordConfirm) {
        // debugger;
        throw new Error("Password mismatch");
      }
      console.log(toJS(store));
      let response = await fetch(`/users/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          old_password: oldPassword,
          new_password: newPassword,
        }),
      });
      if (!response.ok) {
        throw new Error("Password change failed.");
      } else {
        setErr(false);
        setMessage("Password successfully updated!");
        setOldPassword("");
        setNewPassword("");
        setPasswordConfirm("");
      }
    } catch (e) {
      setMessage(e.message);
      setErr(true);
      setIsButtonAnimating(true);
    }
  };
  return (
    <div className="update-form" onSubmit={handlesUpdate}>
      <form className="register-input-container">
        {message && !err ? (
          <p style={{ color: "green" }}>{message}</p>
        ) : (
          <p style={{ color: "red" }}>{message}</p>
        )}

        <h2>Update password:</h2>
        <UpdateFormInput
          type="password"
          icon="fa-lock"
          placeholder="Current Password"
          name="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
        <UpdateFormInput
          type="password"
          icon="fa-lock"
          placeholder="New Password"
          name="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <UpdateFormInput
          type="password"
          icon="fa-lock"
          placeholder="Confirm New Password"
          name="password"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
        />
        <div id="navlink">
          <NavLink to="/settings">
            <i className="fas fa-chevron-circle-left go-back-btn"></i>
          </NavLink>
          <div className="update-btn">{getUpdateBtn()}</div>
        </div>
      </form>
    </div>
  );
}
export default observer(ChangePassword);
