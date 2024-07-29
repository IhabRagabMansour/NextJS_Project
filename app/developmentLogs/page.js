"use client"
import React, { useState, useEffect, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CommonUpperNavBar from "../components/Common/CommonUpperNavBar";
import { httpGet } from '../api/requestUtils';
import * as apiUrls from '../api/apiUrls';
import localforage from 'localforage';
import LoadingScreen from '../components/Report/LoadingScreen';


const DevelopmentLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const logsContainerRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await httpGet(apiUrls.LOGS_ENDPOINT);
        const logArray = Object.values(res); // Convert object values to an array
        const newLogs = logArray.map((log, index) => parseLog(log, index));

        // Get existing logs from localforage
        const existingLogs = await localforage.getItem('developmentLogs') || [];

        // Combine existing logs with new logs
        const combinedLogs = [...existingLogs, ...newLogs];

        // Store combined logs in localforage
        await localforage.setItem('developmentLogs', combinedLogs);

        setLogs(combinedLogs);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching logs:', error);
        toast.error('Error fetching logs');
      }
    };

    // Fetch initial data
    fetchData();

    // Set up interval to fetch data every 2 seconds
    const intervalId = setInterval(fetchData, 2000);

    // Cleanup function
    return () => clearInterval(intervalId);
  }, []);

  // Function to parse log entry and apply styles
  const parseLog = (log, index) => {
    const regex = /\[(.*?)\] (.*)/;
    const match = regex.exec(log);
    if (match) {
      const timestamp = match[1];
      const message = match[2];
      return { timestamp, message };
    } else {
      return { timestamp: 'Invalid Timestamp', message: `Invalid log entry: ${log}` };
    }
  };

  // Function to scroll down to the bottom of the page
  const scrollToBottom = () => {
    logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
  };

  return (
    <>
      <header className="w-full bg-blue-400 p-2.5 mb-6">
        <div className="w-full flex">
          <CommonUpperNavBar active='developmentLogs' />
        </div>
      </header>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-extrabold mb-6 text-black border-b-2 border-blue-400 pb-2">
          Event Logs
        </h1>
        <div className="logs-container" ref={logsContainerRef} style={{ maxHeight: '500px', overflowY: 'auto' }}>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ul className="grid gap-4">
              {logs.map((log, index) => (
                <li key={index} className="p-4 bg-gray-100 rounded-md">
                  <span className="font-bold text-green-700">{`[${log.timestamp}]`}</span>: <span className="font-semibold">{log.message}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        {logsContainerRef.current && logsContainerRef.current.scrollHeight > logsContainerRef.current.clientHeight && (
          <button className="fixed bottom-4 right-4 bg-blue-500 text-white py-2 px-4 rounded-full" onClick={scrollToBottom}>Scroll to Bottom</button>
        )}
      </div>
      <ToastContainer />
    </>
  );
};

export default DevelopmentLogsPage;
