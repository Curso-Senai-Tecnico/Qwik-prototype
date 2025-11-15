import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Link } from "react-router-dom";
import { createPortal } from "react-dom";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Logo from "/logoSvg.svg"

export default function LandingPage() {
  const [showModal, setShowModal] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();

  function abrirModal() {
    setShowModal(true);
    setIsAnimating(false);
  }

  function retornarButton() {
    setIsAnimating(true);
    setTimeout(() => {
      setShowModal(false);
    }, 300);
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
      <div className="bg-white w-300 h-155 rounded-lg">
        <header className="flex justify-between">
          <img src={Logo} width={100} className="pl-2" />
          <nav className="flex justify-end gap-12 pt-6">
            
            <Link
              to={"/login"}
              className="italic cursor-pointer font-space mt-3 hover:underline"
            >
              Entrar
            </Link>
            <button
              onClick={abrirModal}
              className="mr-10 bg-[#ffab4b] text-white font-bold p-3 rounded-full italic cursor-pointer hover:scale-105 transition-all"
            >
              Cadastrar
            </button>
          </nav>
        </header>
        <main className="flex-1 grid grid-cols-2">
          <div className="flex flex-col items-center justify-center text-center ml-10">
            
            <img src="/esquilo.png" alt="Logo Quik" className="w-60" />
            <p className="font-bold mt-2">
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
        <footer className="flex justify-around items-center mt-10 font-black text-gray-500 border-t-1 pt-2">
          <p>© 2025 Quik — Todos os direitos reservados</p>
          <p>Sobre</p>
          <p>Centro de ajuda</p>
          <p>Política de privacidade</p>
        </footer>
      </div>

      {showModal && (
        <AnimatePresence>
          ( createPortal(
          <motion.div
            className="fixed inset-0 backdrop-blur bg-black/50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{
              opacity: isAnimating ? 0 : 1,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            onClick={retornarButton}
          >
            <motion.div
              className="bg-white p-6 w-150 h-180 rounded-lg shadow-xl"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{
                scale: isAnimating ? 0.8 : 1,
                opacity: isAnimating ? 0 : 1,
                y: isAnimating ? 20 : 0,
              }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <header>
                <nav className="flex gap-6 items-center">
                  <ChevronLeft
                    className="cursor-pointer rounded-full hover:scale-110 active:scale-95 transition-all"
                    size={52}
                    strokeWidth={2}
                    onClick={retornarButton}
                  />
                  <h1 className="font-inter text-3xl">
                    Como você deseja se cadastrar?
                  </h1>
                </nav>
              </header>
              <div className="flex flex-col">
                <form className="flex flex-col gap-10 justify-center items-center h-140">
                  <label
                    htmlFor="candidato"
                    className="font-inter font-bold text-3xl"
                  >
                    {" "}
                    Candidato
                  </label>
                  <div className="shadow-2xl border w-3xs h-40 overflow-clip rounded-2xl cursor-pointer hover:scale-110 ease-in-out duration-200 active:scale-95">
                    <input
                      type="radio"
                      name="candidato"
                      id="candidato"
                      value="candidato"
                      class="hidden"
                    />

                    <img
                      src="/esquiloCandidato.png"
                      onClick={() => navigate("/candidato/cadastro")}
                    />
                  </div>
                  <label
                    htmlFor="recrutador"
                    className="font-inter font-bold text-3xl"
                  >
                    Recrutador
                  </label>
                  <div className="shadow-2xl border w-3xs h-40 rounded-2xl overflow-clip cursor-pointer hover:scale-110 ease-in-out duration-200 active:scale-95">
                    <input
                      type="radio"
                      name="recrutador"
                      id="recrutador"
                      class="hidden"
                      value="recrutador"
                    />
                    <img
                      src="esquiloRecrutador.png"
                      onClick={() => navigate("/recrutador/cadastro")}
                    />
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
          ,document.body ) )
        </AnimatePresence>
      )}
    </motion.div>
  );
}
