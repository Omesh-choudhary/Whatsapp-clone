"use client"
import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import EmojiPicker from 'emoji-picker-react';
import { IoVideocamOutline,IoCallOutline, IoClose } from "react-icons/io5";
import { VscSearch } from 'react-icons/vsc';
import { CiFaceSmile } from "react-icons/ci";
import { GrAttachment } from "react-icons/gr";
import { IoMicOutline } from "react-icons/io5";
import { VscSend } from "react-icons/vsc";
import MessageComponent from '../../../../../components/MessageComponents';
import { signOut } from 'next-auth/react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { HOST } from '../../../../constants/constants';
import { io } from 'socket.io-client';
import { SetAddMessage, SetMessages, SetSocket,SetMessageSearch, SetContactUsers, SetVideoCall, SetVoicCall, SetIncomingVideoCall, SetEndCall, SetIncomingVoiceCall } from '../../../../../lib/features/user-feature/UserSlice';
import { FaTrash } from 'react-icons/fa';
import CaptureAudio from '../../../../../components/CaptureAudio';
import SideChats, { GetIntialContacts } from '../../../../../components/SideChats';
import VideoCall from '../../../../../components/VideoCall';
import VoiceCall from '../../../../../components/VoiceCall';
import IncomingVoiceCall from '../../../../../components/IncomingVoiceCall';
import IncomingVideoCall from '../../../../../components/IncomingVideoCall';
import socket from "../../../../../lib/socket"



