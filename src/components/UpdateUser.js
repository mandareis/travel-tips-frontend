import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTravelStore } from "../TipsContext";
import { observer } from "mobx-react";
import { NavLink } from "react-router-dom";
import { runInAction } from "mobx";

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

function UpdateUser() {
  const store = useTravelStore();
  const [name, setName] = useState(store.user?.name || "");
  const [username, setUsername] = useState(store.user?.username || "");
  const [email, setEmail] = useState(store.user?.email || "");
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
    let response = await fetch(`/users/${store.user.user_id}`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        name,
        username,
        email,
      }),
    });
    if (!response.ok) {
      setErr(true);
      setIsButtonAnimating(true);
      setMessage("Username or email is already taken.");
    } else {
      const data = await response.json();
      setMessage("User successfully updated");
      setErr(false);
      console.log(data);
      runInAction(() => {
        store.user.name = name;
        store.user.username = username;
        store.user.email = email;
      });
      if (store.user.username === data.error) {
      }
    }
  };

  return (
    <div className="update-form" onSubmit={handlesUpdate}>
      <form className="register-input-container">
        {err === false ? (
          <p id="correct">{message}</p>
        ) : (
          <p id="issues">{message}</p>
        )}

        <h2>Update {store.user?.username}'s account:</h2>
        <UpdateFormInput
          type="text"
          icon="fa-user"
          placeholder="Name"
          value={name}
          name="name"
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <UpdateFormInput
          type="text"
          icon="fa-user"
          placeholder="Username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <UpdateFormInput
          type="text"
          icon="fa-at"
          placeholder="Email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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

export default observer(UpdateUser);
