import React, { useEffect, useState } from "react";
import "./PrincipalDashboard.css";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../Loader/Loader";
import UserDataRow from "../UserDataRow/UserDataRow";

export default function PrincipalDashboard() {
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listOf, setListOf] = useState("Student");
  const navigate = useNavigate();
  const url = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [listOf]);

  function fetchData() {
    axios
      .get(`${url}/fetchall/${listOf}`, { withCredentials: true })
      .then((res) => {
        if (res?.data?.msg === "OK") {
          if (listOf === "Student") {
            setStudents(res?.data?.users);
          } else {
            setTeachers(res?.data?.users);
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

  return (
    <div className="PrincipalDashboard">
      <div className="principal-links-container">
        <NavLink to="/user/teacher/add">Add New Teacher</NavLink>
        <NavLink to="/user/student/add">Add New Student</NavLink>
        <NavLink to="/createClassroom">Create a New Classroom</NavLink>
      </div>
      <div className="principal-list-opt-container">
        <div
          style={
            listOf === "Student"
              ? { backgroundColor: "#bdbdbd" }
              : { backgroundColor: "transparent" }
          }
          onClick={() => setListOf("Student")}
        >
          Students
        </div>
        <div
          style={
            listOf === "Teacher"
              ? { backgroundColor: "#bdbdbd" }
              : { backgroundColor: "transparent" }
          }
          onClick={() => setListOf("Teacher")}
        >
          Teachers
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div>
          <h2> List of {listOf}s: </h2>
          {listOf === "Student" ? (
            students.length === 0 ? (
              <h2 style={{ textAlign: "center" }}>No Students Found!!</h2>
            ) : (
              <div className="user-details-container">
                <div className="user-details-heading">
                  <div>Name</div>
                  <div>Email</div>
                  <div>Edit</div>
                  <div>Delete</div>
                </div>
                {students.map((s) => {
                  return (
                    <UserDataRow key={s._id} data={s} fetchData={fetchData} />
                  );
                })}
              </div>
            )
          ) : teachers.length === 0 ? (
            <h2 style={{ textAlign: "center" }}>No Teachers Found!!</h2>
          ) : (
            <div className="user-details-container">
              <div className="user-details-heading">
                <div>Name</div>
                <div>Email</div>
                <div>Edit</div>
                <div>Delete</div>
              </div>
              {teachers.map((t) => {
                return (
                  <UserDataRow key={t._id} data={t} fetchData={fetchData} />
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
