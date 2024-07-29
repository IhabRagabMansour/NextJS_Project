import React from 'react';

function StatisticCard(props) {
    return (
        <div className='shadow-lg w-64 rounded-lg border-4 border-blue-400 font-semibold text-black  p-4 mx-3'>
            <h2 className='text-xl mb-2'>{props.title}</h2>
            <span>{props.number}</span> <span>{props.unit}</span>
        </div>
    );
};

export default StatisticCard;
