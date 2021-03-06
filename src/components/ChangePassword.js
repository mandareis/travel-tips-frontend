import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { observer } from "mobx-react";
import { withIsLoggedOut } from "./withIsLoggedOut";

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

  const handlesUpdate = async (e) => {
    e.preventDefault();
    try {
      if (newPassword !== passwordConfirm) {
        throw new Error("Password mismatch");
      }
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
      const data = await response.json();
      if (!response.ok) {
        let message = "Password change failed.";
        if (data.error) {
          message = data.error;
        }
        setMessage(message);
        setErr(true);
        throw new Error(message);
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
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="update-form" onSubmit={handlesUpdate}>
      <form className="password-input-container">
        {message && !err ? (
          <p style={{ color: "green" }}>{message}</p>
        ) : (
          <p style={{ color: "red" }}>{message}</p>
        )}
        <h3>Update password:</h3>
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
          <Link to="/settings">
            <i className="fas fa-chevron-circle-left go-back-btn"></i>
          </Link>
          <div className="update-btn">{getUpdateBtn()}</div>
        </div>
      </form>
    </div>
  );
}
export default withIsLoggedOut(observer(ChangePassword));
