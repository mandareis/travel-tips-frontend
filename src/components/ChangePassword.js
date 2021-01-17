import React, { useState } from "react";
import { useTravelStore } from "../TipsContext";
import { motion } from "framer-motion";
import { observer } from "mobx-react";

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
  const [registerErr, setRegisterErr] = useState(false);
  const [isButtonAnimating, setIsButtonAnimating] = useState(false);

  const getUpdateBtn = () => {
    let UpdateBtn = {};
    if (registerErr && isButtonAnimating) {
      UpdateBtn = {
        color: "#d62828",
      };
    }
    const innerUpdateBtn = (
      <button type="submit" className="update-btn" style={UpdateBtn}>
        <i className="fas fa-save fa-lg"></i>
      </button>
    );
    if (registerErr && isButtonAnimating) {
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
    if (newPassword !== passwordConfirm) {
      alert("Password mismatch");
      return;
    }
    e.preventDefault();
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
      setRegisterErr(true);
      setIsButtonAnimating(true);
    }
  };
  return (
    <div className="update-form" onSubmit={handlesUpdate}>
      <form className="register-input-container">
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
        <div className="update-btn">{getUpdateBtn()}</div>
      </form>
    </div>
  );
}
export default observer(ChangePassword);
