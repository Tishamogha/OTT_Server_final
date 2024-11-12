import React, { useState } from 'react';
import './Login.css';
import logo from '../../assets/BSLogo_transparent.png';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [signState, setSignState] = useState("Sign In");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const loginUrl = import.meta.env.VITE_SPRING_LOGIN_URL;
  const authUrl = import.meta.env.VITE_SPRING_AUTH_URL;
  const signupUrl = import.meta.env.VITE_SPRING_SIGNUP_URL;

  const handleSignup = async () => {
    try {
      const response = await fetch(signupUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: {
            username,
            password,
            firstName,
            lastName,
            role: "USER"
          }
        })
      });
      const data = await response.json();
      if (data.status === "ACCEPTED") {
        alert(data.message);
        setSignState("Sign In");
      } else {
        alert("Signup failed.");
      }
    } catch (error) {
      console.error("Error during signup:", error);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      if (data.status === "OK") {
        localStorage.setItem("authToken", data.token);
        authenticate();
      } else {
        alert("Login failed.");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const authenticate = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(authUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
      const data = await response.json();
      if (data.status === "OK") {
        alert("Authentication successful");
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate('/'); // Redirect to the home page on successful authentication
      } else {
        alert("Authentication failed.");
      }
    } catch (error) {
      console.error("Error during authentication:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (signState === "Sign Up") {
      handleSignup();
    } else {
      handleLogin();
    }
  };

  return (
    <div className='login'>
      <img src={logo} className='login-logo' alt="" />
      <div className="login-form">
        <h1>{signState}</h1>
        <form onSubmit={handleSubmit}>
          {signState === "Sign Up" && (
            <>
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </>
          )}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">{signState}</button>
          <div className="form-help">
            <div className="remember">
              <input type="checkbox" />
              <label>Remember Me</label>
            </div>
            <p>Need help?</p>
          </div>
        </form>
        <div className="form-switch">
          {signState === "Sign In" ? (
            <p>New to BootStream? <span onClick={() => setSignState("Sign Up")}>Sign up now</span></p>
          ) : (
            <p>Already have an account? <span onClick={() => setSignState("Sign In")}>Sign In now</span></p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
