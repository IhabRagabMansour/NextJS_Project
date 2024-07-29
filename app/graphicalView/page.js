"use client"
import React, { useState, useEffect } from 'react';
import { httpGet } from '../api/requestUtils';
import Header from '../components/graphicalView/Header';
import Body from '../components/graphicalView/Body';
import '../globals.css'
import * as apiUrls from '../api/apiUrls';
import LoadingScreen from '../components/Report/LoadingScreen';
import DataNotFound from '../components/Report/DataNotFound';

function GraphicalView() {
  const [initialData, setInitialData] = useState([]);
  const [hostList, setHostList] = useState(null);
  const [backendError, setBackendError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [haveData, setHaveData] = useState(false);
  const [hostA, setHostA] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      // Only show loading spinner on initial load
      if (!haveData) setLoading(true);

      try {
        setBackendError(null); // Clear any previous backend error
        const res = await httpGet(apiUrls.HOSTS_SHORT_ENDPOINT);
        setInitialData(res);
        setHostList(res); // Ensure this is correct. If res.data contains a 'hosts' property, use res.data.hosts instead.

        const A = await httpGet(apiUrls.Host_A);
        setHostA(A);
        // setHostA({ "Process-A-name": "A", "Process-A-status": "Running", "lost-connections": [1, 2, 3, 4] })
        console.log(A, 'process A');

        setBackendError(null); // Clear any previous backend error
        if (!haveData) setHaveData(true); // Data has been fetched for the first time

      } catch (error) {
        setBackendError(error.message || 'Error fetching data from the backend');
        // if there is an error clear the data
        setHostList(null);
      } finally {
        setLoading(false); // Hide loading spinner after data is fetched or in case of an error
      }
    };

    // Call the fetchData function immediately to fetch data when the component mounts
    fetchData();

    // Set up the interval to fetch data every 5 seconds
    const intervalId = setInterval(fetchData, 5000);

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [haveData]); // Adding haveData to the dependency array

  return (
    <div className='font-sans leading-6 m-0 p-0 w-full'>
      <Header />
      {hostList && !loading && <Body GraphicalViewData={hostList} hostA={hostA} />}
      {!haveData && loading && <LoadingScreen />}
      {backendError && <DataNotFound msg={backendError} />}
    </div>
  );
}

export default GraphicalView;