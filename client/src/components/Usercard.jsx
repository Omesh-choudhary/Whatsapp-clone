"use client"
import Link from 'next/link';
import { redirect, usePathname } from 'next/navigation';
import { NextRequest } from 'next/server';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { SetChatUser, SetMessages } from '../lib/features/user-feature/UserSlice';
import { LiaCheckDoubleSolid } from "react-icons/lia";
import { calculateTime } from '../lib/calculateTime';
import MessageStaus from './MessageStaus';
import axios from 'axios';
import { HOST } from '../app/constants/constants';

function UserCard({User}) {
    const dispatch = useDispatch()
    const pathname=usePathname()
    const LoginUser =  useSelector(state=>state.LoginUser)

    const handleClick=async()=>{
        const {data:messages}=await axios.get(`${HOST}/api/user/get-messages/${LoginUser.id}/${User.id}`)
        const currentmessages = messages.messages
        dispatch(SetMessages(currentmessages))
        dispatch(SetChatUser(User))
        redirect(`/user/chat/${User.id}`)
    }
    
  return (
    <div onClick={handleClick} >
    <div className={`w-full rounded-md  p-2 py-3 my-1 flex justify-between ${pathname.endsWith(`/chat/${User.id}`)?"bg-slate-500/40":""} hover:bg-slate-500/40 cursor-pointer`}>

        <div className="first-part flex items-start gap-x-4">

        <div className="avatar w-8 h-8 md:w-12 md:h-12 rounded-full overflow-clip">
            <img className='rounded-[50%]' src={User.avatar} alt='img' />
        </div>
        <div className="names">
            <h1 className="name ">{User.name}</h1>
            <h2 className="message flex items-center gap-x-1 text-gray-300">{User.senderId===LoginUser.id?<MessageStaus messageStatus={User.messageStatus}/>:""} {User.type==="text"?User.message:User.type}</h2>
        </div>
        </div>
        <div className="second-parrt">
            <h1 className="date text-sm text-gray-300">{calculateTime(User.createdAt)}</h1>
        </div>

    </div>
    </div>
   
  )
}

export default UserCard