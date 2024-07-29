import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function DateTimeInput({ startDate, endDate, setInterval, setUpdateData, updateData }) {

  function areDatesEqualWithoutTime(date1, date2) {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  }
  return (
    <div className="flex justify-end gap-10 mr-2 items-center">
    <span className="font-bold">Start Time</span>
      <DatePicker
        className="rounded p-2 border-black border-1 font-semibold"
        selected={startDate}
        onChange={(date) => {setInterval({"startTimeStamp": date, "endTimeStamp": endDate}); setUpdateData(!updateData);}}
        selectsStart
        showTimeSelect
        startDate={startDate}
        dateFormat="d-M-yyyy h:mm aa"
        endDate={endDate}
        minTime={
            new Date().setHours(0, 0, 0)
          }
        maxTime={areDatesEqualWithoutTime(startDate, endDate)
            ? endDate
            : new Date().setHours(23, 59, 59, 999)}
      />
      <span className="font-bold">End Time</span>
      <DatePicker
        className="rounded p-2 border-black border-1 font-semibold" 
        selected={endDate}
        onChange={(date) => {setInterval({"startTimeStamp": startDate, "endTimeStamp": date}); setUpdateData(!updateData); }}
        selectsEnd
        showTimeSelect
        startDate={startDate}
        endDate={endDate}
        dateFormat="d-M-yyyy h:mm aa"
        minDate={startDate}
        minTime={
            areDatesEqualWithoutTime(startDate, endDate)
              ? startDate
              : new Date().setHours(0, 0, 0)
          }
        maxTime={new Date().setHours(23, 59, 59, 999)}
      />
    </div>
  );
}

export default DateTimeInput;