function page() {
  const [isRecording, setisRecording] = useState(false)
  const [message, setmessage] = useState("")
  const [socketEvent, setsocketEvent] = useState(false)
  const [showEmojiPicker, setshowEmojiPicker] = useState(false)
  const ChatUser = useSelector(state => state.ChatUser)
  const LoginUser = useSelector(state => state.LoginUser)
  const AllMessages = useSelector(state => state.Messages)
  const MessageSearch = useSelector(state => state.MessageSearch)
  const videoCall = useSelector(state => state.VideoCall)
  const IncomingvideoCall = useSelector(state => state.IncomingVideoCall)
  const voiceCall = useSelector(state => state.VoiceCall)
  const IncomingvoiceCall = useSelector(state => state.IncomingVoiceCall)
  const emojiPickerRef = useRef(null)
  const dispatch = useDispatch()
 

  
   useEffect(()=>{
   if (LoginUser) {
       socket.emit("add-user",LoginUser.id)
    
   }
  },[LoginUser])

  useEffect(()=>{
    const handleOutsideClick=(event)=>{

    
       if (event.target.id != "emoji-open") {

        if (emojiPickerRef.current &&  !emojiPickerRef.current.contains(event.target)) {
          setshowEmojiPicker(false)
        }
        
      }
      

    }

    document.addEventListener("click",handleOutsideClick)

    return ()=> {
     document.removeEventListener("click",handleOutsideClick)
    }
  },[])


  useEffect(()=>{

    if (socket && !socketEvent) {
      
      socket.on("msg-recieve",(data)=>{
        
        const newMessage = {...data.message}
        dispatch(SetAddMessage(newMessage))
      })

      socket.on("incoming-video-call",(data)=>{
          
        console.log(data)
        dispatch(SetIncomingVideoCall(data))
      })

      socket.on("incoming-voice-call",(data)=>{
        
        dispatch(SetIncomingVoiceCall(data))
      })

      socket.on("video-call-rejected",()=>{
        
        dispatch(SetEndCall())
      })

      socket.on("voice-call-rejected",()=>{
        
        dispatch(SetEndCall())
      })

      setsocketEvent(true)
    }


  },[socket])


  

  const handleEmojiClick=(emoji)=>{
     setmessage(prev=>prev+emoji.emoji)
  }


  const photoHandler=async(e)=>{

    const file = e.target.files?.[0]
    const formData = new FormData()
    formData.append("image",file)
    
    const {data}=await axios.post(`${HOST}/api/user/add-image-message/${LoginUser.id}/${ChatUser.id}`,
      formData,
     {
       headers:{
        "Content-Type":"multipart/form-data",
      }
     }
    )
    console.log(data.message)
    dispatch(SetAddMessage(data.message))


    socket.emit("send-msg",{
      to:ChatUser.id,
      from:LoginUser.id,
      message:data.message
    })


  }


  const HandleSendMessage=async(e)=>{
    e.preventDefault()
    setmessage("")
    const {data}=await axios.post(`${HOST}/api/user/add-message`,{
      to:ChatUser.id,
      from:LoginUser.id,
      message
    })

    socket.emit("send-msg",{
      to:ChatUser.id,
      from:LoginUser.id,
      message:data.message
    })

    dispatch(SetAddMessage(data.message))
    const {users}=await GetIntialContacts(LoginUser.id)
    dispatch(SetContactUsers(users))
    

  }

  const handleVideoCall=()=>{
       const date=Date.now()
    socket.emit("outgoing-video-call",{
                to:ChatUser.id,
                from:{
                  id:LoginUser.id,
                  photo:LoginUser.photo,
                  name:LoginUser.name
                },
                callType:"video",
                roomId:date
              })

    dispatch(SetVideoCall({...ChatUser,type:"out-going",callType:"video",roomId:Date.now()}))
    
  }

  const handleVoiceCall=()=>{
      const date=Date.now()
    socket.emit("outgoing-voice-call",{
      to:ChatUser.id,
      from:{
        id:LoginUser.id,
        photo:LoginUser.photo,
        name:LoginUser.name
      },
      callType:"audio",
      roomId:date
    })
    dispatch(SetVoicCall({...ChatUser,type:"out-going",callType:"audio",roomId:Date.now()}))
   
  }
  
  return <>
     {IncomingvideoCall && <IncomingVideoCall/>}
     {IncomingvoiceCall && <IncomingVoiceCall/>}
     {videoCall && <div className='w-full h-screen bg-black flex justify-center items-center'><VideoCall/></div>}
     {voiceCall && <div className='w-full h-screen bg-black flex justify-center items-center '><VoiceCall/></div>}
    {!voiceCall && !videoCall && (
     <div className="main flex w-full h-screen">
      <div className="side-chat hidden md:block w-[45%] h-screen">
      <SideChats/>
      </div>
       <div className='w-full min-w-[25rem] h-screen overflow-clip object-cover object-center relative'>
      <div className='flex w-full h-full'>
        <img className='w-[50%] h-full opacity-60' src="/whatsappBackground.jpg" alt="" />
        <img className='w-[50%] h-full opacity-60' src="/whatsappBackground.jpg" alt="" />
      </div>
        <header className='absolute top-0 z-10 w-full py-2 px-5 flex justify-between items-center bg-gray-800 border-b-[1.4px] border-gray-700 '>


            <div className="first-1 flex items-center gap-x-4">
                <h1 className="image w-12 h-12 rounded-full overflow-clip">
                  <img src={ChatUser.photo || undefined} alt='img' />
                </h1>
                      <h2 className="name block ">{ChatUser.name}</h2>
           </div>
               

             
             <div className="second-2 text-xl flex rounded-lg items-center">
              
                <h1 onClick={handleVideoCall} className='px-3 py-2 hover:bg-gray-600 bg-gray-600/40 rounded-l-lg border-r-[1px] border-gray-600 '><IoVideocamOutline/></h1>
                <h1 onClick={handleVoiceCall} className='px-3 py-2 hover:bg-gray-600 bg-gray-600/40 rounded-r-lg  '><IoCallOutline/></h1>
                <h1 onClick={()=>dispatch(SetMessageSearch())} className=' ml-1 px-3 py-2 hover:bg-gray-600 rounded-lg '><VscSearch className='text-lg hover:scale-90'/></h1>
             </div>

        </header>

         {MessageSearch && (<div className="message-search absolute top-16 right-4 z-8 flex gap-2 justify-center items-center bg-gray-800 p-2">
          <div className="search-bar text-sm flex items-center rounded-md p-[0.2rem] px-2 gap-2 w-[95%] mx-auto bg-slate-700/70 border-b-[2px] border-green-500">
                     <VscSearch/>
                     <input className='bg-transparent outline-none text-gray-300 w-full' type="text" placeholder='Search within chat' />
                    </div >
                     <IoClose onClick={()=>dispatch(SetMessageSearch())} className='text-lg cursor-pointer'/>
         </div>)}


        <main className='messages no-scrollbar absolute  bottom-12 top-14  z-2 w-full h-[87vh] px-4 pb-2  overflow-y-auto'>
          {AllMessages.length>0 && AllMessages?.map((message,i)=>(
            <Fragment key={i}>
             <MessageComponent message={message} />
            </Fragment>
          ))}
        </main>

        <footer className='absolute  bottom-0 z-2 w-full py-[0.6rem] px-3   gap-x-2  text-xl bg-gray-800/80 border-[1px] border-black'>
               {!isRecording?<form onSubmit={HandleSendMessage} className='flex justify-between items-center'>
                <h1 onClick={()=>setshowEmojiPicker(prev=>!prev)}  className='px-2 py-2 hover:bg-gray-600 rounded-lg'> <CiFaceSmile id='emoji-open'/></h1>
                { showEmojiPicker &&  <div ref={emojiPickerRef}  className='absolute bottom-24 left-16 z-40'><EmojiPicker onEmojiClick={handleEmojiClick} theme='dark'/></div> }
               
               <h1 className='px-2 py-2 hover:bg-gray-600 rounded-lg relative'> <GrAttachment/>
               <input onChange={photoHandler} type="file" className='w-6 h-6 bg-red-400 absolute top-2 z-2 opacity-0 rounded-md'/>
               </h1>
              
               
               <input onChange={(e)=>setmessage(e.target.value)} value={message} className='w-full outline-none py-1 px-2 bg-transparent text-sm' type="text" placeholder='Type a message' />
               {
                message.length>0? <h1 onClick={HandleSendMessage} className='px-2 py-2 hover:bg-gray-600 rounded-lg cursor-pointer'><VscSend/></h1>:<h1 onClick={()=>setisRecording(true)} className='px-2 py-2 hover:bg-gray-600 rounded-lg'><IoMicOutline/></h1>
               }
              
               </form>:<div className='flex justify-end items-center'><h1 onClick={()=>setisRecording(false)} className='px-2 py-2 cursor-pointer'><FaTrash/></h1><CaptureAudio/></div>}
        </footer>
    </div>
     </div>
    )}
  </>
  
}

export default page