"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import CommonUpperNavBar from '../components/Common/CommonUpperNavBar';

const Machine = () => {
  const [formData, setFormData] = useState({
    PIDB: '',
    ProcessNameB: '',
    PIDC: '',
    ProcessNameC: '',
    hostName: '',
    hostIP: '',
  });
  
  const [errorMessages, setErrorMessages] = useState({
    PIDB: '',
    PIDC: '',
    hostIP: '',
  });

  const [createMultiplePairs, setCreateMultiplePairs] = useState(false);
  const [enteredData, setEnteredData] = useState([]);

  const handleInputChange = (e, fieldName) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));

    setErrorMessages((prevErrors) => ({
      ...prevErrors,
      [fieldName]: '',
    }));

  };

  const handleCheckboxChange = () => {
    setCreateMultiplePairs((prevValue) => !prevValue);
  };

  const handleCreatePair = () => {
 // Validate the entered data here
   // Check if all fields are filled
   const areAllFieldsFilled = Object.values(formData).every((value) => value.trim() !== '');

   if (!areAllFieldsFilled) {
     alert('Please fill in all required fields.');
     return;
   }
   
    const isPIDValid = /^\d+$/.test(formData.PIDB); // Check if PID is numbers only
    const isHostIPValid = /^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)$/.test(formData.hostIP); // Check if Host IP has a valid format

    if (!isPIDValid) {
      setErrorMessages((prevErrors) => ({
        ...prevErrors,
        PIDB: 'Please enter a valid PID (numbers only).',
        PIDC: 'Please enter a valid PID (numbers only).',
      }));
      return;
    }
  
    if (!isHostIPValid) {
      setErrorMessages((prevErrors) => ({
        ...prevErrors,
        hostIP: 'Please enter a valid Host IP address (format: xxx.xxx.xxx.xxx).',
      }));
      return;
    }

    // Store the entered data in the array
    setEnteredData((prevData) => [...prevData, formData]);

    // Clear the form fields
    setFormData({
      PIDB: '',
      ProcessNameB: '',
      PIDC: '',
      ProcessNameC: '',
      hostName: '',
      hostIP: '',
    });

    // Redirect to the same page if createMultiplePairs is checked
    if (createMultiplePairs) {
      window.location.href = '/createPairs';
    } else {
      window.location.href = '/graphicalView'; 
    }
  };

  return (
    <>
    <header className='w-full bg-blue-400 p-2.5 mb-6' >
      <div className="w-full flex">
        <CommonUpperNavBar active='addPair'/>
      </div>
    </header>
    <div className="text-center mx-auto max-w-md p-8 bg-white shadow-lg rounded">
      <div className="mb-4">
        <input
          type="text"
          id="PIDB"
          className="w-full px-4 py-2 border rounded"
          placeholder="PID of B"
          value={formData.PIDB}
          onChange={(e) => handleInputChange(e, 'PIDB')}
        />
        <span className="text-red-500">{errorMessages.PIDB}</span>
      </div>

      <div className="mb-4">
        <input
          type="text"
          id="ProcessNameB"
          className="w-full px-4 py-2 border rounded"
          placeholder="Process name of B"
          value={formData.ProcessNameB}
          onChange={(e) => handleInputChange(e, 'ProcessNameB')}
        />
      </div>

      <div className="mb-4">
        <input
          type="text"
          id="PIDC"
          className="w-full px-4 py-2 border rounded"
          placeholder="PID of C"
          value={formData.PIDC}
          onChange={(e) => handleInputChange(e, 'PIDC')}
        />
        <span className="text-red-500">{errorMessages.PIDC}</span>
      </div>

      <div className="mb-4">
        <input
          type="text"
          id="ProcessNameC"
          className="w-full px-4 py-2 border rounded"
          placeholder="Process name of C"
          value={formData.ProcessNameC}
          onChange={(e) => handleInputChange(e, 'ProcessNameC')}
        />
      </div>

      <div className="mb-4">
        <input
          type="text"
          id="hostName"
          className="w-full px-4 py-2 border rounded"
          placeholder="Host name"
          value={formData.hostName}
          onChange={(e) => handleInputChange(e, 'hostName')}
        />
      </div>

      <div className="mb-4">
        
        <input
          type="text"
          id="hostIP"
          className="w-full px-4 py-2 border rounded"
          placeholder="Host IP"
          value={formData.hostIP}
          onChange={(e) => handleInputChange(e, 'hostIP')}
        />
        <span className="text-red-500">{errorMessages.hostIP}</span>
      </div>

      <div className="mb-4">
        <button
          className="w-full px-4 py-2 bg-blue-400 text-white rounded"
          onClick={handleCreatePair}
        >
          Create pair
        </button>
      </div>

      <div className="mb-4">
        <input
          type="checkbox"
          id="myCheckbox"
          className="mr-2"
          checked={createMultiplePairs}
          onChange={handleCheckboxChange}
        />
        <label htmlFor="myCheckbox" className="text-base">
          Create more than one pair
        </label>
      </div>
      <div style={{ display: 'flex',justifyContent: 'center'  }}>
        <Link href={{ pathname: '/viewHosts'}} className = "text-blue-500 no-underline">
         <div>View all hosts</div>
       </Link>
       <Link href={{ pathname: '/viewPairs'}} className = "text-blue-500 no-underline">
         <div style={{ marginLeft: '10px' }}>View all pairs</div>
       </Link>
      </div>

    </div>
    </>
    
  );
};

export default Machine;
