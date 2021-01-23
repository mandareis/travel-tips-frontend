import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { NavLink, useHistory } from "react-router-dom";
import { useTravelStore } from "../TipsContext";
import { observer } from "mobx-react";
import { runInAction, action } from "mobx";

const RegisterFormInput = (props) => {
  return (
    <div className="register-form">
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
function Register() {
  let history = useHistory();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [password_confirmation, setPasswordConfirmation] = useState("");
  const [registerErr, setRegisterErr] = useState(null);
  const [message, setMessage] = useState("");
  const [isButtonAnimating, setIsButtonAnimating] = useState(false);
  const store = useTravelStore();

  const getRegisterBtn = () => {
    let registerBtn = {};
    if (registerErr && isButtonAnimating) {
      registerBtn = {
        color: "#d62828",
      };
    }
    const innerRegisterBtn = (
      <button type="submit" className="register-btn" style={registerBtn}>
        <i className="fas fa-sign-in-alt fa-lg"></i>
      </button>
    );
    if (registerErr && isButtonAnimating) {
      const movement = 12;
      return (
        <motion.div
          onAnimationComplete={() => {
            setIsButtonAnimating(null);
          }}
          animate={{
            translateX: [0, -movement, movement, -movement, movement, 0],
          }}
          transition={{ duration: 0.6, ease: "easeInOut", loop: 0 }}
        >
          {innerRegisterBtn}
        </motion.div>
      );
    }
    return innerRegisterBtn;
  };
  // add error message for username, and email uniqueness.
  const handlesRegister = async (e) => {
    e.preventDefault();
    let response = await fetch("/sessions/register", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name,
        username,
        email,
        password,
        password_confirmation,
      }),
    });
    if (!response.ok) {
      setRegisterErr("Please fill out the entire form");
      setIsButtonAnimating(true);
    } else {
      const data = await response.json();
      console.log(data);
      runInAction(() => {
        store.user = data;
      });
      if (store.user) {
        history.push("/suggestions");
      }
      console.log(`Hello ${data.name}. Welcome!`);
    }
  };
  useEffect(() => {
    const timer = setTimeout(
      action(() => {
        store.successfullyDeletedUser = null;
      }),
      2000
    );
    return () => clearTimeout(timer);
  }, [store.successfullyDeletedUser, store]);
  return (
    <div className="register-form" onSubmit={handlesRegister}>
      <form className="register-input-container">
        <p style={{ color: "red" }}>{registerErr}</p>
        {store.successfullyDeletedUser === true ? (
          <p style={{ color: "green" }}>
            You've successfully deleted your account.
          </p>
        ) : null}
        <h2>Create an account</h2>
        <RegisterFormInput
          type="text"
          icon="fa-user"
          placeholder="Name"
          value={name}
          name="name"
          onChange={(e) => setName(e.target.value)}
        />
        <RegisterFormInput
          type="text"
          icon="fa-user"
          placeholder="Username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <RegisterFormInput
          type="text"
          icon="fa-at"
          placeholder="Email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <RegisterFormInput
          type="password"
          icon="fa-lock"
          placeholder="Password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <RegisterFormInput
          type="password"
          icon="fa-lock"
          name="password_confirmation"
          placeholder="Confirm Password"
          value={password_confirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
        />
        <div className="register">{getRegisterBtn()}</div>
        <div className="login-account">
          <h5>
            Already have an account?
            <NavLink to="/login"> Login</NavLink>
          </h5>
        </div>
      </form>
    </div>
  );
}

export default observer(Register);
