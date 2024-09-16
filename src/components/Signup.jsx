import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AlertContext from "../context/alert/AlertContext";

const Signup = () => {
  let navigate = useNavigate();
  const { showAlert } = useContext(AlertContext);

  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
  });

  const { name, email, password, cpassword } = credentials;

  const handleOnChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:5000/api/auth/createuser", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
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
      showAlert("Account Created Successfully", "success");
    } else {
      showAlert("Invalid Credentials", "danger");
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            aria-describedby="emailHelp"
            onChange={handleOnChange}
            required
          />
        </div>
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
            onChange={handleOnChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            onChange={handleOnChange}
            required
            minLength={8}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Confirm Password
          </label>
          <input
            type="password"
            className="form-control"
            id="cpassword"
            name="cpassword"
            onChange={handleOnChange}
            minLength={8}
          />
        </div>
        <button disabled={password !== cpassword} type="submit" className="btn btn-warning">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Signup;
