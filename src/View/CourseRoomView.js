import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import styled from "styled-components";
import {YOUR_API_KEY} from '../Utils/Authentication.js';
import axios from "axios";

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  flex-direction: row;
`;

const LeftRow = styled.div`
  width: 40%;
  height: 100%;
`;

const RightRow = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Video = styled.video`
  height: 50%;
  width: 100%;
  border: 1px solid black;
`;

const Room = (props) => {
  const socketRef = useRef();
  const userVideoRef = useRef();
  const partnerVideo = useRef();
  const peerRef = useRef();
  const VideoPlayer = useRef();
  //const [inputvalue, setInputvalue] = useState("");
  const [videoID, setVideoID] = useState("");
  const [videohost, setVideohost] = useState("");

  function createPeer(partnerID, callerID, stream) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream
    });

    peer.on("signal", (signal) => {
      const payload = {
        partnerID,
        callerID,
        signal
      };
      socketRef.current.emit("call partner", payload);
    });

    peer.on("stream", handleStream);
    peer.on("data", handleData);

    return peer;
  }

  function addPeer(incomingSignal, callerID, stream) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream
    });

    peer.on("signal", (signal) => {
      const payload = {
        callerID,
        signal
      };
      socketRef.current.emit("accept call", payload);
    });

    peer.on("stream", handleStream);
    peer.on("data", handleData);

    peer.signal(incomingSignal);
    return peer;
  }

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        userVideoRef.current.srcObject = stream;
        socketRef.current = io.connect('https://backendteamlearning.herokuapp.com/',{
  'sync disconnect on unload':true,
   withCredentials: false
});
        //http://ec2-3-17-9-85.us-east-2.compute.amazonaws.com:5000/
        socketRef.current.emit("join room", props.match.params.roomID);

        socketRef.current.on("other user", (partnerID) => {
          if (partnerID) {
            peerRef.current = createPeer(
              partnerID,
              socketRef.current.id,
              stream
            );
          }
        });

        socketRef.current.on("caller signal", (incoming) => {
          peerRef.current = addPeer(incoming.signal, incoming.callerID, stream);
        });

        socketRef.current.on("callee signal", (signal) => {
          peerRef.current.signal(signal);
        });

        socketRef.current.on("room full", () => {
          alert("room is full");
        });
      });
  }, [props.match.params.roomID]);


  function handlePanopto() {
    var firstScriptTag = document.getElementsByTagName('script')[0];
    var tag = document.createElement("script");
    tag.src = "https://developers.panopto.com/scripts/embedapi.min.js";
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    window.onPanoptoEmbedApiReady = onPanoptoEmbedApiReady;
  }

  function handleYoutube() {
    var tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    window.onYouTubeIframeAPIReady = loadVideoPlayer;
  }

  function onPanoptoEmbedApiReady(){
            const player = new window.EmbedApi("player", {
                width: "640",
                height: "390",
                //This is the URL of your Panopto site
                serverName: "uncch.hosted.panopto.com",
                sessionId: videoID,
                videoParams: { // Optional parameters
                //interactivity parameter controls if the user sees table of contents, discussions, notes, & in-video search
                    "interactivity": "none",
                    "showtitle": "false"
                },
                events: {
                    "onIframeReady": onPanoptoIframeReady,
                    "onReady": onPanoptoVideoReady,
                    "onStateChange": onPanoptoStateUpdate
                }
            });
            VideoPlayer.current = player;
  }

  function onPanoptoIframeReady()
  {
    VideoPlayer.current.loadVideo();
  }

    //The API will call this function when the video player is ready
  function onPanoptoVideoReady()
  {
      VideoPlayer.current.seekTo(100);
  }

  //The API calls this function when a player state change happens
   function onPanoptoStateUpdate(state)
  {
          VideoPlayer.current.setVolume(0.3);
          VideoPlayer.current.setPlaybackRate(2);
  }

  function loadVideoPlayer() {
    const player = new window.YT.Player("player", {
      height: "390",
      width: "640",
      videoId: videoID
    });

    VideoPlayer.current = player;
  }

  function stopVideo() {
    try {
          peerRef.current.send(JSON.stringify({ type: "pause" }));
      }
      catch(err) {
      }
    VideoPlayer.current.pauseVideo();
  }

  function playVideo() {
    try {
        peerRef.current.send(JSON.stringify({ type: "play" }));
      }
      catch(err) {
      }
    VideoPlayer.current.playVideo();
  }

  function handleVideo(){
    document.getElementsByTagName('input')[0].remove();
    document.getElementById('loadVideo').remove();
    if(videohost=="y"){
      handleYoutube();
    } else {
      handlePanopto();
    }
    var play= document.createElement("button");
    play.innerHTML = "Play Video";
    play.addEventListener ("click", playVideo);
    var stop= document.createElement("button");
    stop.innerHTML = "Stop Video";
    stop.addEventListener ("click", stopVideo);
    var div = document.getElementById("controls");
    div.appendChild(play);
    div.appendChild(stop);
    axios.get(`https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoID}&key=${YOUR_API_KEY}`)
      .then((response)=>{
        console.log(response.data);
        let title = response.data.items[0].snippet.title;
        let description=response.data.items[0].snippet.description;
        document.getElementById("videoTitle").innerHTML=title;
        document.getElementById("videoDescription").innerHTML=description;
      }).catch(err=>console.log(err));
  }

  function loadVideo() {
    if(videohost==''){
      alert("please select video player first");
      return;
    }
    if(videoID==''){
      alert("please upload video id");
      return;
    }
    try {
        peerRef.current.send(JSON.stringify({ type: "newVideo",host:videohost, data: videoID }));
      }
      catch(err) {
    }
    handleVideo();
  }

  useEffect(() => {
    if(videohost=='y'){
      document.getElementById('YT').style.backgroundColor="#666666";
      document.getElementById('PT').style.backgroundColor="#668cff";
    }else if(videohost=='n'){
      document.getElementById('YT').style.backgroundColor="#668cff";
      document.getElementById('PT').style.backgroundColor="#666666";
    }
  },[videohost])


  function ClickYoutube(e){
    setVideohost("y");
  }

  function ClickPT(e){
    setVideohost("n");
  }


  function handleStream(stream) {
    partnerVideo.current.srcObject = stream;
  }


  function handleData(data) {
    const parsed = JSON.parse(data);
    if (parsed.type === "newVideo") {
      setVideohost(parsed.host);
      setVideoID(parsed.data);
    } else if (parsed.type === "pause") {
      VideoPlayer.current.pauseVideo();
    } else {
      VideoPlayer.current.playVideo();
    }
  }

  return (
    <Container>
      <LeftRow>
        <Video muted autoPlay ref={userVideoRef} />
        <Video muted autoPlay ref={partnerVideo} />
      </LeftRow>
      <RightRow>
        <div id = "host">
        <button id="PT" backgroundColor="#668cff" onClick={ClickPT}>Panopto</button>
        <button id="YT" backgroundColor="#668cff" onClick={ClickYoutube}>Youtube</button>
        </div>
        <div id="player" />
        <div id="controls">
        <input type="text" placeholder="video link" value={videoID} onChange={e => setVideoID(e.target.value)} />
        <button id ="loadVideo" onClick={loadVideo}>Load video</button>
        </div>
        <div>
        <h3 id="videoTitle"></h3>
        <br/>
        <p id="videoDescription"></p>
        </div>

      </RightRow>
    </Container>
  );
};

export default Room;
