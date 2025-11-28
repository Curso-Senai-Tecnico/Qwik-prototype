import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Logo from "/logoSvg.svg";

export default function Cadastro() {
  const navigate = useNavigate();
  const handleRegister = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("http://127.0.0.1:8000/api/recrutador/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: data.nome,
          perfil_recrutador: data.cargo,
          cnpj: data.cnpj,
          senha: data.pass,
          role: "recrutador"
        }),
      });

      const responseData = await response.json();
      if (response.ok) {
        navigate("/login");
      } else {
        console.log("Erro: ", responseData);
      }
    } catch (err) {
      console.log(err.message);
    }
  };
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
      <div className="bg-white w-full max-w-2xl  min-h-screen md:min-h-fit rounded-2xl flex flex-col shadow-2xl backdrop-blur-3xl">
        <header>
          <nav className="flex pt-10">
            <ChevronLeft
              size={48}
              className="cursor-pointer ml-9 mr-26 hover:scale-110 active:scale-95 transition duration-200 ease-in-out"
              onClick={() => navigate("/")}
            />
            <img src="/esquilo.png" width={160} />
            <img src={Logo} width={120} className="self-end mb-5" />
          </nav>
        </header>
        <div className="flex flex-col items-center justify-center gap-3 pb-10">
          <h1 className="font-inter font-bold text-2xl">
            Prepare-se para encontrar sua próxima oportunidade!
          </h1>
          <br></br>
          <form
            onSubmit={handleRegister}
            className="flex flex-col gap-6 items-center justify-center"
          >
            <input
              type="text"
              id="nome"
              name="nome"
              placeholder="Nome"
              className="font-inter border rounded-full p-3 shadow-lg"
              size={40}
            />
            <input
              type="text"
              id="cargo"
              name="cargo"
              placeholder="Cargo"
              className="font-inter border rounded-full p-3 shadow-lg"
              size={40}
            />
            <input
              type="text"
              id="cnpj"
              name="cnpj"
              placeholder="CNPJ"
              className="font-inter border rounded-full p-3 shadow-lg"
              size={40}
            />
            <input
              type="password"
              id="pass"
              name="pass"
              placeholder="Senha"
              className="font-inter border rounded-full p-3 shadow-lg"
              size={40}
            />
            <br />
            <button
              type="submit"
              className="bg-orange-400 text-white hover:scale-110 active:scale-95 w-10/12 h-16 rounded-full font-black text-2xl text-shadow-black text-shadow-xs shadow-2xl cursor-pointer transition duration-200 ease-in-out"
            >
              Cadastrar
            </button>

            <h3 className="font-inter font-medium">
              Já possui uma conta?{" "}
              <Link className="text-orange-500" to="/login">
                Entrar
              </Link>
            </h3>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
