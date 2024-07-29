"use client";
import React, { useState, useEffect } from "react";
import { httpGet, httpDelete } from '../api/requestUtils';
import * as apiUrls from '../api/apiUrls';
import CommonUpperNavBar from "../components/Common/CommonUpperNavBar";

const PairListPage = () => {
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

  const removePair = async (hostIP, pairID) => {
    try {
      await httpDelete(apiUrls.REMOVE_PAIR_ENDPOINT, { params: { hostIP, pairID } });
      setHostList((prevHostList) =>
        prevHostList.map((host) => {
          if (host.hostIP === hostIP) {
            host.pairs = host.pairs.filter((pair) => pair.pairID !== pairID);
          }
          return host;
        })
      );
      setBackendError(null);
    } catch (error) {
      setBackendError('Error removing pair. Please try again later.');
    }
  };

  return (
    <>
      <header className="w-full bg-blue-400 p-2.5 mb-6">
        <div className="w-full flex">
          <CommonUpperNavBar active='viewPairs' />
        </div>
      </header>
      <div className="text-center bg-white">
        <h2 className="text-2xl font-bold mb-4">Pairs List</h2>
        {backendError && (
          // Display an error message on the screen if there's a backend error
          <div className="text-red-500 mb-4">{backendError}</div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {hostList && hostList.map((host, hostIndex) => (
            <div key={host.hostIP} className="p-4">
              {host.pairs.map((pair) => (
                <div key={pair.pairID} className="border border-gray-300 rounded p-4 mb-4" style={{ color: "black" }}>
                  <p className="text-lg font-medium mb-2">Host: {host.hostName}</p>
                  {/* Display other host details as needed */}
                  <p className="text-sm text-gray-600 mb-2">IP Address: {host.hostIP}</p>
                  {/* Display other pair details as needed */}
                  <p className="text-sm text-gray-600 mb-2">Process-B Name: {pair["Process-B-name"]}</p>
                  <p className="text-sm text-gray-600 mb-2">Process-B Status: {pair["Process-B-status"]}</p>
                  <p className="text-sm text-gray-600 mb-2">Process-C Name: {pair["Process-C-name"]}</p>
                  <p className="text-sm text-gray-600 mb-2">
                    Process-C Status:{" "}
                    <span className={`${pair["Process-C-status"] === "Running" ? "green" : pair["Process-C-status"] === "Sleeping" ? "text-yellow-400" : "red"}`}>
                      {pair["Process-C-status"]}
                    </span>
                  </p>
                  <button
                    onClick={() => removePair(hostIndex, pair.pairID)}
                    className="bg-blue-400 text-white px-4 py-2 rounded"
                  >
                    Remove Pair
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default PairListPage;
