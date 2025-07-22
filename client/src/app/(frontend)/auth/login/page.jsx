"use client"
import React, { useState } from 'react'

import GoogleButton from 'react-google-button'
import { signIn, useSession } from 'next-auth/react';
import Image from 'next/image';
import axios from 'axios';
import { HOST } from '../../../constants/constants';
import { redirect } from "next/navigation";
import { useDispatch } from 'react-redux';
import { SetLoginUser } from '../../../../lib/features/user-feature/UserSlice';
import { toast } from 'react-toastify';
import localStorage from 'redux-persist/es/storage';





 function page() {
    const [IsLoggin, setIsLoggin] = useState(true)
    const dispatch = useDispatch()
    const handleGoogleLogin=async()=>{
        console.log("hello")
       const response = await signIn("google",{redirect:false})
       console.log("response",response)
    }

     const submitHandler=async(formdata)=>{
          
        const name=formdata.get("name")
        const email=formdata.get("email")
        const password=formdata.get("password")

        const {data} = await axios.post(`${HOST}/api/auth/${IsLoggin?`login`:`signup`}`,{name,email,password})
        
        if (data.success) {
            
            dispatch(SetLoginUser(data))
            toast.success("login successfully")
            redirect(`/user/home`)
        }
        else{
            toast.error(data.error)
        }

    }

   
  return (
    <div className='w-full h-screen flex justify-center items-center'>
        <div className="auth-box flex flex-wrap shrink-0 justify-center items-center gap-4 h-fit w-[50vw]">
            <div className="whatsapp-logo rounded-md relative">
                <h1 className='text-4xl w-full text-center font-semibold mb-6   space-x-3'>Whatsapp</h1>
                <Image style={{width:"auto", height:"auto"}} src="/whatsapp-logo.png" width={300} height={300} alt='logo' priority/>
         
            </div>
            <div className="auth-form bg-gray-800/50 border-[1px] border-gray-500 backdrop-blur-sm rounded-md w-[50%] h-fit py-2">
                <form action={submitHandler}>
                    <h1 className='w-full text-center text-3xl uppercase my-[1rem]'>{IsLoggin?"Login":"Sign Up"}</h1>
                   {!IsLoggin && (
                     <div className="input-box flex flex-col w-[80%] mx-auto gap-y-1 my-2">
                        <label htmlFor="Name">Name</label>
                        <input className='name bg-transparent outline-none border-2 border-gray-700 rounded-md py-1 px-3 text-gray-500' type="text" name="name" id="name" />
                    </div>
                   )}
                     <div className="input-box flex flex-col w-[80%] mx-auto gap-y-1 my-2">
                        <label htmlFor="Name">Email</label>
                        <input  className='email bg-transparent outline-none border-2 border-gray-700 rounded-md py-1 px-3 text-gray-500' type="text" name="email" id="email" />
                    </div>
                    <div className="input-box flex flex-col w-[80%] mx-auto gap-y-1 my-2">
                        <label htmlFor="Password">Password</label>
                        <input autoComplete='current-password' className='password bg-transparent outline-none border-2 border-gray-700 rounded-md py-1 px-3 text-gray-500' type="password" name="password" id="password" />
                    </div>
                    <div className="button w-full text-center mt-4">
                        <button type='submit' className='w-[80%] bg-green-600 py-2 rounded-md cursor-pointer active:bg-green-800'>{IsLoggin?"Login":"Sign Up"}</button>
                    </div>
                </form>
                <div className="toogle-button flex w-full  py-2 justify-center items-center">
                    {IsLoggin?"No Account ? ":"Already have an Account ? "}
                    <h1 onClick={()=>setIsLoggin((prev)=>!prev)} className='text-green-700 cursor-pointer'>{IsLoggin?" Register":" Login"}</h1>
                </div>

                <div className="or flex w-full justify-center items-center text-gray-500 my-3">
                    <div className="line1 h-[1.5px] w-full bg-gray-700 rounded-md"></div>
                    <h1 >OR</h1>
                     <div className="line2 h-[1.5px] w-full bg-gray-700 rounded-md"></div>
                </div>

                <div className="google-button w-full flex justify-center items-center">
                     <GoogleButton
                     style={{
                        borderRadius:"5px",
                        width:"80%"
                     }}
                     
                       label={IsLoggin?"Sign In with Google":"Sign Up with Google"}
                       onClick={handleGoogleLogin}
                       />
                </div>
            </div>

        </div>
    </div>
  )
}

export default page