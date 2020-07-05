/** @jsx jsx */
/** @jsxFrag React.Fragment */
import React, { useState } from "react";
import { jsx, css } from "@emotion/core";
import "aframe";
import "aframe-particle-system-component";
import { Entity, Scene } from "aframe-react";
import { Helmet } from "react-helmet";
import { Jutsu } from "react-jutsu";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSyncAlt } from "@fortawesome/free-solid-svg-icons";

import Contact from "./components/Contact";

import profile1 from "./assets/profile1.jpeg";

import img1 from "./assets/img1.jpg";
import img2 from "./assets/img2.jpg";
import img3 from "./assets/img3.jpg";
import img4 from "./assets/img4.jpg";

// const Container = styled.div`

// `

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

  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);

  const handleChangeScene = () => {
    setCurrentSceneIndex((currentSceneIndex + 1) % scenes.length);
    console.log(currentSceneIndex);
  };

  return (
    <>
      <Helmet>
        <script src="https://meet.jit.si/external_api.js"></script>
      </Helmet>
      <Scene vr-mode-ui={{ enabled: false }} style={{ zIndex: -10 }}>
        {/* <Entity
          geometry={{ primitive: "box" }}
          material={{ color: "red" }}
          position={{ x: 0, y: 0, z: -5 }}
        /> */}
        <Entity particle-system={{ preset: "snow" }} />
        {/* <Entity light={{ type: "point" }} /> */}
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
        {/* <div style={{ gridColumn: "left / right", gridRow: "top / bottom" }}>
          <Text>Fise Project Test</Text>
          <Button onClick={(e) => handleChangeScene(e)}>
            <Text>Change Scene</Text>
          </Button>
        </div> */}
        <div
          style={{
            gridColumn: "button-l 1 / button-r 1",
            gridRow: "top /bottom",
          }}
        >
          <button css={resetStyle} onClick={() => handleChangeScene()}>
            <Contact src={profile1} />
          </button>
        </div>
        <div
          style={{
            gridColumn: "button-l 2 / button-r 2",
            gridRow: "top /bottom",
          }}
        >
          <button css={resetStyle} onClick={() => handleChangeScene()}>
            <Contact src={profile1} />
          </button>
        </div>
        <div
          style={{
            gridColumn: "button-l 3 / button-r 3",
            gridRow: "top /bottom",
          }}
        >
          <button css={resetStyle} onClick={() => handleChangeScene()}>
            <Contact src={profile1} />
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
