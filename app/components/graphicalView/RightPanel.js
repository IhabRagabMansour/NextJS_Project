import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import RemoteConnections from './RemoteConnections';
import LocalConnection from './LocalConnection';

function RightPanel({ handelClearClick, viewedConnections }) {

  return (
    <div className="h-screen  w-1/3 pb-8  pl-5 pr-10 ">
      {viewedConnections && viewedConnections.type === "remote" && <div className='fixed top-16 mt-2  right-0 w-1/4 h-screen overflow-scroll pt-6  '>
        <div className='flex justify-between items-center mb-10 '>
          {/* <h1 className='ml-5 text-xl  '>Connections from A to Host 1</h1> */}
          <h1 className='ml-5 text-xl font-semibold text-gray-800 tracking-wide shadow-lg p-2 bg-slate-100 rounded-lg'>
            Connections from A to {viewedConnections["hostName"]}
          </h1>
          <div className="cursor-pointer mr-10 text-red-600 hover:text-red-800 py-2 pr-2 rounded-full pl-5 hover:bg-red-200 transition-colors duration-150 ease-in-out" onClick={handelClearClick}>
            <FontAwesomeIcon icon={faClose} size="2x" />
          </div>
        </div>
        <div className="p-2 mb-16">
          {viewedConnections.pairs && viewedConnections.pairs.map((connection, index) => (
            <RemoteConnections connection={connection} key={index} />
          ))}
        </div>
      </div>}
      {viewedConnections && viewedConnections.type === "local" && <div className='fixed top-26 right-0 w-1/4 h-screen overflow-scroll pt-6 '>
        <div className='flex justify-between items-center mb-8'>
          <h1 className='ml-5 text-xl font-semibold text-gray-800 tracking-wide shadow-lg p-2 bg-slate-100 rounded-lg'>Connections from {`${viewedConnections["Process-B-name"]}`} to {`${viewedConnections["Process-C-name"]}`}</h1>
          <div className="cursor-pointer mr-10 text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-200 transition-colors duration-150 ease-in-out" onClick={handelClearClick}>
            <FontAwesomeIcon icon={faClose} size="2x" />
          </div>
        </div>
        <div className="p-2 mb-16">
          <LocalConnection connection={viewedConnections} />
        </div>
      </div>}
    </div >
  );
}

export default RightPanel
