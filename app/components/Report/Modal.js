import { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom/client";

function Modal(props) {
  const inputElement = useRef();
  function submitHandle() {
    props.onDownload(inputElement.current.value == null? 2: inputElement.current.value);
    console.log();
  }
  function cancelHandle() {
    props.onCancel();
  }
  return (
    <div className="fixed rounded-md w-30 p-4 top-20 left-1/3 bg-white z-50 shadow-md">
      <div className="mb-6">
        <label for="quantity">
          Number of columns for line graphs (between 1 and 5):
        </label>
        <input
          className="ml-4 border-black border-2 rounded px-1 w-10 left-insent-50"
          type="number"
          id="quantity"
          name="quantity"
          min="1"
          max="5"
          defaultValue={2}
          ref={inputElement}
        />
      </div>
      <div className="flex flex-cols gap-4">
        <button className="bg-blue-400 rounded-md p-2 hover:shadow-md" onClick={submitHandle}>
          Download
        </button>
        <button onClick={cancelHandle} className="p-2 hover:shadow-md">Cancel</button>
      </div>
    </div>
  );
}
export default Modal;
