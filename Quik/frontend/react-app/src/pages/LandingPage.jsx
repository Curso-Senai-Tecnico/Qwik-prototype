import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Link } from "react-router-dom";
import { createPortal } from "react-dom";
import { ChevronLeft } from "lucide-react";

export default function LandingPage() {
  const [showModal, setShowModal] = useState(false);

  function retornarButton() {
    setShowModal(false);
  }

  const vagas = [
    {
      id: 1,
      icone: "/apple.svg",
      empresa: "Apple",
      numeroVagas: 34,
    },
    {
      id: 2,
      icone: "/facebook.svg",
      empresa: "Facebook",
      numeroVagas: 176,
    },
    {
      id: 3,
      icone: "/google.svg",
      empresa: "Google",
      numeroVagas: 45,
    },
    {
      id: 4,
      icone: "/instagram.svg",
      empresa: "Instagram",
      numeroVagas: 98,
    },
    {
      id: 5,
      icone: "/netflix.svg",
      empresa: "Netflix",
      numeroVagas: 234,
    },
  ];
  return (
    <motion.div
      className="bg-gradient-to-br from-[#ffd064] via-[#ffab4b] to-[#934500] flex w-vh h-dvh bg-[length:200%_200%] justify-center items-center"
      animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
      transition={{
        duration: 5,
        ease: "circInOut",
        repeat: Infinity,
      }}
    >
      <div className="bg-white w-300 h-150 rounded-lg">
        <header>
          <nav className="flex justify-end gap-12 pt-6">
            <Link
              to={"/login"}
              className="italic cursor-pointer font-space mt-3 hover:underline"
            >
              Entrar
            </Link>
            <button
              onClick={() => setShowModal(true)}
              className="mr-10 bg-[#ffab4b] text-white font-bold p-3 rounded-full italic cursor-pointer hover:scale-105 transition-all"
            >
              Cadastrar
            </button>
          </nav>
        </header>
        <main className="flex-1 grid grid-cols-2">
          <div className="flex flex-col items-center justify-center text-center ml-10">
            <img src="/esquilo.png" alt="Logo Quik" className="w-80" />
            <h1 className="font-rammeto font-normal text-orange-300 text-5xl mb-3">
              Quik
            </h1>
            <p className="font-bold mt-3">
              Encontre vagas qualificadas e conecte-se com empresas sérias —
              rápido e sem complicação. O lugar certo para sua próxima
              oportunidade profissional.
            </p>
          </div>
          <div className="flex flex-col justify-center items-center gap-3 mt-6">
            {vagas.map((vaga) => (
              <div
                className="flex shadow-lg shadow-gray-400/60 gap-8 w-80 justify-between items-center p-6 bg-[#ffab4b] text-white border border-white/40 cursor-pointer hover:z-50 hover:scale-125 hover:backdrop-blur-xl transition-transform duration-200 rounded-lg"
                key={vaga.id}
              >
                <img src={vaga.icone} className="w-6 h-6 bg" />
                <span>{vaga.empresa}</span>
                <span>{vaga.numeroVagas}+ vagas</span>
              </div>
            ))}
          </div>
        </main>
      </div>

      {showModal &&
        createPortal(
          <motion.div
            className="fixed inset-0 backdrop-blur bg-black/50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={retornarButton}
          >
            <motion.div
              className="bg-white p-10 w-150 h-180 rounded-lg shadow-xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              transition={{ duration: 0.2 }}
            >
              <header>
                <nav>
                  
                    <ChevronLeft className="cursor-pointer rounded-full hover:scale-110 transition-all" size={52} strokeWidth={2} onClick={retornarButton}/>
                  
                </nav>
              </header>
              <div className="flex flex-col">
                <form>
                  <label >
                  E-mail<br></br>
                      <input type="email" id="email" name="email" placeholder="example@example.com">

                      </input>
                  </label>
                </form>
              </div>
            </motion.div>
          </motion.div>,
          document.body
        )}
    </motion.div>
  );
}
