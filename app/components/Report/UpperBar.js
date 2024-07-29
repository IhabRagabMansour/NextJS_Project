import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileArrowDown } from "@fortawesome/free-solid-svg-icons";
import CommonUpperNavBar from "../Common/CommonUpperNavBar";
import DateTimeInput from "./DateTimeInput";

import React from "react";

const UpperBar = (props) => {
  return (
    <header className="w-full bg-blue-400 p-2.5">
      <div className="w-full flex">
        <CommonUpperNavBar active="report" />
        <div className="flex border-l-4 pl-4 w-full justify-between items-center">
          {props.dataIsAvailable ? (
            props.isLoading ? (
              <span className="font-bold">Generating PDF...</span>
            ) : (
              <span className="mr-4 cursor-pointer" onClick={props.onDownload}>
                <FontAwesomeIcon icon={faFileArrowDown} size="2x" />
              </span>
            )
          ) : null}
          <div className="flex flex-grow justify-end gap-10 mr-2">
            <DateTimeInput
              startDate={props.startDate}
              endDate={props.endDate}
              setInterval={props.setInterval}
              setUpdateData={props.setUpdateData}
              updateData={props.updateData}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default UpperBar;
