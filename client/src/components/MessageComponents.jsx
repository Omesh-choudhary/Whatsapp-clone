import React from 'react'
import moment from 'moment';
import { fileFormat } from '../lib/fileformat';
import RenderAttachment from "./RenderAttachment"
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { calculateTime } from '../lib/calculateTime';
import MessageStaus from './MessageStaus';
import { HOST } from '../app/constants/constants';
import VoiceMessage from './VoiceMessage';


function MessageComponent({message}) {
     
    const LoginUser = useSelector(state=>state.LoginUser)
    const sameSender= LoginUser?.id===message?.senderId
    
  return (
    <div className={`w-full flex ${sameSender?"justify-end":"justify-start"} my-6 px-2 `}>
        <div className={`message-box relative w-fit ${message?.type==="image"?"p-1":"px-2 pt-2 p-[0.2rem] "} ${sameSender?"bg-green-800":"bg-slate-600/70"} rounded-md overflow-clip`}>
            {/* {!sameSender && <div className="name text-sm font-semibold text-[#0583b5]">{message.sender.name}</div>} */}
            <div className={`message flex  relative`}>
                {message.type==="text" && <div className='text-sm'>{message.message}</div>}
                {message.type==="audio" && <VoiceMessage message={message.message}/>}
                 {message.type==="image" && <div className='image w-[22vw] max-h-[22vw] rounded-md overflow-clip'><img src={`${HOST}/${message.message}`} alt="" /></div>}

               
                 <div className={`time ${message.type==="image"?"absolute bottom-1 right-1 z-2":""}  text-[0.57rem] pt-[0.3rem] pl-[0.8rem]  flex items-end justify-center `}>
                    <div>{calculateTime(message.createdAt)}</div>
                    <div>{message.senderId==LoginUser.id && <MessageStaus messageStatus={message.messageStatus} />}</div>
                 </div>
            </div>
           
        </div>
    </div>
  )
}

export default MessageComponent