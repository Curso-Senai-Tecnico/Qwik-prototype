import React from 'react'
import { BellIcon } from 'lucide-react'

export default function CustomNav(){
  return (
    <header>
      <nav className='flex bg-white w-dvw h-24 border-b'>
      <div className='flex justify-between items-center border-r w-1/2 h-full'>
        <span className='font-rammeto text-3xl'> Quik</span>
        <span>120K</span>
      </div>
      <div className='flex justify-between items-center h-full w-1/2'>
          <span> 500k </span>
          <BellIcon/>
      </div>
      </nav>
    </header>
  )
}