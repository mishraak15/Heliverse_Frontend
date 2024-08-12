import React from "react";
import "./UserDataRow.css";
import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function UserDataRow({ data, fetchData, category = "Adult" }) {
  const url = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  function deleteUserClickHanlder() {
    axios
      .delete(`${url}/${data._id}`, { withCredentials: true })
      .then((res) => {
        if (res?.data?.msg === "OK") {
          toast.success(`${data.userType} deleted successfully`);
          fetchData();
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
    <div className="UserDataRow">
      <div>{data?.name || "N/A"}</div>
      <div>{data?.email}</div>
      {!category === "Student" && (
        <>
          <div className="userRow-btn-container">
            <FiEdit
              className="userRow-icons"
              onClick={() =>
                navigate(`/user/${data?.userType}/${data?._id}/edit`)
              }
            />
          </div>
          <div className="userRow-btn-container">
            <MdDelete
              className="userRow-icons"
              color="red"
              onClick={() => deleteUserClickHanlder()}
            />
          </div>
        </>
      )}
    </div>
  );
}
