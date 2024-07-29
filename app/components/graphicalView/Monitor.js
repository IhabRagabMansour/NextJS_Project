import React from 'react';
import HostComponent from './HostComponent';
import { useState } from 'react';
import Process from './Process';

const Monitor = ({ handelLocalClick, handelRemoteClick, isClick, processA, hostsData }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [activeText, setActiveText] = useState('');
  const [inActiveText, setInActiveText] = useState('');
  const [currIndex, setCurrIndex] = useState(-1);
  const [type, setType] = useState('');

  const handleMouseEnter = (index, type) => {

    setShowTooltip(true);
    setCurrIndex(i => index);
    setType(t => type);
    let activeText = '';
    if (hostsData && hostsData.length > 0)
      hostsData[index].pairs.forEach((pair, id) => {

        if (id === 0)
          activeText += `${pair['active-remote-connections']} `;
        else if (pair)
          activeText += ` , ${pair['active-remote-connections']}`;
      });

    let inactiveText = '';

    if (hostsData && hostsData.length > 0)
      hostsData[index].pairs.forEach((pair, id) => {


        if (pair && id === 0)
          inactiveText += `${pair['inactive-remote-connections']} `;
        else if (pair)
          inactiveText += ` , ${pair['inactive-remote-connections']}`;
      });

    setActiveText(activeText !== '' ? activeText : '0');
    setInActiveText(inactiveText !== '' ? inactiveText : '0');
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
    setCurrIndex(-1);
    setActiveText('');
    setInActiveText('');
    setType('');
  };
  return (
    <div className="flex ">
      {/* Process component for the "A" process */}
      <div className="flex flex-col justify-center items-center mr-6 pr-20 mb-14">
        <p className='text-xl text-yellow-500' >{processA["lost-connections"] ? processA["lost-connections"].length : 0}</p>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48" // Custom width in pixels
          height="48" // Custom height in pixels
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m0 0l-3 3m3-3l3 3" />
        </svg>
        <Process name={processA["Process-A-name"]} status={processA["Process-A-status"]} />
        {/* You can add more structure here if needed */}
      </div>

      {/* Container for hosts and arrows */}
      <div className="flex flex-col  justify-center pl-20 ml-20">
        {hostsData.map((host, index) => {

          const activeConnections = host.pairs.reduce((acc, pair) => {
            if (pair && pair.hasOwnProperty('active-remote-connections'))
              return acc + pair['active-remote-connections'];
            return acc;
          }, 0);
          const inActiveConnections = host.pairs.reduce((acc, pair) => {
            if (pair && pair.hasOwnProperty('inactive-remote-connections'))
              return acc + pair['inactive-remote-connections'];
            return acc;
          }, 0);

          const dataLength = hostsData.length;
          const dataIsEven = !(dataLength % 2);

          const hostCardHeight = 200;
          const gap = 15;

          const middleIndex = Math.floor(dataLength / 2);
          let shiftedIndex = Math.abs(index - middleIndex);
          if (dataIsEven)
            shiftedIndex = index < middleIndex ? Math.abs(shiftedIndex - 1) : shiftedIndex;

          let oppositeSide = 1;
          if (dataIsEven)
            oppositeSide = gap / 2 + hostCardHeight / 2 + ((gap + hostCardHeight) * shiftedIndex);
          else
            oppositeSide = + ((gap + hostCardHeight) * (shiftedIndex));

          const adjacentSide = 250; // constant
          const hypotenuse = Math.sqrt(oppositeSide * oppositeSide + adjacentSide * adjacentSide);

          const angle = Math.atan(oppositeSide / adjacentSide);

          const isBeforeHalf = index < (dataLength / 2);



          return (
            <div key={index} className="flex items-center mb-4 relative">
              {/* SVG for double-ended arrow with number */}
              <div onClick={() => { isClick && handelRemoteClick(host.hostIP) }} className="flex flex-col items-center absolute origin-[right_bottom] hover:bg-black/5 rounded-lg"
                style={{

                  width: hypotenuse + 'px',
                  left: (-1 * (hypotenuse + 10)) + 'px',
                  rotate: isBeforeHalf ? (-1 * angle) + 'rad' : angle + 'rad'
                }}
              >
                {/* <span className="text-lg font-medium mb-1 "
                  style={{ rotate: isBeforeHalf ? angle + 'rad' : (-1 * angle) + 'rad' }}>
                  <span className='text-green-500'>{activeConnections}</span>
                  <span className='text-red-500 ml-5'>{inActiveConnections}</span>
                </span> */}

                <div className="flex items-center">
                  <span className="text-lg text-green-500 font-medium  mr-4  pl-2 pr-2 pt-2 " onMouseEnter={() => handleMouseEnter(index, 'active')} onMouseLeave={handleMouseLeave}>{index === currIndex && showTooltip && type === 'active' ? activeText : activeConnections}</span>
                  <span className="text-lg  text-red-500 font-medium ml-4 pl-2 pr-2 pt-2 " onMouseEnter={() => handleMouseEnter(index, 'inactive')} onMouseLeave={handleMouseLeave}>{index === currIndex && showTooltip && type === 'inactive' ? inActiveText : inActiveConnections}</span>

                  {/* {showTooltip && (
                    <div className="absolute bg-white p-2 border rounded ml-22 shadow-lg">
                      {tooltipText}
                    </div>
                  )} */}
                </div>


                <div className=' h-1 w-full bg-black arrow'>
                </div>
              </div>
              {/* Host component */}
              <HostComponent handelLocalClick={handelLocalClick} bcCouples={host.pairs} hostName={host.hostName} />
            </div>
          )
        })
        }
      </div>
    </div >
  );
};

export default Monitor;