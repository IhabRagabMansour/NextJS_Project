import React from 'react';
import Process from './Process';

const BCCouple = ({ handelLocalClick, couple, idx }) => {

  return (
    <div className={`flex items-center justify-center ${idx == 0 ? '' : 'pl-4'}`}>
      <Process name={couple["Process-B-name"]} status={couple["Process-B-status"]} />

      <div className="mx-4 flex flex-col  items-center hover:bg-black/5 rounded-lg" onClick={() => { handelLocalClick(couple.pairID) }}>
        <div className="flex justify-center space-x-2">
          <span className="font-medium text-green-500  text-xl">{couple["active-local-connections"]}</span>
          <span className="font-medium pl-2 text-red-500  text-xl">{couple["inactive-local-connections"]}</span>
        </div>
        <svg width="100" height="20" viewBox="0 0 100 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 10 L10 0 L10 20 Z" fill="#000" />
          <line x1="10" y1="10" x2="90" y2="10" stroke="#000" strokeWidth="2" />
          <path d="M100 10 L90 0 L90 20 Z" fill="#000" />
        </svg>
        <div className="flex justify-center space-x-2">
          <span className="font-medium text-yellow-500  text-xl">{couple["B-listening-ports"]}</span>
          <span className="font-medium pl-2 text-yellow-500  text-xl">{couple["C-listening-ports"]}</span>
        </div>
      </div>

      <Process name={couple["Process-C-name"]} status={couple["Process-C-status"]} />
    </div>
  );
};

export default BCCouple;