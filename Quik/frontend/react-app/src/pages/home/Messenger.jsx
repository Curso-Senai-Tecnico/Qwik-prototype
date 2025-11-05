import React, { useState } from 'react';
import { Circle } from 'lucide-react';
import {User} from 'lucide-react'

export default function Messenger({darkMode, setDarkMode}){
    const [isOpen, setIsOpen] = useState(false);

    const toggleChat = () => {
        setIsOpen(prev => setIsOpen(!prev))
    }

    return(
       <div className={`flex flex-col transition-all duration-300 fixed bottom-0 left-0`}>
       <div className={`flex font-inter font-bold justify-between items-center ml-4 w-80 rounded-t-2xl rounded-tr-2xl cursor-pointer h-10 ${darkMode ? "bg-[#22303c] text-white": "bg-white text-black"} ${isOpen && "w-90 border-b"}`} onClick={toggleChat}>
        <span className='ml-4'>Chat</span>
        <div className='flex justify-center gap-1 items-center mr-4'>
            <span className=''>3</span>
            <Circle 
            fill="rgba(9,230,49,1)"
            color="rgba(9,230,49,1)"
            size={15}
            />
            <User size={20}/>
        </div>
       </div> 
       {isOpen && 
       <div className={`flex font-inter font-bold justify-between items-center ml-4 w-90 h-90 ${darkMode ? "bg-[#22303c] text-white": "bg-white text-black"}`} >

        </div>
        }
        
       </div>
    )
}