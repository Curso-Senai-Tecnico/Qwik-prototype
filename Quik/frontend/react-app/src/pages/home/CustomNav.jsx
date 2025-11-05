import React from 'react'
import { BellIcon } from 'lucide-react'
import { User } from 'lucide-react'
import { Briefcase } from 'lucide-react'
import { Circle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function CustomNav(){
  const navigate = useNavigate()
  return (
    <header>
      <nav className='flex bg-white w-dvw h-24 border-b'>
      <div className='flex justify-between items-center border-r w-1/2 h-full'>
      <span onClick={() => navigate("/home")} className='font-rammeto text-3xl text-orange-500 cursor-pointer'> Quik</span>
      <div className='flex flex-col h-full w-30 justify-center items-center'>
        <div>
        <User/>
        </div>
        <div className='flex justify-center items-center gap-1.5'>
        <Circle fill='rgba(9,230,49,1)' color='rgba(9,230,49,1)' size={20}/>
        <span className='pr-2.5 font-inter font-semibold'>  +120K</span>
        </div>
        </div>
      </div>
      <div className='flex justify-between items-center h-full w-1/2'>
      <div className='flex flex-col justify-center items-center pl-5'>
          <Briefcase/>
          <span className='font-inter font-semibold'> +500k </span>
        </div>
        <div className='flex gap-4 justify-center items-center mr-5'>
          <BellIcon className='border rounded-full p-1 cursor-pointer hover:scale-110 transition active:scale-95' size={35}/>
          <button className='flex w-fit border rounded-4xl h-full justify-between items-center pl-2.5 pr-2.5 cursor-pointer hover:bg-gray-100 active:scale-95 transition'>
            <Circle size={75} fill='rgba(114,114,114,1)' strokeWidth={0.5}/>
            Nome Sobrenome
          </button>
          </div>
      </div>
      </nav>
    </header>
  )
}