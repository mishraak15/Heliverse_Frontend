import React from "react";
import "./Error.css";
import { NavLink } from "react-router-dom";

export default function Error() {
  return (
    <div className="Error">
      <h3>Something Went wrong!!</h3>
      <div>
        <span>GO to Home Page</span>
        <NavLink to="/">
          <button>Home</button>
        </NavLink>
      </div>
    </div>
  );
}
