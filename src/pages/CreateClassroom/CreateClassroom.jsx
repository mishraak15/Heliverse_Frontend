import axios from "axios";
import "./CreateClassroom.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ClassInput from "../../components/ClassInput/ClassInput";
import Loader from "../../components/Loader/Loader";
import { userCheck } from "../../assets/script";

export default function CreateClassroom() {
  const [loading, setLoading] = useState(true);
  const [selectedDays, setSelectedDays] = useState([]);
  const [className, setClassName] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [assignedTeacher, setAssignedTeacher] = useState("");
  const navigate = useNavigate();
  const url = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    async function checkUserType() {
      const userType = await userCheck(navigate);
      if (userType !== "Principal") {
        toast.error("Action Restricted!!");
        navigate("/");
      }
    }
    checkUserType();
    fetchData();
  }, []);

  let days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  function formSubmitHandler(e) {
    e.preventDefault();
    let flag = 0;

    if (selectedDays.length === 0) {
      flag = 1;
      return toast.error("Select atleat one day in a week");
    }

    selectedDays.forEach((slot) => {
      if (slot?.startTime > slot?.endTime) {
        flag = 1;
        return toast.error("Start time should be less than end time.");
      }
    });

    if (className.trim() === "") {
      flag = 1;
      return toast.error("Name cann't be empty!!");
    }

    if (flag === 0) {
      setLoading(true);
      axios
        .post(
          `${url}/createClassroom`,
          { className, selectedDays, assignedTeacher },
          { withCredentials: true }
        )
        .then((res) => {
          if (res?.data?.msg === "OK") {
            toast.success("Classroom created Successfully!!");
            setLoading(false);
            navigate("/");
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
  }

  function fetchData() {
    axios
      .get(`${url}/fetchall/Teacher`, { withCredentials: true })
      .then((res) => {
        if (res?.data?.msg === "OK") {
          setTeachers(
            res?.data?.users.filter(
              (t) => !t?.assignedClass || t?.assignedClass === ""
            )
          );
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

  return !loading ? (
    <form onSubmit={(e) => formSubmitHandler(e)} className="CreateClassroom">
      <input
        name="name"
        type="text"
        placeholder="Name of class*"
        onChange={(e) => setClassName(e.target.value)}
        required
      />
      <div className="classroom-inp-container">
        <h2>Select Days of Class:</h2>
        {days.map((d) => {
          return (
            <ClassInput
              key={d}
              day={d}
              setSelectedDays={setSelectedDays}
              selectedDays={selectedDays}
            />
          );
        })}
      </div>

      <div className="classroom-teacher-container">
        <h2>Select Teacher for the class: </h2>
        <select
          name="teacher"
          onChange={(e) => setAssignedTeacher(e.target.value)}
          defaultValue="*"
        >
          {teachers.length === 0 ? (
            <option value="*" disabled>
              All teachers are busy
            </option>
          ) : (
            <option value="*" disabled>
              Select a teacher for the class
            </option>
          )}
          {teachers.map((t) => {
            return (
              <option key={t._id} value={t?._id}>
                {t?.name || t?.email}
              </option>
            );
          })}
        </select>
      </div>

      <button>Create Class</button>
    </form>
  ) : (
    <Loader />
  );
}
