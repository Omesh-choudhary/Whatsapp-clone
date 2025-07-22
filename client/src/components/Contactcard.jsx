"use client"

import { redirect, usePathname } from 'next/navigation';
import { useDispatch, useSelector  } from 'react-redux';
import { SetChatUser, SetMessages} from '../lib/features/user-feature/UserSlice';
import React from 'react'
import axios from 'axios';
import { HOST } from '../app/constants/constants';


function Contactcard({id,name,photo,email,bio}) {
    const pathname=usePathname()
    const dispatch = useDispatch()
    const LoginUser =  useSelector(state=>state.LoginUser)

    const handleClick=async()=>{
         const {data:messages}=await axios.get(`${HOST}/api/user/get-messages/${LoginUser.id}/${id}`)
        const currentmessages = messages.messages
        dispatch(SetMessages(currentmessages))
        dispatch(SetChatUser({id,name,email,photo}))
        
        const path = pathname.split("/")[0]
        redirect( path +`/user/chat/${id}`)

    }
  return (
    
    <div onClick={handleClick} className={`w-full rounded-md  p-2 py-3 my-1 flex justify-between ${pathname.endsWith(`/chat/${id}`)?"bg-slate-500/40":""} hover:bg-slate-500/40 cursor-pointer`}>

        <div className="first-part flex items-start gap-x-4">

        <div className="avatar w-10 h-10  rounded-full overflow-clip">
            <img className='rounded-[50%]' src={photo} alt='img' />
        </div>
        <div className="names">
            <h1 className="name ">{name}</h1>
            <h2 className="message flex items-center gap-x-1 text-gray-300">{bio}</h2>
        </div>
        </div>

    </div>
   
  )
}

export default Contactcard