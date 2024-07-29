
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useEffect } from 'react';
import {
  faPlay,
  faPause,
  faStop,
  faBug,
  faForwardStep,
  faBackwardStep,
  faFileExport,
  faDownload,
} from '@fortawesome/free-solid-svg-icons';
import CommonUpperNavBar from '../Common/CommonUpperNavBar';
import * as apiUrls from '../../api/apiUrls';
import { httpGet } from '@/app/api/requestUtils';

const Modal = ({ show, onClose, onSave }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-gray-700 bg-opacity-75 flex justify-center items-center">
      <div className="bg-white p-8 rounded-md">
        <p>Do you want to save the session?</p>
        <div className="flex justify-center mt-4">
          <button onClick={onSave} className="bg-blue-500 text-white px-4 py-2 mr-4 rounded-md">
            Save
          </button>
          <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded-md">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const DebugModal = ({ showDebugModal, onDebugModalClose, displaySession, sessions }) => {
  const [selectedSessionId, setSelectedSessionId] = useState(null);

  // Call this function when the user confirms their session choice
  const handleDebugStart = () => {
    if (selectedSessionId !== null) {
      displaySession(selectedSessionId);
    }
  };

  if (!showDebugModal) return null;

  return (
    <div className="fixed inset-0 bg-gray-700 bg-opacity-75 flex justify-center items-center">
      <div className="bg-white p-8 rounded-md">
        <p>Which session do you want to debug?</p>
        <div className="mt-4">
          {sessions.map((session) => (
            <div className="m-5 flex items-center" key={session.id}>
              <input
                type="radio"
                id={`session_${session.id}`}
                name="session"
                value={session.id}
                onChange={(e) => setSelectedSessionId(e.target.value)}
              />
              <label htmlFor={`session_${session.id}`} className="ml-2">
                {session.name} {/* Assuming each session has a 'name' property */}
              </label>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-4">
          <button onClick={handleDebugStart} className="bg-blue-500 text-white px-4 py-2 mr-4 rounded-md">
            Start Debugging
          </button>
          <button onClick={onDebugModalClose} className="bg-gray-500 text-white px-4 py-2 rounded-md">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

function Header() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [showDebugModal, setShowDebugModal] = useState(false);
  const [pause, setPause] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [status, setStatus] = useState('IDLE');
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [sessionID, setSessionID] = useState(null);


  const formatTime = (date) => {
    // Formatting using template literals and padStart to ensure two digits
    const yy = date.getFullYear().toString().slice(-2);
    const mm = (date.getMonth() + 1).toString().padStart(2, '0');
    const dd = date.getDate().toString().padStart(2, '0');
    const hh = date.getHours().toString().padStart(2, '0');
    const ss = date.getMinutes().toString().padStart(2, '0');
    return `${yy}-${mm}-${dd} ${hh}:${ss}`;
  };


  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Fetch status immediately on component mount, then every second via interval
    fetchStatus();

    // Clear interval on component unmount
    return () => clearInterval(timerId);
  }, []);


  const fetchStatus = async () => {
    try {
      const response = await httpGet(apiUrls.GET_STATUS);
      setStatus(response.status); // Assuming the API response has the status in 'data.status' property
      setSessionID(response.sessionID);

      if (response.status === 'IDLE') {
        setIsPlaying(false);
      }
      else if (response.status === 'RUNNING') {
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error fetching status:', error);
      // Handle error (e.g., show a notification to the user)
    }
  };

  const handleButtonClick = async () => {
    if (isPlaying) {
      setShowSaveModal(true);
    }

    else {
      try {
        const res = await httpGet(apiUrls.SESSION_START, {});
        setIsPlaying(true);
        fetchStatus(); // This should be set after the response from the backend
      }
      catch (error) {
        console.error('Error starting the session:', error);
      }
    }
  };

  const handleSaveSession = async () => {
    // alert('Session saved! Downloading PDF...');
    try {
      const res = await httpGet(`${apiUrls.SESSION_EXIT}/1`, {});
      setShowSaveModal(false);
      setIsPlaying(false);
      setPause(false);
      fetchStatus();
      // setStatus('Start the session');
    }
    catch (error) {
      console.error('Error exiting the session:', error);
    }
    setShowSaveModal(false);
  };


  const handleCancelSave = async () => {
    try {
      const res = await httpGet(`${apiUrls.SESSION_EXIT}/0`, {});
      setShowSaveModal(false);
      setIsPlaying(false);
      setPause(false);
      fetchStatus();
      // setStatus('Start the session');
    }
    catch (error) {
      console.error('Error exiting the session:', error);
    }

    setShowSaveModal(false);
  };

  const handleDebug = async () => {
    try {
      const response = await httpGet(apiUrls.GET_SESSIONS);
      setSessions(response.data); // Assuming the API response has the sessions in 'data' property
      setShowDebugModal(true); // Show the debug modal after fetching the sessions
    } catch (error) {
      console.error('Error fetching sessions:', error);
      // Handle error (e.g., show a notification to the user)
    }
  };


  const displaySession = async (sessionId) => {
    setSelectedSessionId(sessionId);
    try {
      await httpGet(`${apiUrls.SESSION_START}/${sessionId}`, {});
      setShowDebugModal(false);
      setDebugMode(true);
      setPause(false);
      // setStatus('Debugging');
      fetchStatus();
    } catch (error) {
      console.error('Error starting debug session:', error);
    }
  };


  const handlePauseContinueDebug = async () => {
    const apiUrl = pause ? apiUrls.SESSION_CONTINUE : apiUrls.SESSION_PAUSE;
    try {
      await httpGet(`${apiUrl}/${selectedSessionId}`, {});
      setPause(!pause);
      // setStatus(pause ? 'Debugging' : 'Paused');
      fetchStatus();
    } catch (error) {
      console.error(`Error ${pause ? 'continuing' : 'pausing'} debug session:`, error);
    }
  };

  const handlePause = async () => {
    if (status === 'RUNNING') {
      try {
        const res = await httpGet(apiUrls.SESSION_PAUSE, {});
        // setStatus('Paused');
        fetchStatus();
        setPause(true);
      } catch (error) {
        console.error('Error pausing the session:', error);
      }
    } else if (status === 'PAUSING') {
      try {
        const res = await httpGet(apiUrls.SESSION_CONTINUE, {});
        // setStatus('Running');
        fetchStatus();
        setPause(false);
      } catch (error) {
        console.error('Error continuing the session:', error);
      }
    } else if (status === 'Debugging') {
      setPause(prev => !prev);
      // setStatus(prevStatus => (prevStatus === 'Debugging' ? 'Paused' : 'Debugging'));
      fetchStatus();
    }
  };


  const handleStepForward = async () => {
    try {
      await httpGet(`${apiUrls.STEP_FORWARD}/${selectedSessionId}`, {});
      // Handle response and update UI as needed
    } catch (error) {
      console.error('Error stepping forward:', error);
    }
  };

  const handleStepBackward = async () => {
    try {
      await httpGet(`${apiUrls.STEP_BACKWARD}/${selectedSessionId}`, {});
      // Handle response and update UI as needed
    } catch (error) {
      console.error('Error stepping backward:', error);
    }
  };


  const handleStopDebug = async () => {
    try {
      await httpGet(`${apiUrls.SESSION_EXIT}/${selectedSessionId}`, {});
      setDebugMode(false);
      setPause(false);
      // setStatus('Start the session');
      fetchStatus();
      setSelectedSessionId(null);
    } catch (error) {
      console.error('Error exiting debug session:', error);
    }
  };

  return (
    <header className='w-full bg-blue-400 p-2.5 sticky top-0 shadow-md z-40 mb-0'>
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center">
          <CommonUpperNavBar active='graphicalView' />
          <div className="flex border-l-4 pl-4">
            {!debugMode && <button className="mr-4" onClick={handleButtonClick}>
              <FontAwesomeIcon icon={isPlaying ? faStop : faPlay} size="2x" />
            </button>}
            {isPlaying && (
              <button className="mr-4" onClick={handlePause}>
                <FontAwesomeIcon icon={!pause ? faPause : faPlay} size="2x" />
              </button>
            )}
            {!isPlaying && <>

              {!debugMode ? <button onClick={handleDebug} className="mr-4">
                <FontAwesomeIcon icon={faBug} size="2x" />
              </button>
                :
                <button onClick={handleStopDebug} className="mr-4">
                  <FontAwesomeIcon icon={faStop} size="2x" />
                </button>}

            </>}
            {debugMode && (
              <>

                <button className="mr-4" onClick={handlePauseContinueDebug} >
                  <FontAwesomeIcon icon={!pause ? faPause : faPlay} size="2x" />
                </button>

                <button className="mr-4" onClick={handleStepBackward}>
                  <FontAwesomeIcon icon={faBackwardStep} size="2x" />
                </button>
                <button className="mr-4" onClick={handleStepForward}>
                  <FontAwesomeIcon icon={faForwardStep} size="2x" />
                </button>
              </>
            )}
            {/* These buttons do not have click handlers, you might want to implement their functionality */}

            <div className=' border-l-4 pl-4'>
              <button className="mr-4">
                <FontAwesomeIcon icon={faFileExport} size="2x" />
              </button>
              <button className="mr-4">
                <FontAwesomeIcon icon={faDownload} size="2x" />
              </button>
            </div>
          </div>
        </div>
        <div className='flex'>
          <div className=" bg-blue-700 rounded-full px-3 py-1 shadow  text-white font-semibold text-l">
            Session ID : {sessionID ? sessionID : 'N/A'}
          </div>

          <div className=" bg-blue-700 rounded-full px-3 py-1 shadow  text-white font-semibold ml-3 text-l">
            Status : <span className={
              status === "RUNNING" ? "text-green-500" :
                status === "IDLE" ? "text-yellow-500" :
                  status === "FAILURE" ? "text-red-500" :
                    status === "PAUSING" ? "text-purple-500" :
                      ""
            }>
              {status}
            </span>
          </div>

          <div className=" bg-blue-700 rounded-full px-3 py-1 shadow text-white font-semibold text-l ml-3 ">
            Current Time Stamp : {formatTime(currentTime)}
          </div>
        </div>

      </div>



      <Modal show={showSaveModal} onSave={handleSaveSession} onClose={handleCancelSave} />
      <DebugModal
        showDebugModal={showDebugModal}
        onDebugModalClose={() => setShowDebugModal(false)}
        displaySession={displaySession}
        sessions={sessions}
      />
    </header>
  );
}

export default Header;