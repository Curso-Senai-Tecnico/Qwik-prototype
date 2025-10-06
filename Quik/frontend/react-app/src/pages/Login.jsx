import React from "react";
import { motion } from "motion/react";
import { ChevronLeft } from "lucide-react";
import { Link, Navigate, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

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
      <div className="flex flex-col bg-white rounded-2xl w-2xl h-11/12 shadow-2xl backdrop-blur-3xl">
        <header>
          <nav className="flex pt-10">
            <ChevronLeft
              size={48}
              className="ml-9 mr-26 cursor-pointer"
              onClick={() => navigate("/")}
            ></ChevronLeft>
            <img src="/esquilo.png" width={160} />
            <h1 className="font-rammeto text-orange-400 text-5xl mt-20">
              Quik
            </h1>
          </nav>
        </header>
        <div className="flex flex-col gap-3 justify-center items-center font-inter">
          <h1 className="font-bold font-inter text-3xl tracking-wider">
            Entrar na sua conta
          </h1>
          <h2 className="font-inter font-normal text-2xl">Bem vindo!</h2>
          {/*TODO:
            Fazer com que os dados não fiquem salvos na URL
           */}
          <form className="flex flex-col justify-center items-center gap-6">
            <input
              type="email"
              name="email"
              id="email"
              placeholder="E-mail ou CPNJ"
              size={48}
              className="border rounded-full w-11/12 p-5 font-inter font-semibold"
            />
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Senha"
              size={48}
              className="border rounded-full w-11/12 p-5 font-inter font-semibold"
            />
            <div className="flex gap-2 self-start ml-8 items-center">
              <input
                type="checkbox"
                name="remember"
                id="remember"
                value={true}
                className="w-6 h-6"
              />
              <label htmlFor="remember"> Lembrar-me</label>
            </div>
            <button
              type="submit"
              className="bg-orange-400 text-white hover:scale-110 active:scale-95 w-10/12 h-16 rounded-full font-black text-2xl text-shadow-black text-shadow-xs shadow-2xl cursor-pointer transition duration-200 ease-in-out"
            >
              Entrar
            </button>
            <h3 className="">Esqueceu a senha?</h3>
            <div>
              <h3>
                Não tem uma conta?{" "}
                <Link to={"/"} className="text-blue-600 font-bold">
                  Cadastre-se
                </Link>
              </h3>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
