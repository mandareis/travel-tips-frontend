import React, { useState } from "react";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";

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
function Register(props) {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [registerErr, setRegisterErr] = useState(false);
  const [isButtonAnimating, setIsButtonAnimating] = useState(false);
  // const [errPassword, setErrPassword] = useState({
  //   password: "",
  //   mismatch: "",
  // });

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
          {innerRegisterBtn}
        </motion.div>
      );
    }
    return innerRegisterBtn;
  };

  // const handleConfirmPassword = () => {};
  const handlesLogin = async (e) => {
    e.preventDefault();
    try {
      let response = await fetch("/sessions", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) {
        setRegisterErr(true);
        setIsButtonAnimating(true);
      } else {
        const data = await response.json();
        props.onLogin({ id: data.user_id, username: data.username });
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="register-form" onSubmit={handlesLogin}>
      <form className="register-input-container">
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
          name="new_password"
          placeholder="Confirm Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <div className="register-btn">{getRegisterBtn()}</div>

        <h5>
          Already have an account?
          <NavLink to="/login"> Login</NavLink>
        </h5>
      </form>
    </div>
  );
}

export default Register;
