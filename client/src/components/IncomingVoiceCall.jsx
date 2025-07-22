import { SetEndCall, SetVoicCall } from '../lib/features/user-feature/UserSlice'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import socket from "../lib/socket"
function IncomingVoiceCall() {
  const IncomingVoiceCall=useSelector(state=>state.IncomingVoiceCall)
    const dispatch=useDispatch()
    

    const acceptCall=()=>{
        dispatch(SetEndCall())
        dispatch(SetVoicCall(IncomingVoiceCall.from))
    }



    const rejectCall=()=>{
        socket.current.emit("reject-voice-call",{
            from:IncomingVoiceCall.from.id
        })

        dispatch(SetEndCall())
    }
  return (
    <div className='absolute z-20 bg-black  bottom-6 right-10 w-fit gap-14 px-6 py-4 rounded-md border-2 border-green-500  flex justify-center items-center'>
        <div className="img-box flex flex-col gap-2">
            <div className="img w-18 h-18 rounded-full overflow-clip">
                <img className='w-full h-full object-cover' src={IncomingVoiceCall.from.photo} alt="" />
            </div>
        </div>
        <div className="second flex flex-col ">
                    <h1 className="name text-xl">{IncomingVoiceCall.from.name}</h1>
                    <h1 className="call-type text-sm pb-1">Incoming voice call</h1>
                    <div className="icons flex gap-x-2">
                        <h1 onClick={acceptCall} className="accept px-3 py-1 rounded-full bg-green-400 cursor-pointer">Accept</h1>
                    <h1 onClick={rejectCall} className="reject px-3 py-1 rounded-full bg-red-400 cursor-pointer">Reject</h1>
                    </div>
                 </div>
    </div>
  )
}

export default IncomingVoiceCall
