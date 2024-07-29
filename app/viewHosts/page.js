"use client";
import React, { useState, useEffect } from "react";
import { httpGet, httpDelete } from '../api/requestUtils';
import * as apiUrls from '../api/apiUrls';
import CommonUpperNavBar from "../components/Common/CommonUpperNavBar";

const HostListPage = () => {
  const [initialData, setInitialData] = useState([]);
  const [hostList, setHostList] = useState(initialData.hosts);
  const [backendError, setBackendError] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await httpGet(apiUrls.HOSTS_SHORT_ENDPOINT);
        setInitialData(data);
        setHostList(data.hosts);
        setBackendError(null);
      } catch (error) {
        setBackendError('Error fetching data from the backend. Please try again later.');
      }
    };
    fetchData();
  }, []);

  const removeHost = (hostIP) => {
    httpDelete(apiUrls.REMOVE_PAIR_ENDPOINT, { params: hostIP })
      .then(() => {
        setHostList((prevHostList) =>
          prevHostList.filter((host) => host.hostIP !== hostIP)
        );
        setBackendError(null); // Clear any previous backend error
      })
      .catch((error) => {
        console.error("Error removing host:", error);
        // Handle error scenarios as needed
      });
  };

  return (
    <>
      <header className="w-full bg-blue-400 p-2.5 mb-6">
        <div className="w-full flex">
          <CommonUpperNavBar active='viewHosts' />
        </div>
      </header>
      <div className="text-center bg-white">
        <h2 className="text-2xl font-bold mb-4">Hosts List</h2>
        {backendError && (
          // Display an error message on the screen if there's a backend error
          <div className="text-red-500 mb-4">{backendError}</div>
        )}
        <div className="flex flex-wrap">
          {hostList && hostList.map((host) => (
            <div
              key={host.hostIP} // Use hostIP as a unique key
              className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 mb-6 p-4"
              style={{ color: "black", textAlign: "center" }}
            >
              <div className="border border-gray-300 rounded p-4 h-full">
                <p className="text-lg font-medium mb-2">
                  Hostname: {host.hostName}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  IP Address: {host.hostIP}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  Pair Count: {host.pairCount}
                </p>
                {/* Display other information or actions as needed */}
                <button
                  onClick={() => removeHost(host.hostIP)}
                  className="bg-blue-400 text-white px-4 py-2 rounded"
                >
                  Remove Host
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default HostListPage;
