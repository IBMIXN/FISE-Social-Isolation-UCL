import { useReducer, useCallback } from "react";

function getKeypointsObject(pose) {
  return pose.keypoints.reduce((acc, { part, position }) => {
    acc[part] = position;
    return acc;
  }, {});
}

function reducer(_, action) {
  switch (action) {
    case "valid":
      return true;
    case "invalid":
      return false;
    default:
      return false;
  }
}

export default function () {
  const height = 700;
  const [poseValid, dispatch] = useReducer(reducer, 0);
  const checkPoses = useCallback((poses, twoHands, threshold) => {
    if (poses.length !== 1) {
      return;
    }

    const {
      leftShoulder,
      rightShoulder,
      leftElbow,
      rightElbow,
      // leftWrist,
      // rightWrist,
      // leftHip,
      // rightHip,
    } = getKeypointsObject(poses[0]);

    if (!(leftElbow || rightElbow) || !(leftShoulder || rightShoulder)) {
      return;
    }

    const elbowY = twoHands
      ? Math.max(leftElbow.y, rightElbow.y)
      : Math.min(leftElbow.y, rightElbow.y);
    const shoulderY = Math.min(leftShoulder.y, rightShoulder.y);
    // const wrist = leftWrist || rightWrist;

    if (shoulderY > height) {
      // Shoulders off screen
      dispatch("invalid");
      return;
    }

    if (shoulderY > elbowY + threshold) {
      // Elbow above shoulder
      dispatch("valid");
      return;
    }

    if (shoulderY < elbowY + threshold) {
      // Elbow above shoulder
      dispatch("invalid");
      return;
    }
  }, []);
  return [poseValid, checkPoses];
}
