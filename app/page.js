"use client";
import { useState } from "react";
import Welcome from "./welcome/page";
import LeftSideBar from "./components/LeftSideBar/LeftSideBar"

export default function Home() {
  const [activePage, setActivePage] = useState(0);
  const onMenuItemClick = (pageIndex) => {
    setActivePage(pageIndex);
  };

  const MainBody = () => {
    switch (activePage) {
      case 0:
        return <Welcome />;
      default:
        return null;
    }
  };

  return (
    // <div className="flex">
    //   <div className="w-full h-screen pl-28">
    //     <div
    //       id="LeftSideBar"
    //       className="h-screen fixed left-0 w-28 bg-gray-50 border-r border-gray-200"
    //     >
    //       <LeftSideBar
    //         onMenuItemClick={onMenuItemClick}
    //         ActiveButtonIndex={activePage}
    //       />
    //     </div>
        <div className="w-full">{MainBody()}</div>
    //   </div>
    // </div>
  );
}
