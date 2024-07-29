import React from 'react';
import BCCouple from './BCCouple';

const HostComponent = ({ handelLocalClick, bcCouples, hostName }) => {
  return (
    <div className="flex flex-col space-y-4 p-4 bg-gray-100 rounded-md">
      <h2 className="text-xl font-semibold mb-4">{hostName}</h2>
      <section className='flex gap-4 divide-x-4 divide-slate-300'>

        {bcCouples[0] !== null && bcCouples.map((couple, index) => (
          <BCCouple
            handelLocalClick={handelLocalClick}
            key={index}
            idx={index}
            couple={couple}
          />
        ))}
      </section>
    </div>
  );
};

export default HostComponent;