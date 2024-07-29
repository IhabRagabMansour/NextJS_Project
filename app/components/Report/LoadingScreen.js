import React from "react";
import Spinner from "./Spinner";
import BackDrop from "./Backdrop";

function LoadingScreen() {
  return (
    <div role="status">
      <BackDrop />
      <Spinner />
    </div>
  );
}

export default LoadingScreen;