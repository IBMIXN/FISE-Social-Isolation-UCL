/** @jsx jsx */
/** @jsxFrag React.Fragment */
import React, { useEffect, useState } from "react";
import { jsx, css } from "@emotion/core";
import "aframe";
import "aframe-particle-system-component";
import { Entity, Scene } from "aframe-react";
import { Helmet } from "react-helmet";
import JitsiComponent from "./components/JitsiComponent";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSyncAlt } from "@fortawesome/free-solid-svg-icons";

import Contact from "./components/Contact";

import profile1 from "./assets/profile1.jpeg";

import img1 from "./assets/img1.jpg";
import img2 from "./assets/img2.jpg";
import img3 from "./assets/img3.jpg";
import img4 from "./assets/img4.jpg";

const resetStyle = css`
  outline: none;
  border: none;
  background: none;
  border-radius: 100%;
  :hover {
    cursor: pointer;
  }
`;

const buttonContainerStyle = css`
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 30%;
  display: grid;
  grid-template-columns:
    5em [left] repeat(3, auto [button-l] 11em [button-r] auto)
    [right] 5em;
  grid-template-rows: [top] auto [bottom] 10%;
`;

const buttonStyle = css`
  border-radius: 4em;
  background-color: #3d4055f0;
  color: #fff;
  padding-left: 1em;
  padding-right: 1em;
  border: none;
  width: 100%;

  :hover {
    cursor: pointer;
    background-color: #3d4055e0;
  }

  :focus {
    outline: 0;
    background-color: #3d4055e6;
  }
`;

const cornerButtonStyle = css`
  outline: none;
  border: none;
  background: none;

  position: absolute;
  z-index: 5;
  left: 0;
  top: 0;
  width: 8em;
  height: 8em;
  border-bottom-right-radius: 10em;
  background: #3d4055f0;

  :hover {
    cursor: pointer;
    background-color: #3d4055e0;
  }
`;

const textStyle = {
  fontFamily: "Manrope",
  fontSize: "1.8em",
  zIndex: 100,
  color: "#fcfcfc",
  userSelect: "none",
};

const Text = ({ children }) => <div css={textStyle}>{children}</div>;

function App() {
  const scenes = [img1, img2, img3, img4];
  const [room, setRoom] = useState("");
  const [name, setName] = useState("");
  const [call, setCall] = useState(false);

  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);

  useEffect(() => {
    setName("Grandma");
    console.log(`name is ${name}`);
  }, []);

  const handleChangeScene = () => {
    setCurrentSceneIndex((currentSceneIndex + 1) % scenes.length);
    console.log(currentSceneIndex);
  };

  const handleAvatarClick = (e) => {
    e.preventDefault();
    setRoom("ayw4b87vya5iw78yv5a78wyve5i78tvasi7vt5i6vi756vi764vi764v");
    setCall(!call);
  };

  return (
    <>
      <Helmet></Helmet>

      {call && (
        <div
          css={css`
            z-index: 50;
            position: relative;
            top: 10vh;
            left: 10vw;
            height: 80vh;
            width: 80vw;
          `}
        >
          <JitsiComponent
            roomName={room}
            password=""
            displayName={name}
            loadingComponent={<p>loading ...</p>}
            onMeetingEnd={() => setCall(false)}
          />
        </div>
      )}
      <div
        css={css`
          ${call && "filter: blur(5px);"}
          z-index: 10;
          position: absolute;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
        `}
        onClick={() => call && setCall(false)}
      >
        <Scene vr-mode-ui={{ enabled: false }} style={{ zIndex: -10 }}>
          <Entity particle-system={{ preset: "snow" }} />
          <Entity
            primitive="a-sky"
            rotation="0 -140 0"
            src={scenes[currentSceneIndex]}
          />
        </Scene>
        <button onClick={() => handleChangeScene()}>
          <div css={[cornerButtonStyle]}>
            <p
              css={css`
                ${textStyle}
                color: black;
                z-index: 100;
              `}
            >
              <FontAwesomeIcon icon={faSyncAlt} color="white" />
            </p>
          </div>
        </button>
        <div css={buttonContainerStyle}>
          <div
            style={{
              gridColumn: "button-l 1 / button-r 1",
              gridRow: "top /bottom",
            }}
          >
            <button css={resetStyle} onClick={handleAvatarClick}>
              <Contact src={profile1} />
            </button>
          </div>
          <div
            style={{
              gridColumn: "button-l 2 / button-r 2",
              gridRow: "top /bottom",
            }}
          >
            <button css={resetStyle} onClick={handleAvatarClick}>
              <Contact src={profile1} />
            </button>
          </div>
          <div
            style={{
              gridColumn: "button-l 3 / button-r 3",
              gridRow: "top /bottom",
            }}
          >
            <button css={resetStyle} onClick={handleAvatarClick}>
              <Contact src={profile1} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
