"use client"
import { useEffect, useState } from 'react';
import HTable from '../components/Table/HTable';
import * as apiUrls from '../api/apiUrls';
import { httpGet } from '../api/requestUtils';
import { ToastContainer, toast } from 'react-toastify';
import CommonUpperNavBar from '../components/Common/CommonUpperNavBar';
import LoadingScreen from '../components/Report/LoadingScreen';
import DataNotFound from '../components/Report/DataNotFound';


export default function HostTable() {
  const [hosts_data, setHosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
          controller.abort(); // Abort the fetch request on timeout
          setError(new Error('Request timed out')); // Set error state
        }, 10000); // Timeout after 10 seconds

        const data = await httpGet(apiUrls.HOSTS_DETAILED_ENDPOINT, { signal: controller.signal });
        clearTimeout(timeoutId); // Clear timeout if request is successful
        setHosts(data);
        setLoading(false);
        setError(null); // Reset error state if fetch is successful
      } catch (error) {
        console.error('Error fetching data from the backend:', error);
        setError(error); // Set error state if fetch fails
        toast.error('Error fetching data from the backend');
        setHosts([]);
        setLoading(false);
      }
    };

    fetchData();

    // Set up interval to fetch data every 2 seconds
    const intervalId = setInterval(fetchData, 2000);

    // Cleanup function
    return () => clearInterval(intervalId);
  }, []);

  // Extracting data from hosts_data and formatting it as required
  const result = [];

  function extractData(data) {
    // Match the number and the unit
    const match = data.match(/(\d+(\.\d+)?)\s*([\w-]+)/);

    if (match) {
        const number = parseFloat(match[1]); // Extract the number
        const unit = match[3]; // Extract the unit

        // Extract the first character of each word in the unit string
        const firstChars = unit.split('-').map(word => word.charAt(0).toLowerCase());

        // Join the first characters to form the unit abbreviation
        const unitAbbreviation = firstChars.join('');

        return `${number} ${unitAbbreviation}`;
    } else {
        return data; // Return null if no match is found
    }
}

  if (hosts_data.hosts) {
    hosts_data.hosts.forEach(host => {
      const hostName = host.hostName;

      host.pairs.forEach(pair => {
        // Check if pair is not null
        if (pair && pair['List-Of-Local-Connections'] && pair['List-Of-Remote-Connections']) {
          const localConnections = pair['List-Of-Local-Connections'];
          const remoteConnections = pair['List-Of-Remote-Connections'];

          const createConnectionObject = connection => {
            const status = connection["client-process-state"] === "CLOSED" && connection["server-process-state"] === "CLOSED" ? "Failed" : "Active";

            return ({
              "Host": hostName,
              "ClientName": connection['client-process'],
              "ClientPort": connection['client-port'],
              "ServerName": connection['server-process'],
              "ServerPort": connection['server-port'],
              "DataRate": extractData(connection['data-rate']),
              "Status": status
            });
          };

          localConnections.forEach(connection => {
            result.push(createConnectionObject(connection));
          });

          remoteConnections.forEach(connection => {
            result.push(createConnectionObject(connection));
          });
        }
      });
    });
  }

  return (
    <div className='font-sans leading-6 m-0 w-full'>
      <header className='w-full bg-blue-400 p-2.5 sticky top-0 shadow-md z-50'>
        <div className="w-full flex">
          <CommonUpperNavBar active='table' />
        </div>
      </header>
      {loading ? (
        <LoadingScreen />
      ) : error ? (
        <DataNotFound msg={error.message} />
      ) : (
        <HTable data={result} />
      )}
      <ToastContainer />
    </div>
  );
}

