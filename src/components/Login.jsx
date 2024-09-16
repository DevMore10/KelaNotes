import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AlertContext from "../context/alert/AlertContext";

const Login = () => {
  let navigate = useNavigate();
  const { showAlert } = useContext(AlertContext);

  const [credentials, setCredentials] = useState({ email: "", password: "" });

  const handleOnChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: credentials.email, password: credentials.password }),
      headers: {
        "content-type": "application/json",
      },
    });
    const json = await response.json();
    console.log(json);

    if (json.success) {
      //Save the authtoken and Redirect
      localStorage.setItem("token", json.authToken);
      navigate("/home");
      showAlert("Logged In Successfully", "success");
    } else {
      showAlert("Invalid Details", "danger");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            aria-describedby="emailHelp"
            value={credentials.email}
            onChange={handleOnChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            name="password"
            id="password"
            value={credentials.password}
            onChange={handleOnChange}
            required
            minLength={8}
          />
        </div>
        <button
          disabled={credentials.password.length < 8}
          type="submit"
          className="btn btn-warning"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Login;
