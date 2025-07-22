"use client"
import React, { Fragment, useEffect, useMemo, useState } from 'react'
import { PiNotePencilLight } from "react-icons/pi";
import { RxHamburgerMenu } from "react-icons/rx";
import { VscSearch } from "react-icons/vsc";
import { BiMessageRoundedDetail } from "react-icons/bi";
import { IoCallOutline } from "react-icons/io5";
import { CgCircleci } from "react-icons/cg";
import { IoIosStarOutline } from "react-icons/io";
import { FaArchive } from "react-icons/fa";
import { CiSettings } from "react-icons/ci";
import { BsFilter } from "react-icons/bs";
import UserCard from './Usercard';

import Contactcard from './Contactcard';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { SetAllUser, SetLoginUser,SetContactUsers,SetOnlineUsers, SetFiltersContacts } from '../lib/features/user-feature/UserSlice';
import { HOST } from '../app/constants/constants';
 


export const GetIntialContacts=async(id)=>{
   const {data:users} = await axios.get(`${HOST}/api/user/get-intial-contacts/${id}`)
   return users
}


export default  function SideChats() {
  const [getContact, setgetContact] = useState(false)
  const [allContacts, setallContacts] = useState([])
  const [searchTerm, setsearchTerm] = useState("")
  const [UserSearchTerm, setUserSearchTerm] = useState("")
  const [searchContacts, setsearchContacts] = useState([])
  const [searchUsers, setsearchUsers] = useState([])
  const videoCall = useSelector(state => state.VideoCall)
const voiceCall = useSelector(state => state.VoiceCall)

  const dispatch = useDispatch()

 
  
  const LoginUser =  useSelector(state=>state.LoginUser)
  const IntialContactUsers =  useSelector(state=>state.ContactUsers)
  const id = parseInt(LoginUser.id)


useEffect(()=>{
    try {
      
    const GetContacts=async()=>{
   const {data:users} = await axios.get(`${HOST}/api/user/get-users/${id}`)

   setallContacts(users.users)
   setsearchContacts(users.users)
   
}
GetContacts()
 } catch (error) {
  console.log(error)
 }

},[getContact])
  
  useEffect(()=>{
    if (searchTerm.length>0) {
        const filteredData={};
      Object.keys(allContacts).forEach((keys)=>{
         allContacts[keys].forEach((obj)=>{
          if (obj.name.toLowerCase().includes(searchTerm.toLowerCase())) {
            filteredData[keys]=[]
            filteredData[keys].push(obj)
          }
         })
      })
      setsearchContacts(filteredData) 
      
    }else{
      
      setsearchContacts(allContacts)
     
    }
  },[searchTerm])

   useEffect(()=>{
    try {    
    const GetChatUser=async()=>{
      const {users}= await GetIntialContacts(id)
      dispatch(SetContactUsers(users))
      

    }

    GetChatUser()

 } catch (error) {
  console.log(error)
 }

},[getContact])

useEffect(()=>{
  if (UserSearchTerm.length) {
    let filterContacts=[]
    IntialContactUsers.forEach((contact)=>{
      if (contact.name.toLowerCase().includes(UserSearchTerm.toLowerCase())) {
        filterContacts.push(contact)
      }
    })

    setsearchUsers(filterContacts)
    
  }
},[UserSearchTerm])



  return <>
 
    <div className='h-screen w-full flex relative'>
      {getContact && (
        <div id='search-box' className="  contact-box w-80 h-[50%]  p-2 border-2 border-slate-800  rounded-md absolute top-14 left-72 z-20 bg-slate-700/60 backdrop-blur-md ">
        <div className="heading text-white text-2xl mb-2 ">
                
                chats
            </div>
            <div className="search-bar flex items-center rounded-md p-[0.3rem] px-2 gap-2 w-[95%] mx-auto bg-slate-500/50 border-b-[2px] border-white mb-2 hover:border-green-500 ">
             <VscSearch/>
             <input onChange={(e)=>setsearchTerm(e.target.value )} className='bg-transparent outline-none text-gray-300 w-full' type="text" placeholder='Search contacts' />
            </div >
            <div className="no-scrollbar contacts w-full h-[78%] overflow-clip overflow-y-auto ">
             <h1 className='px-2 mb-4'>All contacts </h1>  
              
        {
          Object.entries(searchContacts).map(([initialLetter,userList])=>(
            <div key={initialLetter}>
              <div className='font-semibold'>{initialLetter}</div>
              {userList.map(({id,name,email,avatar,bio})=>(
              <div onClick={()=>setgetContact(false)} key={id}>
               <Contactcard id={id} name={name} email={email} photo={avatar} bio={bio}/>
             </div>
              ))}
            </div>
            
          ))
          
        }
        </div>

      </div>
      )}
    <div className="first-side w-fit md:w-[12%] py-4 px-2 h-full flex flex-col justify-between items-center text-xl bg-slate-900/70">
      <div className="part-1 flex flex-col gap-y-8">
        <RxHamburgerMenu/>
        <BiMessageRoundedDetail/>
        <IoCallOutline/>
        <CgCircleci/>
      </div>
      <div className="part-2 flex flex-col gap-y-8 justify-center items-center">
        <IoIosStarOutline/>
        <FaArchive/>
        <CiSettings/>
        <h1 className="img w-8 h-8 rounded-full overflow-clip">
          <img src={LoginUser.photo} alt="img" />
           
        </h1>
      </div>
      
    </div>
    <div className="second-side w-full  max-h-screen bg-slate-500/20 border-[1px] border-black ">
     <header>

        <div className="header-first flex justify-between items-center p-2 py-3">
            <div className="heading text-2xl ">
                Chats
            </div>
            <div className="icons text-3xl flex gap-6 text-white">
              <PiNotePencilLight className='hover:bg-slate-600 p-1 rounded-md' id='get-contact' onClick={()=>setgetContact((prev)=>!prev)}/>
              <BsFilter className='hover:bg-slate-600 p-1 rounded-md'/>
            </div>
        </div>

         <div className="header-second">
            <div className="search-bar flex items-center rounded-md p-[0.3rem] px-2 gap-2 w-[90%] mx-auto bg-slate-500/50 border-b-[2px] border-white mb-2 hover:border-green-500 ">
             <VscSearch/>
             <input value={UserSearchTerm} onChange={(e)=>setUserSearchTerm(e.target.value)}  className='bg-transparent outline-none text-gray-300 w-full' type="text" placeholder='Search or start a new chat' />
            </div>
         </div>

         

     </header>
     

      <div  className='main no-scrollbar w-full h-[87%]  overflow-y-auto px-2  pt-3  '>

        {(UserSearchTerm.length?searchUsers:IntialContactUsers)?.map((contact)=>(
          <div key={contact.id}>
            <UserCard User={contact}/>
          </div>
        ))}
      
     </div>
    


    </div>
    </div>

  </>
}

