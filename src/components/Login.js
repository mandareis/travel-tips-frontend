import React, { useState } from "react";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";

const LoginFormInput = (props) => {
  return (
    <div className="login-form">
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

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginErr, setLoginErr] = useState(false);
  const [isButtonAnimating, setIsButtonAnimating] = useState(false);

  const getLoginBtn = () => {
    let loginBtn = {};
    if (loginErr && isButtonAnimating) {
      loginBtn = {
        color: "#d62828",
      };
    }
    const innerLoginBtn = (
      <button type="submit" className="login-btn" style={loginBtn}>
        <i className="fas fa-sign-in-alt fa-lg"></i>
      </button>
    );

    if (loginErr && isButtonAnimating) {
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
          {innerLoginBtn}
        </motion.div>
      );
    }
    return innerLoginBtn;
  };

  const handlesLogin = async (e) => {
    e.preventDefault();
    let response = await fetch("/sessions", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) {
      setLoginErr(true);
      setIsButtonAnimating(true);
    } else {
      const data = await response.json();
      console.log(data);
      console.log(`Hello, ${data.username}`);
    }
  };

  return (
    <div className="login-form" onSubmit={handlesLogin}>
      <form className="login-input-container">
        <h2>Login</h2>
        <div className="input-container">
          <LoginFormInput
            type="text"
            icon="fa-user"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <LoginFormInput
            type="password"
            icon="fa-lock"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="login-btns">
          <div id="navlink">
            <NavLink to="/">
              <i className="fas fa-chevron-circle-left go-back-btn"></i>
            </NavLink>
          </div>

          <div id="get-login-btn">{getLoginBtn()}</div>
        </div>
      </form>
    </div>
  );
}
export default Login;
