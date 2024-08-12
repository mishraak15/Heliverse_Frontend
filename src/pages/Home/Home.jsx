import React, { useEffect, useState } from "react";
import "./Home.css";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../../components/Loader/Loader";
import { useNavigate } from "react-router-dom";
import PrincipalDashboard from "../../components/PrincipalDashboard/PrincipalDashboard";
import TeacherDashboard from "../../components/TeacherDashboard/TeacherDashboard";
import StudentDashboard from "../../components/StudentDashboard/StudentDashboard";
import Error from "../Error/Error";
import Navbar from "../../components/Navbar/Navbar";
import { phaseOfDay } from "../../assets/script";

export default function Home() {
  const [userType, setUserType] = useState("");
  const [phase, setPhase] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const url = import.meta.env.VITE_BACKEND_URL;

  setInterval(() => {
    if (window.scrollY > 60) {
      document.querySelector(".Navbar")?.classList?.add("nav-extra");
    } else {
      document.querySelector(".Navbar")?.classList?.remove("nav-extra");
    }
  }, 300);

  useEffect(() => {
    axios
      .get(`${url}`, { withCredentials: true })
      .then((res) => {
        if (res?.data?.msg === "OK") {
          setUserType(res?.data?.userType);
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
    phaseOfDay(setPhase);
  }, []);

  return loading ? (
    <div className="Home">
      <Loader />
    </div>
  ) : (
    <div className="Home">
      <h2 id="greeting">
        Good {phase}, {userType}
      </h2>
      {userType === "Principal" ? (
        <PrincipalDashboard />
      ) : userType === "Teacher" ? (
        <TeacherDashboard />
      ) : userType === "Student" ? (
        <StudentDashboard />
      ) : (
        <Error />
      )}
    </div>
  );
}
