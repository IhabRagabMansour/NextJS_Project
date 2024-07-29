import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useState } from "react";
import SocketsData from "./SocketsData";



function RemoteConnections({ connection }) {
  const [appearance, setAppearance] = useState(false);
  const [remoteAppearance, setRemoteAppearance] = useState(false);

  function toggleAppearance() {
    setAppearance(a => !a);
  }
  return (
    <div className="mb-5 p-2.5">
      {connection["Process-B-status"] === "Running" ? (
        <h1 onClick={toggleAppearance} className="mb-2.5 flex items-center p-3.5 border text-lg text-green-600 border-gray-300 rounded-lg w-1/2">
          {connection["Process-B-name"]}
          <FontAwesomeIcon className={`transition-transform duration-300  ml-16 ${appearance && " rotate-90"}`} icon={faChevronRight} />
        </h1>
      ) : connection["Process-B-status"] === "Sleeping" ? (
        <h1 onClick={toggleAppearance} className="mb-2.5 flex items-center text-lg text-yellow-600 p-3.5 border border-gray-300 rounded-lg w-1/2">
          {connection["Process-B-name"]}
          <FontAwesomeIcon className={`transition-transform duration-300  ml-16 ${appearance && "rotate-90"}`} icon={faChevronRight} />
        </h1>
      ) : (
        <h1 onClick={toggleAppearance} className="mb-2.5 flex items-center text-lg text-red-500 p-3.5 border border-gray-300 rounded-lg w-1/2">
          {connection["Process-B-name"]}
          <FontAwesomeIcon className={`transition-transform duration-300  ml-16 ${appearance && "rotate-90"}`} icon={faChevronRight} />
        </h1>
      )}
      {appearance && (
        <div>
          <ul className="pl-0 ml-12 list-disc">
            <li className="mb-1.5">Time of last update: {connection["time-stamp"]}</li>
            <li className="mb-1.5">Status: <span
              className={
                connection["Process-B-status"] === "Running"
                  ? "text-green-500"
                  : connection["Process-B-status"] === "Sleeping"
                    ? "text-yellow-600"
                    : "text-red-500"
              }
            >
              {connection["Process-B-status"]}
            </span></li>
          </ul>

          <ul className="pl-0 ml-12 list-disc">
            <li onClick={() => setRemoteAppearance(a => !a)} className=" font-bold mb-2.5 flex items-center p-2 border border-gray-300 rounded-lg ">Remote Connections
              <FontAwesomeIcon className={`transition-transform duration-300 ml-28 ${remoteAppearance && "rotate-90  "}`} icon={faChevronRight} />
            </li>
            {remoteAppearance && connection["List-Of-Remote-Connections"].map((remoteConnection, index) => (
              <li key={index} className="mb-1.5 list-none">
                <SocketsData remoteConnection={remoteConnection} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default RemoteConnections
