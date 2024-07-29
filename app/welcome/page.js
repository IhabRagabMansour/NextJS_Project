// Welcome.js
import React from 'react';
import Link from 'next/link';
import CommonUpperNavBar from '../components/Common/CommonUpperNavBar';

const Welcome = ({}) => {
  return (
    <>
    <header className='w-full bg-blue-400 p-2.5 sticky shadow-md ' >
        <CommonUpperNavBar/>
    </header>
    <div className="flex items-center justify-center h-screen mt-0">
      <div>
        <img
          className= "w-510 h-225 object-contain mt-0 mx-auto"
          src="/Iconz.svg"
          alt="Welcome Image"
        />
        <h4 className="text-3xl font-bold mt-5 text-center whitespace-pre-line">
          Welcome to our network processes <br /> monitoring tool
        </h4>
        <p className="text-base text-center mt-7 text-gray-700">
          Network Monitoring is the process of discovering, mapping, and monitoring a computer network <br /> to ensure optimal availability and performance.
        </p>
          <div className="flex justify-center">
        { /* <Link href="/createPairs">
              <button className="w-64 h-12 bg-blue-400 text-white text-base mx-auto my-5 rounded-full cursor-pointer flex items-center justify-center"> 
                Create new pairs 
              </button>
          </Link>
          */}
        </div>
      </div>
    </div>
    </>
    
  );
};

export default Welcome;
