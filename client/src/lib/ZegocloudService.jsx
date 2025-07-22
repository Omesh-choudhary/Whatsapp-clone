import { stringify } from 'querystring';
import { HOST } from '../app/constants/constants';
import React, { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { ZegoExpressEngine } from 'zego-express-engine-webrtc';

const APP_ID =  parseInt(process.env.PUBLIC_NEXT_ZEGO_APP_ID);
                     // 🔐 Replace with your Zego App ID
const SERVER_URL = "wss://webliveroom2061639141-api.coolzcloud.com/ws"; // region-specific

export default function ZegocloudService({ data }) {
   const LoginUser = useSelector(state => state.LoginUser)  
  const zgRef = useRef(null);
  const localRef = useRef();
  const remoteRef = useRef();
  const [inCall, setInCall] = useState(false);
  
  console.log(data)
  const startCall = async () => {
    // Get token from your backend
    const res = await fetch(`${HOST}/api/auth/generate-token/${LoginUser.id}`);
    const { token } = await res.json();
console.log(token)
    // Initialize Zego engine
    const zg = new ZegoExpressEngine(APP_ID, SERVER_URL);
    zgRef.current = zg;

    await zg.checkSystemRequirements();

    zg.on('roomStreamUpdate', async (_roomID, updateType, streamList) => {
      if (updateType === 'ADD') {
        const remoteStream = await zg.startPlayingStream(streamList[0].streamID);
        remoteRef.current.srcObject = remoteStream;
      }
    });

    await zg.loginRoom(data.roomId.toString(), token, { userID:LoginUser.id.toString() , userName:LoginUser.name })
     .then(() => console.log('Logged in successfully'))
     .catch(err => console.error('loginRoom error:', err));

    const localStream = await zg.createStream({
      camera: { audio: true, video: data.callType === 'video' },
    });

    localRef.current.srcObject = localStream;
    await zg.startPublishingStream(`${stringify(data.roomId)}_${data.id || data.from.id}`, localStream)
    .catch(err => console.error('publish error:', err));

    setInCall(true);
  };

  startCall()

  const endCall = async () => {
    const zg = zgRef.current;
    if (zg) {
      zg.stopPublishingStream(`${roomID}_${userID}`);
      zg.destroyStream(localRef.current.srcObject);
      zg.logoutRoom(roomID);
      zg.destroy();
    }
    setInCall(false);
  };

  return (
    <div>
      {/* {!inCall && (
        <button onClick={startCall}>
          Start {callType === 'video' ? 'Video' : 'Voice'} Call
        </button>
      )} */}
      {inCall && <button onClick={endCall}>End Call</button>}
      <div>
        <video
          ref={localRef}
          autoPlay
          muted
          playsInline
          style={{ width: data.callType === 'video' ? 200 : 0 }}
        />
        <video
          ref={remoteRef}
          autoPlay
          playsInline
          style={{ width: data.callType === 'video' ? 200 : 0 }}
        />
      </div>
    </div>
  );
}
