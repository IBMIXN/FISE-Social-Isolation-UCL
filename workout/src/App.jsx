import React, { useCallback, useEffect, useState } from "react";
import PoseNet from "./components/PoseNet";
import useRepCounter from "./useRepCounter";

import "./normalize.css";
import "./App.css";

const App = () => {
  const [score, setScore] = useState(0);
  const [poseValid, checkPoses] = useRepCounter();
  const onEstimate = useCallback((poses) => checkPoses(poses, true, 50), [checkPoses]);

  const handleClick = () => {
    setScore(0);
  };

  useEffect(() => {
    if (poseValid) setScore((score) => score + 1);
  }, [poseValid]);

  return (
    <button
      className="App-header"
      style={{ backgroundColor: poseValid ? "#4CAF50" : "#171923" }}
      onClick={handleClick}
    >
      <PoseNet showPoints={false} onEstimate={onEstimate} />
      <p>
        {`Perform an overhead press. Your score: ${score}`}
        <br />
        {`Click anywhere to reset`}
      </p>
    </button>
  );
};

export default App;
