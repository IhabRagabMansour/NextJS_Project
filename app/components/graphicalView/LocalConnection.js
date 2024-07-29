import React from "react";
import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import SocketsData from "./SocketsData";

function LocalConnection({ connection }) {

  const [localAppearance, setLocalAppearance] = useState(false);
  const [listeningB, setListeningB] = useState(false);
  const [listeningC, setListeningC] = useState(false);

  return (
    <div>
      <ul className="pl-0 ml-12 list-disc">
        <li className="mb-1.5">Time of last update: {connection["time-stamp"]}</li>
        <li className="mb-1.5">Pair ID: {connection["pairID"]}</li>
        <li className="mb-1.5">Process B Status: <span
          className={
            connection["Process-B-status"] === "Running"
              ? "text-green-500" : connection["Process-B-status"] === "Sleeping" ? "text-yellow-500"
                : "text-red-500"
          }
        >
          {connection["Process-B-status"]}
        </span></li>
        <li className="mb-1.5">Process C Status: <span
          className={
            connection["Process-C-status"] === "Running"
              ? "text-green-500" : connection["Process-C-status"] === "Sleeping" ? "text-yellow-500"
                : "text-red-500"

          }
        >
          {connection["Process-C-status"]}
        </span></li>
        <li className="mb-1.5">Redis Connection port: {connection["redis-connection"] ? connection["redis-connection"]["port"] : "No connection"}</li>
        {connection["redis-connection"] && <li className="mb-1.5" >Redis Connection status: <span className={`${connection["redis-connection"]["status"] === "ESTAB" ? 'text-green-700' : 'text-red-600'}`}> {connection["redis-connection"]["status"]}</span></li>}
      </ul>

      {/* the listening ports of b*/}

      <ul className="pl-0 ml-12 list-disc">
        <li onClick={() => setListeningB(a => !a)} className=" font-bold mb-2.5 flex items-center p-2 border border-gray-300 rounded-lg ">B Listening Ports
          <FontAwesomeIcon className={`transition-transform duration-300 ml-40 ${listeningB && "rotate-90  "}`} icon={faChevronRight} />
        </li>

        {listeningB && connection["list-of-listening-ports-b"].map((port, index) => (
          <li key={index} className="mb-1.5 list-none">
            <p className="mb-2.5 flex items-center p-1  text-sm ">
              port : {port}
            </p>
          </li>
        ))}
      </ul>

      {/* the listening ports of c */}
      <ul className="pl-0 ml-12 list-disc">
        <li onClick={() => setListeningC(a => !a)} className=" font-bold mb-2.5 flex items-center p-2 border border-gray-300 rounded-lg ">C Listening Ports
          <FontAwesomeIcon className={`transition-transform duration-300 ml-40 ${listeningC && "rotate-90  "}`} icon={faChevronRight} />
        </li>

        {listeningC && connection["list-of-listening-ports-c"].map((port, index) => (
          <li key={index} className="mb-1.5 list-none">
            <p className="mb-2.5 flex items-center p-2  text-sm ">
              port : {port}
            </p>
          </li>
        ))}
      </ul>

      <ul className="pl-0 ml-12 list-disc">
        <li onClick={() => setLocalAppearance(a => !a)} className=" font-bold mb-2.5 flex items-center p-2 border border-gray-300 rounded-lg ">Local Connections
          <FontAwesomeIcon className={`transition-transform duration-300 ml-36 ${localAppearance && "rotate-90  "}`} icon={faChevronRight} />
        </li>
        {localAppearance && connection["List-Of-Local-Connections"].map((remoteConnection, index) => (
          <li key={index} className="mb-1.5 list-none">
            <SocketsData remoteConnection={remoteConnection} />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default LocalConnection
