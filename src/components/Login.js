import React, { useState } from "react";
import { motion } from "framer-motion";

const LoginFormInput = (props) => {
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

const handlesLogin = (e) => {
  e.preventDefault();
  return <p>something else</p>;
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
      <button type="submit" className="register-btn" style={loginBtn}>
        <i className="fas fa-sign-in-alt fa-lg"></i>
      </button>
    );

    if (loginErr && isButtonAnimating) {
      const movement = 17;
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

  return (
    <div className="login-form" onSubmit={handlesLogin}>
      <form className="login-input-container">
        <h2>Login</h2>

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
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div> {getLoginBtn()}</div>
      </form>
    </div>
  );
}
export default Login;
