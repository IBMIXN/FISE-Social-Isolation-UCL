import React from "react";
import MicRecorder from "mic-recorder-to-mp3";
import { useState } from "react";
import { useEffect } from "react";

const Mp3Recorder = new MicRecorder({ bitRate: 128 });

const MicComponent = () => {
  const [isRecording, setIsRecording] = useState(false)
  const [isBlocked, setIsBlocked] = useState(false)
  const [blobURL, setBlobURL] = useState("")

  useEffect(() => {
    navigator.mediaDevices.getUserMedia(
      { audio: true },
      () => {
        console.log("Permission Granted");
        setIsBlocked(false)
      },
      () => {
        console.log("Permission Denied");
        setIsBlocked(true)
      }
    );
  }, [])

  const start = () => {
    if (isBlocked) {
      console.log("Permission Denied");
    } else {
      Mp3Recorder.start()
        .then(() => {
          setIsRecording(true)
        })
        .catch((e) => console.error(e));
    }
  };

  const stop = () => {
    Mp3Recorder.stop()
      .getMp3()
      .then(([buffer, blob]) => {
        const blobURL = URL.createObjectURL(blob);
        setBlobURL(blobURL)
        setIsRecording(false)
      })
      .catch((e) => console.log(e));
  };

  return (
    <div style={{color: "white"}}>
    <button onClick={start} disabled={isRecording}>
      Record
    </button>
    <br/>
    <button onClick={stop} disabled={!isRecording}>
      Stop
    </button>
    <audio src={blobURL} controls="controls" />
  </div>
  )
}

export default MicComponent;
