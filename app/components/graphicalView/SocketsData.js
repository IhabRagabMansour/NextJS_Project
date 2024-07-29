
import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useState } from "react";


function SocketsData({ remoteConnection }) {
  const [appearance, setAppearance] = useState(false);

  function toggleAppearance() {
    setAppearance(a => !a);
  }
  return (
    <div className="mb-5 ">

      {(remoteConnection["client-process-state"] !== "CLOSED" && remoteConnection["server-process-state"] !== "CLOSED") ? (
        <p onClick={toggleAppearance} className="mb-2.5 flex items-center p-3.5 border text-green-600 border-gray-300 rounded-lg text-sm ">
          {`socket between local port ${remoteConnection["client-port"]} and peer port ${remoteConnection["server-port"]}`}
          <FontAwesomeIcon className={`transition-transform duration-300 ml-5 mr-1 ${appearance && "rotate-90"}`} icon={faChevronRight} />
        </p>
      ) : (
        <p onClick={toggleAppearance} className="mb-2.5 flex items-center text-red-500 p-3.5 border border-gray-300 rounded-lg text-sm ">
          {`socket between local port ${remoteConnection["client-port"]} and peer port ${remoteConnection["server-port"]}`}
          <FontAwesomeIcon className={`transition-transform duration-300 ml-5 mr-1 ${appearance && "rotate-90"}`} icon={faChevronRight} />
        </p>
      )}

      {appearance &&
        <ul className="pl-4 ml-6 list-disc">
          {/* <br /> */}
          <li>Client Process: {remoteConnection["client-process"]}</li>
          <li>Client State: {remoteConnection["client-process-state"]}</li>
          <li>Maximum Data Rate: {remoteConnection["data-rate"]}</li>
          <li>Client IP: {remoteConnection["client-ip-address"]}</li>
          <li>Client Port: {remoteConnection["client-port"]}</li>
          <li>Server IP: {remoteConnection["server-ip-address"]}</li>
          <li>Server Port: {remoteConnection["server-port"]}</li>
          <li>Server Process: {remoteConnection["server-process"]}</li>
          <li>Server State: {remoteConnection["server-process-state"]}</li>
        </ul>
      }
    </div>
  )
}

export default SocketsData
