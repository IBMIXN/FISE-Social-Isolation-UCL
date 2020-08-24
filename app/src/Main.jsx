/** @jsx jsx */
/** @jsxFrag React.Fragment */
import React, { useEffect, useState } from "react";
import { jsx, css } from "@emotion/core";
import "aframe";
import "aframe-particle-system-component";
import { Entity, Scene } from "aframe-react";
import { Helmet } from "react-helmet";

import MicRecorder from "mic-recorder-to-mp3";

import JitsiComponent from "./components/JitsiComponent";

import img1 from "./assets/img1.jpg";
import img2 from "./assets/img2.jpg";
import img3 from "./assets/img3.jpg";
import img4 from "./assets/img4.jpg";
import { Redirect } from "react-router-dom";
import { Box, Icon, Image, Stack, Text } from "@chakra-ui/core";

const Mp3Recorder = new MicRecorder({ bitRate: 128 });

function Main() {
  const scenes = [img1, img2, img3, img4];
  const [room, setRoom] = useState("");
  const [call, setCall] = useState(false);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);

  const [isMicrophoneRecording, setIsMicrophoneRecording] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blobURL, setBlobURL] = useState("");

  useEffect(() => {
    navigator.mediaDevices.getUserMedia(
      { audio: true },
      () => {
        console.log("Permission Granted");
        setIsBlocked(false);
      },
      () => {
        console.log("Permission Denied");
        setIsBlocked(true);
      }
    );
  }, []);

  // const user = {"_id":"7c785ed8-5666-4ea4-b30c-d16baa3feed3","name":"Jim","isCloudEnabled":"true","otc":"probably-prepare-pay","ar_scenes":[],"contacts":[{"_id":"7c9c0aee-70af-44e1-b343-d177219e40a3","name":"Sandra","email":"leads2020@alphabetiq.com","relation":1,"profileImage":""}]}
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return <Redirect to="/onboarding" />;

  const handleChangeScene = () => {
    setCurrentSceneIndex((currentSceneIndex + 1) % scenes.length);
    console.log(currentSceneIndex);
  };

  const handleMicrophoneClick = async (e) => {
    if (isMicrophoneRecording) {
      // End recording
      Mp3Recorder.stop()
        .getMp3()
        .then(([buffer, blob]) => {
          const blobURL = URL.createObjectURL(blob);
          setBlobURL(blobURL);
          setIsMicrophoneRecording(false);
        })
        .catch((e) => console.log(e));
    } else {
      // Begin recording
      if (isBlocked) {
        console.log("Permission Denied");
      } else {
        Mp3Recorder.start()
          .then(() => {
            setIsMicrophoneRecording(true);
          })
          .catch((e) => console.error(e));
      }
    }
  };

  const handleAvatarClick = async (contact_id) => {
    await fetch(`${process.env.REACT_APP_SERVER_URL}/api/otc/${user.otc}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `contact_id=${contact_id}`,
    })
      .then((r) => {
        if (r.ok) {
          return r.json();
        }
        throw r;
      })
      .then(({ message, data }) => {
        setRoom(contact_id);
        setCall(!call);
      })
      .catch(async (err) => {
        if (err instanceof Error) {
          throw err;
        }
        throw await err.json().then((rJson) => {
          console.error(
            `HTTP ${err.status} ${err.statusText}: ${rJson.message}`
          );
          return;
        });
      });
  };

  return (
    <>
      <Helmet></Helmet>

      {user && call && (
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
            displayName={user.name}
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
        {scenes.length > 1 && (
          <button onClick={handleChangeScene}>
            <Box
              pos="absolute"
              top="0"
              left="0"
              bg="gray.600"
              pr="1rem"
              pb="1rem"
              pt="0.5rem"
              pl="0.5rem"
              roundedBottomRight="70%"
            >
              <Icon color="white" name="repeat" size="4rem" m="1rem" />
            </Box>
          </button>
        )}
        {user.isCloudEnabled === "true" && (
          <button onClick={handleMicrophoneClick}>
            <Box
              pos="absolute"
              top="0"
              right="0"
              bg="gray.600"
              pr="1rem"
              pb="1rem"
              pt="0.5rem"
              pl="0.5rem"
              roundedBottomLeft="70%"
            >
              <Icon
                name="microphone"
                size="4rem"
                m="1rem"
                color={isMicrophoneRecording ? "red.500" : "white"}
              />
            </Box>
          </button>
        )}
        {user.contacts && (
          <Box
            pos="absolute"
            bottom="20%"
            left={`calc(50vw - ${
              user.contacts.length === 1 ? "5" : user.contacts.length * 7
            }rem)`}
          >
            <Stack isInline spacing="6rem">
              {user.contacts.map((contact) => (
                <button
                  style={{ outline: "none" }}
                  onClick={() => handleAvatarClick(contact._id)}
                >
                  {contact.profileImage ? (
                    <Image
                      rounded="full"
                      size="10rem"
                      src={contact.profileImage}
                      alt="Segun Adebayo"
                      pointerEvents="none"
                    />
                  ) : (
                    <Box w="10rem" h="10rem" rounded="100%" bg="red.300">
                      <Text fontSize="6rem" lineHeight="10rem">
                        {contact.name[0]}
                      </Text>
                    </Box>
                  )}
                </button>
              ))}
            </Stack>
            <audio src={blobURL} controls="controls" />
          </Box>
        )}
      </div>
    </>
  );
}

export default Main;