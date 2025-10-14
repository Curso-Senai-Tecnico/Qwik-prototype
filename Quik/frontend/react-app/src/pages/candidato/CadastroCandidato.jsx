import React from 'react'
import { motion } from 'motion/react'
import { ChevronLeft } from 'lucide-react'
import { Link,useNavigate } from 'react-router-dom'

export default function Cadastro() {
  const navigate = useNavigate()
  return (
    <motion.div className="bg-gradient-to-br from-[#ffd064] via-[#ffab4b] to-[#934500] flex w-vh h-dvh bg-[length:200%_200%] justify-center items-center"
    animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
    transition={{
      duration: 5,
      ease: "circInOut",
      repeat: Infinity,
    }}>
      <div
      className='bg-white w-2xl h-11/12 rounded-md flex flex-col'
      >
        <header>
          <nav className='flex pt-10'>
          <ChevronLeft size={48} className='cursor-pointer ml-9 mr-26 hover:scale-110 active:scale-95 transition duration-200 ease-in-out' onClick={() => navigate("/")} />
          <img src="/esquilo.png" width={160} />
            <h1 className="font-rammeto text-orange-400 text-5xl mt-20">
              Quik
            </h1>

          </nav>
        </header>
        <div className='flex flex-col items-center justify-center gap-3'>
        <h1 className='font-inter font-bold text-2xl'>
          Prepare-se para encontrar sua próxima oportunidade!
        </h1>
        <br></br>
        <form className='flex flex-col gap-6 items-center justify-center'>
          <input 
          type='text'
          id='nome'
          name='nome'
          placeholder='Nome'
          className='font-inter border rounded-full p-3 shadow-lg'
          size={40}
          />
          <input 
          type='email'
          id='email'
          name='email'
          placeholder='E-mail'
          className='font-inter border rounded-full p-3 shadow-lg'
          size={40}
          />
          <input
          type='text'
          id='cpf'
          name='cpf'
          placeholder='CPF'
          className='font-inter border rounded-full p-3 shadow-lg'
          size={40}
          />
          <input
          type='password'
          id='pass'
          name='pass'
          placeholder='Senha'
          className='font-inter border rounded-full p-3 shadow-lg'
          size={40}
          />
          <br/>
          <button
          type='submit'
          className='bg-orange-400 text-white hover:scale-110 active:scale-95 w-10/12 h-16 rounded-full font-black text-2xl text-shadow-black text-shadow-xs shadow-2xl cursor-pointer transition duration-200 ease-in-out'
          >
            Cadastrar
          </button>
        </form>
        </div>
      </div>

    </motion.div>
  )
}
