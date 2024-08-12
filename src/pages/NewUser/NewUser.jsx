import React, { useEffect, useState } from "react";
import "./NewUser.css";
import { useNavigate } from "react-router-dom";
import { MdAlternateEmail } from "react-icons/md";
import { FaLock, FaUser } from "react-icons/fa";
import { FaEye } from "react-icons/fa6";
import { FaEyeSlash } from "react-icons/fa6";
import { userCheck } from "../../assets/script";
import toast from "react-hot-toast";
import axios from "axios";
import Loader from "../../components/Loader/Loader";

export default function NewUser({ newUserType }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    assignedClass: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [classes, setClasses] = useState([]);
  const navigate = useNavigate();
  const url = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    async function checkUserType() {
      const userType = await userCheck(navigate);
      if (
        userType === "Student" ||
        (userType === "Teacher" && newUserType !== "Student")
      ) {
        toast.error("Action Restricted!!");
        return navigate("/");
      }
    }
    checkUserType();
    fetchClasses();
  }, []);

  function fetchClasses() {
    axios
      .get(`${url}/fetch/classes`, { withCredentials: true })
      .then((res) => {
        if (res?.data?.msg === "OK") {
          if (newUserType === "Teacher") {
            setClasses(
              res?.data?.classes.filter((c) => !c.teacher || c.teacher === "")
            );
          } else {
            setClasses(res?.data?.classes);
          }
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        let errMsg = err?.response?.data?.message || "Something went wrong!!";
        if (errMsg === "You are not logged in") {
          navigate("/login");
        }
        toast.error(errMsg);
      });
  }

  function inputChangeHandler(e) {
    setFormData((pre) => {
      return { ...pre, [e.target.name]: e.target.value };
    });
  }

  function formSubmitHandler(e) {
    e.preventDefault();

    if (formData.password.length <= 5) {
      return toast.error("Password should be greater that 5 characters !!");
    }

    if (formData?.password !== formData?.confirmPassword) {
      return toast.error("Password and Confirm Password should be same!!");
    }

    toast.loading("Loading...");
    axios
      .post(
        `${url}/add/new/${newUserType}`,
        { formData },
        { withCredentials: true }
      )
      .then((res) => {
        toast.remove();
        if (res?.data?.msg === "OK") {
          toast.success(`${newUserType} Added Successfully!!`);
          navigate("/");
        }
      })
      .catch((err) => {
        console.log(err);
        toast.remove();
        let errMsg = err?.response?.data?.message || "Something went wrong!!";
        if (errMsg === "You are not logged in") {
          navigate("/login");
        }
        toast.error(errMsg);
      });
  }

  return loading ? (
    <Loader />
  ) : (
    <form className="NewUser" onSubmit={(e) => formSubmitHandler(e)}>
      <h2>ADD user as {newUserType}</h2>
      <div className="Login-form-inputElement">
        <FaUser className="Login-form-inputElement-icon" />
        <input
          type="text"
          name="name"
          onChange={(e) => inputChangeHandler(e)}
          placeholder="Name"
        />
      </div>

      <div className="Login-form-inputElement">
        <MdAlternateEmail className="Login-form-inputElement-icon" />
        <input
          type="email"
          name="email"
          onChange={(e) => inputChangeHandler(e)}
          placeholder="E-mail*"
          required
        />
      </div>

      <div className="Login-form-inputElement">
        <FaLock className="Login-form-inputElement-icon" />
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          onChange={(e) => inputChangeHandler(e)}
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

      <div className="Login-form-inputElement">
        <FaLock className="Login-form-inputElement-icon" />
        <input
          type={showConfirmPassword ? "text" : "password"}
          name="confirmPassword"
          onChange={(e) => inputChangeHandler(e)}
          placeholder="Confirm Password*"
          required
        />
        {showConfirmPassword ? (
          <FaEyeSlash
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="Login-form-inputElement-icon"
          />
        ) : (
          <FaEye
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="Login-form-inputElement-icon"
          />
        )}
      </div>

      <div className="classroom-teacher-container">
        <h2>Select Class for {newUserType}: </h2>
        <select
          name="assignedClass"
          onChange={(e) => inputChangeHandler(e)}
          defaultValue="*"
          required
        >
          {classes.length === 0 ? (
            <option value="*" disabled>
              No class is vacant
            </option>
          ) : (
            <option value="*" disabled>
              Select a class
            </option>
          )}
          {classes.map((t) => {
            return (
              <option key={t._id} value={t?._id}>
                {t?.name}
              </option>
            );
          })}
        </select>
      </div>

      <button>Add {newUserType}</button>
    </form>
  );
}
