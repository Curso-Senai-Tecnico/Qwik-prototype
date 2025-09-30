import React from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";

export default function LandingPage() {
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
      <div className="bg-white w-300 h-150 ">
        <header>
          <nav className="flex justify-end gap-8 pt-6">
            <button className="italic cursor-pointer font-space">Entrar</button>
            <button className="mr-10 bg-blue-700 text-white p-3 rounded-full italic cursor-pointer">
              Cadastrar
            </button>
          </nav>
        </header>
        <main className="flex-1 grid grid-cols-2">
          <div className="flex flex-col items-center justify-center text-center ml-10">
            <img src="/esquilo.png" alt="Logo Quik" className="w-80" />
            <h1 className="font-rammeto font-normal text-orange-300 text-5xl">
              Quik
            </h1>
            <p className="font-bold mt-3">
              Encontre vagas qualificadas e conecte-se com empresas sérias —
              rápido e sem complicação. O lugar certo para sua próxima
              oportunidade profissional.
            </p>
          </div>
        </main>
      </div>
    </motion.div>
  );
}
