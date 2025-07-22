import React from 'react'
import { BiCheck, BiCheckDouble } from "react-icons/bi";


function MessageStaus({messageStatus}) {
  return <>
         {messageStatus =="sent" && <BiCheck className='text-lg'/>}
         {messageStatus =="delivered" && <BiCheckDouble className='text-lg'/>}
         {messageStatus =="read" && <BiCheckDouble className='text-lg text-blue-400 font-extralight'/>}
  </>
}

export default MessageStaus