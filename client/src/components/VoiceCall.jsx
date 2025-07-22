import React, { useEffect } from 'react'
import { MdCall, MdCallEnd } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'
import { SetEndCall } from '../lib/features/user-feature/UserSlice';
import ZegocloudService from '../lib/ZegocloudService';
import socket from "../lib/socket"
function VoiceCall() {
    const dispatch = useDispatch()
    const voiceCall = useSelector(state => state.VoiceCall)
    


    const rejectCall=()=>{
                socket.emit("reject-voice-call",{
                    from:voiceCall.id
                })
        
                dispatch(SetEndCall())
            }
    
  return (
    <div className='box w-[60%] flex flex-col gap-2 justify-center items-center '>
        <h1 className="name text-[3.5vw]">{voiceCall.name}</h1>
         <h2 className="call-status">Voice calling...</h2>
         <div className="img w-[20%] h-[20%] rounded-full overflow-clip">
            <img className='w-full h-full object-cover' src={voiceCall.photo} alt="" />
         </div>
         <div className="audio">
          {ZegocloudService("audio")}
         </div>
            <MdCallEnd onClick={rejectCall} className='text-5xl text-white p-2 rounded-full bg-red-400 cursor-pointer' />

    </div>
  )
}

export default VoiceCall