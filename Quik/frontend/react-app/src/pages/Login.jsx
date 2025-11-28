import { motion } from "motion/react";
import { ChevronLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "/logoSvg.svg";
import { useToken } from "../contexts/TokenContext";

export default function Login() {
  const navigate = useNavigate();

  const {setToken} = useToken()

  const handleLogin = async (e) => {
    e.preventDefault();
    localStorage.clear()


    const email = e.target.email.value // pega os inputs do forms
    const password = e.target.password.value
    try {
      const response = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({username: email, password}),
      });

      if (!response.ok) throw new Error("Usuário ou senha inválidos");
      console.log(response)
      const data = await response.json();
      console.log(data.token)
      setToken(data.token)

      

      navigate("/home")
      }catch (err) {
      console.error(err.message);
      
    } 
    }
  ;

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
      <div className="flex flex-col bg-white rounded-2xl w-full max-w-2xl  min-h-screen md:min-h-fit shadow-2xl backdrop-blur-3xl pb-10">
        <header>
          <nav className="flex pt-10">
            <ChevronLeft
              size={48}
              className="ml-9 mr-26 cursor-pointer"
              onClick={() => navigate("/")}
            ></ChevronLeft>
            <img src="/esquilo.png" width={160} />
            <img src={Logo} width={120} className="self-end mb-5" />
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
          <form
            onSubmit={handleLogin}
            className="flex flex-col justify-center items-center gap-6"
          >
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
                <Link to={"/"} className="text-orange-500 font-bold">
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
