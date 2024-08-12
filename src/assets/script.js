import axios from "axios";
import toast from "react-hot-toast";

export function phaseOfDay(setPhase) {
  let time = new Date(Date.now()).getHours();
  if (time >= 4 && time <= 10) {
    setPhase("Morning");
  } else if (time > 10 && time <= 16) {
    setPhase("Afternoon");
  } else {
    setPhase("Evening");
  }
}

export async function userCheck(navigate) {
  const url = import.meta.env.VITE_BACKEND_URL;
  try {
    const res = await axios.get(`${url}`, { withCredentials: true });
    if (res?.data?.msg === "OK") {
      return res?.data?.userType;
    }
    return null;
  } catch (err) {
    console.log(err);
    let errMsg = err?.response?.data?.message || "Something went wrong!!";
    if (errMsg === "You are not logged in") {
      navigate("/login");
    }
    toast.error(errMsg);
  }
}
