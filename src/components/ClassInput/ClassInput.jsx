import React from "react";
import "./ClassInput.css";
import toast from "react-hot-toast";

export default function ClassInput({ day, selectedDays, setSelectedDays }) {
  function timeChangeHandler(e) {
    let hrs = e.target.value.substr(0, 2);

    if (hrs < 7 || hrs > 18) {
      toast.error("Invalid time!! Choose between 8 and 18");
      e.target.style.border = "1px solid red";
    } else {
      e.target.style.border = "none";
      if (e.target.name === "startTime")
        setSelectedDays((pre) =>
          pre.map((slot) =>
            slot.day === day ? { ...slot, startTime: e.target.value } : slot
          )
        );
      else
        setSelectedDays((pre) =>
          pre.map((slot) =>
            slot.day === day ? { ...slot, endTime: e.target.value } : slot
          )
        );
    }
  }

  function addDayHandler() {
    if (selectedDays?.some((x) => x?.day === day)) {
      setSelectedDays((pre) => pre.filter((slot) => slot.day !== day));
    } else {
      let d = { day, startTime: "09:00", endTime: "16:00" };
      setSelectedDays((pre) => [...pre, d]);
    }
  }
  
  return (
    <div className="ClassInput">
      <div
        className="classinp-day-abbr"
        onClick={() => addDayHandler()}
        style={
          selectedDays?.some((x) => x?.day === day)
            ? { backgroundColor: "#b1b1b1" }
            : { backgroundColor: "" }
        }
      >
        {day[0]}
      </div>
      <span>{day}</span>
      {selectedDays?.some((x) => x?.day === day) && (
        <>
          <input
            type="time"
            name="startTime"
            min="07:00"
            max="17:00"
            defaultValue="09:00"
            onChange={(e) => timeChangeHandler(e)}
            required
          />
          <input
            type="time"
            name="endTime"
            min="08:00"
            max="18:00"
            defaultValue="16:00"
            onChange={(e) => timeChangeHandler(e)}
            required
          />
        </>
      )}
    </div>
  );
}
