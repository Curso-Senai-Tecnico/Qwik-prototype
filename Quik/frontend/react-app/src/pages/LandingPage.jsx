import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Link } from "react-router-dom";

import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Logo from "/logoSvg.svg";

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

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % vagas.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [vagas.length]);

  const vagaAtual = vagas[index];
  const prevIndex = (index - 1 + vagas.length) % vagas.length;
  const nextIndex = (index + 1) % vagas.length;

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
          <img src={Logo} className="p-3 w-35" />
          <nav className="flex justify-end gap-12 pt-6">
            <Link
              to={"/login"}
              className="italic cursor-pointer font-space mt-3 hover:underline underline-offset-8 decoration-2"
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
          {/* Carrossel */}
          <div
            className="relative w-full flex justify-center mt-30"
            style={{
              WebkitMaskImage:
                "linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)",
              maskImage:
                "linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)",
            }}
          >
            {/* Preview Esquerda */}
            <motion.div
              className="absolute left-0 top-0 h-full flex items-center"
              style={{
                transform: "translateX(-45%) scale(0.85)",
                filter: "blur(4px)",
                pointerEvents: "none",
                opacity: 0.4,
              }}
            >
              <div className="flex flex-col shadow-lg shadow-gray-400/60 gap-8 w-80 h-55 justify-between items-center p-6 bg-[#ffab4b] text-white border border-white/40 rounded-xl scale-90">
                <img src={vagas[prevIndex].icone} className="w-20 h-20" />
                <span>{vagas[prevIndex].numeroVagas}+ vagas</span>
              </div>
            </motion.div>

            {/* CARD PRINCIPAL */}
            <div className="w-80 h-70 flex items-center justify-center relative">
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={vagaAtual.id}
                  initial={{ opacity: 0, x: 150, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -150, scale: 0.9 }}
                  transition={{ duration: 0.5, type: "spring" }}
                  className="absolute flex flex-col shadow-lg shadow-gray-400/60 gap-8 w-80 h-60 justify-between items-center p-6 bg-[#ffab4b] text-white border border-white/40 rounded-md"
                >
                  <img src={vagaAtual.icone} className="w-30 h-30" />
                  <span>{vagaAtual.numeroVagas}+ vagas</span>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Preview Direita */}
            <motion.div
              className="absolute right-0 top-0 h-full flex items-center"
              style={{
                transform: "translateX(45%) scale(0.85)",
                filter: "blur(4px)",
                pointerEvents: "none",
                opacity: 0.4,
              }}
            >
              <div className="flex flex-col shadow-lg shadow-gray-400/60 gap-8 w-80 h-50 justify-between items-center p-6 bg-[#ffab4b] text-white border border-white/40 rounded-xl scale-90">
                <img src={vagas[nextIndex].icone} className="w-6 h-6" />
                <span>{vagas[nextIndex].empresa}</span>
                <span>{vagas[nextIndex].numeroVagas}+ vagas</span>
              </div>
            </motion.div>
          </div>
        </main>
      </div>

      {showModal && (
        <AnimatePresence>
          ((
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
