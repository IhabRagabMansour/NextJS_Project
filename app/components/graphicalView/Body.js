import React from 'react'
import { useState, useCallback, useEffect } from "react";
import API from '../../plugins/axios'
import LeftPanel from './LeftPanel';
import RightPanel from './RightPanel';
import * as apiUrls from '../../api/apiUrls';
import { httpGet } from '@/app/api/requestUtils';

function Body({ GraphicalViewData, hostA }) {
  const [viewedConnections, setViewedConnections] = useState({});
  const [clear, setClear] = useState(false);

  function handelRemoteClick(hostIP) {

    httpGet(`${apiUrls.HOSTS_DETAILED_REMOTE}${hostIP}`, {}) // Assuming the API endpoint uses the hostIP in the URL
      .then(response => {
        // Set the state with the fetched data
        console.log(response, 'remote');
        setViewedConnections({ ...response, type: "remote" });
        setClear(true);
      })
      .catch(error => {
        console.error('Error fetching data from the backend:', error);
        // Handle the error, e.g., by setting an error state or showing a notification
      });
  }

  function handelLocalClick(pairID) {

    httpGet(`${apiUrls.HOSTS_DETAILED_LOCAL}${pairID}`, {})
      .then(response => {
        // Set the state with the fetched data
        // console.log(response);
        setViewedConnections({ ...response, type: "local" });
        setClear(true);
      })
      .catch(error => {
        console.error('Error fetching data from the backend:', error);
        // Handle the error, e.g., by setting an error state or showing a notification
      });

  }

  function handelClearClick() {
    setViewedConnections({});
    setClear(false);
  }

  return (
    <div className="flex w-full overflow-y-hidden p-0 m-0"
      style={{ height: "634px" }}
    >
      <LeftPanel clear={clear} handelRemoteClick={handelRemoteClick} handelLocalClick={handelLocalClick} GraphicalViewData={GraphicalViewData} hostA={hostA} />

      {clear && <RightPanel handelClearClick={handelClearClick} viewedConnections={viewedConnections} />}
      <div className="absolute bottom-5 left-5 bg-gray-200 p-4 rounded-lg">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-400 rounded-full mr-2"></div>
            <div>Yellow is Sleeping Process | Established and waiting for new connections </div>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-400 rounded-full mr-2"></div>
            <div>Red is Stopping Process | Inactive connection</div>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-400 rounded-full mr-2"></div>
            <div>Green is Running Process | Active connection</div>
          </div>
        </div>
      </div>

    </ div>


  )
}

export default Body
