import React, { useState } from 'react';
import { Circle } from 'lucide-react';
import {User} from 'lucide-react'

export default function Messenger({darkMode, setDarkMode}){
    const [isOpen, setIsOpen] = useState(false);

    const toggleChat = () => {
        setIsOpen(prev => setIsOpen(!prev))
    }

    return(
       <>
       {isOpen ? 
       
       <div className={`flex font-inter font-bold justify-between items-center fixed bottom-0 left-0 ml-4 w-70 rounded-l-2xl rounded-r-2xl cursor-pointer h-10 ${darkMode ? "bg-[#22303c] text-white": "bg-white text-black"}`} onClick={toggleChat}>
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
       
       : 
       <div className={`flex fixed bottom-0 left-0 ml-4 w-90 rounded-l-2xl rounded-r-2xl h-72 ${darkMode ? "bg-[#22303c] text-white": "bg-white text-black"}`} onClick={toggleChat}>

        </div>
        }
       </>
    )
}