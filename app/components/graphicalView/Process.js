import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faServer } from '@fortawesome/free-solid-svg-icons';

const Process = ({ name, status }) => {
  const statusConfig = {
    Running: { color: 'green', message: 'Running!' },
    Sleeping: { color: 'yellow', message: 'Sleeping!' }
  };

  const { color, message } = statusConfig[status] || { color: 'red', message: 'Stopped!' };

  return (
    <div className={`flex flex-col items-center justify-center bg-slate-300 rounded-lg p-4 `}>
      {color && (
        <div className={`relative group w-12 h-12 rounded-full flex items-center justify-center ${color === 'green' ? 'bg-green-400 hover:bg-green-500' : color === 'red' ? 'bg-red-400 hover:bg-red-500' : color === 'yellow' ? 'bg-yellow-400 hover:bg-yellow-500' : 'bg-red-400 hover:bg-red-500'}`}>
          {/* Icon placeholder */}
          <span><FontAwesomeIcon icon={faServer} size='2x' /></span>
          <div className={`hidden group-hover:block absolute top-full left-1/2 transform -translate-x-1/2 ${color === 'green' ? 'bg-green-400 text-white-500' : color === 'red' ? 'bg-red-400 text-white-500' : color === 'yellow' ? 'bg-yellow-400 text-white-500' : 'bg-red-400 text-white-500'} p-3 rounded-lg`}>
            {/* Your hint content goes here */}
            {message}
          </div>
        </div>
      )}

      <span className="mt-2 text-sm">{name}</span>
    </div>
  );
};

export default Process;
