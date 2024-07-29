import React from "react";
import { useState, useCallback } from "react";
import Monitor from "./Monitor";

function LeftPanel({ clear, handelRemoteClick, handelLocalClick, GraphicalViewData, hostA }) {
  const [scale, setScale] = useState(1);

  const handleWheel = useCallback((event) => {
    if (event.deltaY < 0) {
      // Zoom in
      setScale((prevScale) => prevScale + 0.05);
    } else if (event.deltaY > 0) {
      // Zoom out
      setScale((prevScale) => Math.max(prevScale - 0.05, 0.05)); // Prevent scale from going below 0.1
    }
  }, []);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [origin, setOrigin] = useState({ x: 0, y: 0 });
  const [isClick, setIsClick] = useState(false);

  const handleMouseDown = useCallback((event) => {
    // Prevent default behavior to avoid selecting text or other elements
    event.preventDefault();
    setIsDragging(true);
    setIsClick(false); // Reset the click state on mouse down
    setOrigin({
      x: event.clientX - position.x,
      y: event.clientY - position.y,
    });
    setDragStart({
      x: event.clientX,
      y: event.clientY,
    });
  }, [position]);

  const handleMouseMove = useCallback((event) => {
    if (isDragging) {
      const newPosition = {
        x: event.clientX - origin.x,
        y: event.clientY - origin.y,
      };
      setPosition(newPosition);
    }
  }, [isDragging, origin]);

  const handleMouseUp = useCallback((event) => {
    setIsDragging(false); // End dragging
    const distance = Math.sqrt(
      Math.pow(event.clientX - dragStart.x, 2) + Math.pow(event.clientY - dragStart.y, 2)
    );

    if (distance < 5) { // Threshold for a click vs. a drag
      setIsClick(true); // It's a click, set the click state to true
    }
  }, [dragStart]);


  return (


    <div className={`overflow-x-auto scrollable w-full mt-8 overflow-y-auto h-full ${clear ? ' border-r-4 border-gray-300' : ''}`}
      onWheel={handleWheel}
      style={{ height: `658px` }}

    >
      <div onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          cursor: isDragging ? 'grabbing' : 'grab',
          transform: `translate(${position.x}px, ${position.y}px)`,
        }}
      >


        <div className="min-w-max space-x-4  flex"

          style={{ transform: `scale(${scale})`, transformOrigin: '0 0' }}


        >
          {/* Repeat this section for each graph you want to display */}
          <div className="graph-container bg-white  rounded-lg  flex-none">
            {/* Content of your graph here */}
            <Monitor handelLocalClick={handelLocalClick} handelRemoteClick={handelRemoteClick} isClick={isClick} processA={hostA} hostsData={GraphicalViewData.hosts} />

          </div>


        </div>
      </div>
    </div>

  )
}

export default LeftPanel
