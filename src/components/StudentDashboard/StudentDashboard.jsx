import React, { useEffect, useState } from "react";
import "./StudentDashboard.css";
import axios from "axios";
import toast from "react-hot-toast";
import { NavLink, useNavigate } from "react-router-dom";
import Loader from "../Loader/Loader";
import UserDataRow from "../UserDataRow/UserDataRow";

export default function StudentDashboard() {
  const [students, setStudents] = useState([]);
  const [student, setStudent] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const url = import.meta.env.VITE_BACKEND_URL;

  async function fetchData(x) {
    setLoading(true);
    axios
      .get(`${url}/fetchall/Student`, { withCredentials: true })
      .then((res) => {
        if (res?.data?.msg === "OK") {
          x = x || student?.assignedClass?._id;
          setStudents(res?.data?.users?.filter((s) => s?.assignedClass === x));
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

  async function fetchStudentData() {
    await axios
      .get(`${url}/fetch/currUser`, { withCredentials: true })
      .then((res) => {
        if (res?.data?.msg === "OK") {
          setStudent(res?.data?.user);
          fetchData(res?.data?.user?.assignedClass?._id);
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
    fetchStudentData();
  }, []);

  return (
    <div className="StudentDashboard">
      <div className="principal-links-container">
        <NavLink to="#">See Time Table</NavLink>
      </div>
      <div className="teacher-class-details">
        <h2>{student?.assignedClass?.name || "No class assigned yet."}</h2>
        <div className="teacher-class-schedule-container">
          {student?.assignedClass?.schedule.map((x) => {
            return (
              <div key={x._id} className="teacher-class-schedule">
                <div>{x?.day}</div>
                <div>{x?.startTime}</div>
                <div>{x?.endTime}</div>
              </div>
            );
          })}
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div>
          <h2> List of Students of your class: </h2>
          {students.length === 0 ? (
            <h2 style={{ textAlign: "center" }}>No Students Found!!</h2>
          ) : (
            <div className="user-details-container">
              <div className="user-details-heading">
                <div>Name</div>
                <div>Email</div>
              </div>
              {students.map((s) => {
                return (
                  <UserDataRow
                    key={s._id}
                    data={s}
                    fetchData={fetchData}
                    category="Student"
                  />
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
