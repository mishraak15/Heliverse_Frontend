import React, { useEffect, useState } from "react";
import "./EditUser.css";
import { useNavigate, useParams } from "react-router-dom";
import { MdAlternateEmail } from "react-icons/md";
import { FaLock, FaUser } from "react-icons/fa";
import { FaEye } from "react-icons/fa6";
import { FaEyeSlash } from "react-icons/fa6";
import { userCheck } from "../../assets/script";
import toast from "react-hot-toast";
import axios from "axios";
import Loader from "../../components/Loader/Loader";

export default function EditUser() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    newPassword: "",
    assignedClass: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [classes, setClasses] = useState([]);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const url = import.meta.env.VITE_BACKEND_URL;
  const { newUserType, userid } = useParams();

  function fetchUserData() {
    axios
      .get(`${url}/${userid}`, { withCredentials: true })
      .then((res) => {
        if (res?.data?.msg === "OK") {
          setFormData({
            name: res?.data?.userData?.name,
            email: res?.data?.userData?.email,
            password: "",
            newPassword: "",
            assignedClass: res?.data?.userData?.assignedClass?._id || "",
          });
          if (newUserType === "Teacher" && res?.data?.userData?.assignedClass) {
            setClasses((pre) => [...pre, res?.data?.userData?.assignedClass]);
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

  useEffect(() => {
    async function checkUserType() {
      const userType = await userCheck(navigate);
      if (
        userType === "Student" ||
        (userType === "Teacher" && newUserType !== "Student")
      ) {
        toast.error("Action Restricted!!");
        navigate("/");
      }
    }
    checkUserType().then(() => {
      fetchUserData();
    });

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

    fetchClasses();
  }, []);

  function inputChangeHandler(e) {
    setFormData((pre) => {
      return { ...pre, [e.target.name]: e.target.value };
    });
  }

  function formSubmitHandler(e) {
    e.preventDefault();
    toast.loading("Loading...");
    axios
      .patch(`${url}/${userid}`, { formData }, { withCredentials: true })
      .then((res) => {
        toast.remove();
        if (res?.data?.msg === "OK") {
          toast.success(`${newUserType} Edited Successfully!!`);
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
    <form className="EditUser" onSubmit={(e) => formSubmitHandler(e)}>
      <h2>Edit {newUserType}</h2>
      <div className="Login-form-inputElement">
        <FaUser className="Login-form-inputElement-icon" />
        <input
          type="text"
          name="name"
          onChange={(e) => inputChangeHandler(e)}
          placeholder="Name"
          defaultValue={formData?.name}
        />
      </div>

      <div className="Login-form-inputElement">
        <MdAlternateEmail className="Login-form-inputElement-icon" />
        <input
          type="email"
          name="email"
          onChange={(e) => inputChangeHandler(e)}
          placeholder="E-mail*"
          defaultValue={formData?.email}
        />
      </div>

      {changePassword ? (
        <>
          <div className="Login-form-inputElement">
            <FaLock className="Login-form-inputElement-icon" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              onChange={(e) => inputChangeHandler(e)}
              placeholder="Current Password*"
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
              type={showNewPassword ? "text" : "password"}
              name="newPassword"
              onChange={(e) => inputChangeHandler(e)}
              placeholder="New Password*"
            />
            {showNewPassword ? (
              <FaEyeSlash
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="Login-form-inputElement-icon"
              />
            ) : (
              <FaEye
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="Login-form-inputElement-icon"
              />
            )}
          </div>{" "}
        </>
      ) : (
        <button
          className="edit-change-pass-btn"
          onClick={() => setChangePassword(true)}
        >
          Want to change password?
        </button>
      )}

      <div className="classroom-teacher-container">
        <h2>Select Class: </h2>
        <select
          name="assignedClass"
          onChange={(e) => inputChangeHandler(e)}
          value={formData?.assignedClass || "*"}
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

      <button className="Login-submit-btn" type="submit">
        Edit Details
      </button>
    </form>
  );
}
