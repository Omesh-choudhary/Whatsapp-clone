"use client"
import SideChats from '../../../../components/SideChats';
import { useSession } from 'next-auth/react';
import React, { useEffect, useRef } from 'react'
import { FaWhatsapp } from "react-icons/fa";

function page() {
 
  return (
   <div className="main flex w-full h-screen">
    <div className="side-chat w-full md:w-[45%] h-screen">
          <SideChats/>
          </div>
     <div className='w-full min-w-[25rem] hidden  h-screen md:flex justify-center items-center bg-slate-500/20'>
        <div className="box flex flex-col justify-center items-center w-[50%]">
            <div className="logo text-slate-500/50 text-8xl">
                <FaWhatsapp/>
            </div>
            <h1 className='text-xl text-center '>Whatsapp for windows</h1>
            <h2 className='text-sm text-gray-500 text-center'>Send and receive messages without keeping your phone online. </h2>
            <h2 className='text-sm text-gray-500 text-center'>Use Whatsapp on upto 4 linked devices and 1 phone at the same time </h2>
        </div>
    </div>
   </div>
  )
}

export default page