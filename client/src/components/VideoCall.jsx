import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { MdCall, MdCallEnd } from "react-icons/md";
import { SetEndCall } from '../lib/features/user-feature/UserSlice';
import ZegocloudService from '../lib/ZegocloudService';
import socket from "../lib/socket"
function VideoCall() {
    const dispatch = useDispatch()
     const videoCall = useSelector(state => state.VideoCall)
    
     const ChatUser = useSelector(state => state.ChatUser)
     const LoginUser = useSelector(state => state.LoginUser)
     
    
   
    const rejectCall=()=>{
            socket.emit("reject-video-call",{
                from:videoCall.id
            })
    
            dispatch(SetEndCall())
        }
    
  return (
    <div className='box w-[60%] flex flex-col gap-2 justify-center items-center'>
        <h1 className="name text-[3.5vw]">{videoCall.name}</h1>
         <h2 className="call-status">Video calling...</h2>
         <div className="img w-[20%] h-[20%] rounded-full overflow-clip">
            <img className='w-full h-full object-cover' src={videoCall.photo} alt="" />
         </div>
         <div className="video">
          {<ZegocloudService data={videoCall}/>}
         </div>
            <MdCallEnd onClick={rejectCall} className='text-5xl text-white p-2 rounded-full bg-red-400 cursor-pointer' />

    </div>
  )
}

export default VideoCall