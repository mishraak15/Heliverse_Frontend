import React, { useState } from "react";
import "./Login.css";
import signupImg from "../../assets/signup_img.jpg";
import { FaUser } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import { FaEye } from "react-icons/fa6";
import { FaEyeSlash } from "react-icons/fa6";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("Student");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const url = import.meta.env.VITE_BACKEND_URL;

  function emailLoginBtnHandler(e) {
    e.preventDefault();
    toast.loading("Loading...");
    axios
      .post(
        `${url}/login`,
        { email, password, userType },
        { withCredentials: true }
      )
      .then((res) => {
        if (res?.data?.msg === "OK") {
          toast.remove();
          toast.success("Login Successful!");
          navigate("/");
        } else {
          toast.remove();
          toast.error("Try Again!!");
        }
      })
      .catch((err) => {
        console.log(err);
        toast.remove();
        let errMsg = err?.response?.data?.message || "Something went wrong!!";
        toast.error(errMsg);
      });
  }

  return (
    <div className="Login">
      <h2>Welcome Back!!</h2>
      <div className="Login-container">
        <img src={signupImg} alt="" />
        <form className="Login-form" onSubmit={(e) => emailLoginBtnHandler(e)}>
          <div className="Login-userType">Login as *: </div>
          <div className="Login-btn-container">
            <div
              onClick={() => setUserType("Student")}
              className={
                userType === "Student"
                  ? "selectedUserType"
                  : "nonSelectedUserType"
              }
            >
              Student
            </div>

            <div
              onClick={() => setUserType("Teacher")}
              className={
                userType === "Teacher"
                  ? "selectedUserType"
                  : "nonSelectedUserType"
              }
            >
              Teacher
            </div>

            <div
              onClick={() => setUserType("Principal")}
              className={
                userType === "Principal"
                  ? "selectedUserType"
                  : "nonSelectedUserType"
              }
            >
              Principal
            </div>
          </div>

          <div className="Login-form-inputElement" id="login-username">
            <FaUser className="Login-form-inputElement-icon" />
            <input
              type="text"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-mail*"
              required
            />
          </div>

          <div className="Login-form-inputElement" id="login-pass">
            <FaLock className="Login-form-inputElement-icon" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password*"
              required
            />
            {showPassword ? (
              <FaEyeSlash
                onClick={() => setShowPassword(!showPassword)}
                className="Login-form-inputElement-icon"
              />
            ) : (
              <FaEye
                onClick={() => setShowPassword(!showPassword)}
                className="Login-form-inputElement-icon"
              />
            )}
          </div>

          <button type="submit" className="Login-submit-btn">
            Login Now
          </button>
        </form>
      </div>
    </div>
  );
}
