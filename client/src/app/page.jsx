import React from 'react'
import Link from 'next/link';
import Image from 'next/image';

function page() {
  return (
      <div className='w-full h-screen flex  justify-center items-center'>
      <div className="box flex flex-col justify-center items-center m-auto">

    
     <Image style={{width:"auto", height:"auto"}} src="/whatsapp-home.png" width={700} height={700} alt='img' priority/>
     <h1 className='text-2xl mb-2'>Welcome to Whatsapp</h1>
     <h4 className='text-gray-500 mb-4'>A simple, reliable and private way to use Whatsapp</h4>
     <Link href={"auth/login"}>
     <button className='px-12 py-1 bg-green-600 border-2 border-white text-black rounded-md outline-1 hover:bg-green-700'>Get Started</button>
     </Link>
      <h3 className='text-sm text-gray-400 mt-4'>Version 2.2513.3.0</h3>
      </div>

      </div>
  )
}

export default page