import React from "react";
import "./Navbar.css";
import logo from "../../assets/logo.jpg";
import { Link, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa6";
import { FiLogOut } from "react-icons/fi";
import axios from "axios";
import toast from "react-hot-toast";

export default function Navbar() {
  const navigate = useNavigate();
  const url = import.meta.env.VITE_BACKEND_URL;

  function logoutClickHandler() {
    axios
      .get(`${url}/logout`, { withCredentials: true })
      .then((res) => {
        if (res?.data?.msg === "OK") {
          navigate("/login");
        }
      })
      .catch((err) => {
        console.log(err);
        let errMsg = err?.response?.data?.message || "Something went wrong!!";
        toast.error(errMsg);
        navigate("/login");
      });
  }
  return (
    <nav className="Navbar">
      <Link to="/" className="nav-left">
        <img src={logo} alt="logo..." />
        <span>Heliverse Public School</span>
      </Link>

      <div className="nav-right">
        <abbr title="User">
          <FaUser className="nav-right-icons" />
        </abbr>
        <abbr title="Logout" onClick={() => logoutClickHandler()}>
          <FiLogOut className="nav-right-icons" />
        </abbr>
      </div>
    </nav>
  );
}
