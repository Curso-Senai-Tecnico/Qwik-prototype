import { BellIcon } from "lucide-react";
import { User } from "lucide-react";
import { Briefcase } from "lucide-react";
import { Circle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Lightbulb } from "lucide-react";
import Logo from "/logoSvg.svg";
import { useRole } from "../../contexts/RoleContext";
import { useUser } from "../../contexts/UserContext";
import { useState } from "react";
import { motion, AnimatePresence, easeInOut } from "framer-motion";


// COMENTANDO UM MONTE DE COISA PQ O BACKEND TA TODO BUGADO

export default function CustomNav({ darkMode, setDarkMode }) {
  
  const navigate = useNavigate();
  const {user, loadingUser} = useUser()
  const {role} = useRole()
  const [profile, setProfile] = useState(user?.perfil)
  const [openNotif, setOpenNotif] = useState(false)
  const API_URL = import.meta.env.VITE_API_URL
  
  
  const notificacoes = [{
    id: 1,
    icon: "./isquiloperfil.png",
    text: "Você precisa completar seu perfil.",
    path: `${user?.usuario?.role}/dashboard`
  }, 
    {
    id:2,
    icon: "./saibamais.png",
    text: "Quer saber mais sobre a equipe? Clique aqui!",
    path: "/saibamais" 
  }]
  const toggleTheme = () => {
    setDarkMode((prevMode) => !prevMode);
  };
 
  return (
    <header>
      <nav
        className={`flex w-dvw h-25 border-b ${
          darkMode
            ? "border-white bg-[#22303c]  text-white"
            : "text-black bg-white"
        }  `}
      >
        <div className="flex justify-between items-center border-r w-1/2 h-full">
          <img
            src={Logo}
            width={230}
            height={250}
            className="cursor-pointer overflow-hidden"
            onClick={() => navigate("/home")}
          />
          <div className="flex flex-col h-full w-30 justify-center items-center">
            <div>
              <User />
            </div>
            <div className="flex justify-center items-center gap-1.5">
              <Circle
                fill="rgba(9,230,49,1)"
                color="rgba(9,230,49,1)"
                size={20}
              />
              <span className="pr-2.5 font-inter font-semibold"> +120K</span>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center h-full w-1/2">
          <div className="flex flex-col justify-center items-center pl-5">
            <Briefcase />
            <span className="font-inter font-semibold"> +500k </span>
          </div>
          <div className="flex gap-4 justify-center items-center mr-5 dark:text-white">
            <div className="relative">
            <BellIcon
              className={`border rounded-full p-1 cursor-pointer hover:scale-110 transition active:scale-95 ${
                darkMode ? "border-white" : "border-black"
              }`}
              size={35}
              color={darkMode ? "white" : "black"}
              onClick={() => setOpenNotif((prev) => !prev)}
            />
            <AnimatePresence>
            {openNotif && (
              <motion.div 
              initial={{opacity: 0, y: 9, filter: "blur(10px)"}}
              animate={{opacity: 1, y: 0, filter: "blur(0px)"}}
              exit={{opacity: 0, y: 9, filter: "blur(10px)"}}
              transition={{duration: 0.25, ease: easeInOut}}
              className={`absolute top-10 right-0 w-60 h-full bg-none z-10`}
              >
                <div className={`flex flex-col bg-none shadow`}>
                  <div className={`rounded-t border-b p-1 ${darkMode ? "bg-[#23405a] text-white" : "bg-gray-50 text-black"} font-inter`}>Notificações</div>
                  {notificacoes.map((notifs) => (
                    <div key={notifs.id} className={`gap-2 p-3 cursor-pointer flex shadow-inner ${darkMode ? "bg-[#22303c] text-white" : "bg-white text-black"}`} onClick={() => navigate(notifs.path)}>
                      <img src={notifs.icon} width={40} height={40} className="rounded"/>
                      <span className="font-inter italic text-sm">{notifs.text}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
            </AnimatePresence>
            </div>
            <button
              onClick={() => !loadingUser && navigate(`/${role}/dashboard`)}
              className={`flex w-fit border rounded-4xl h-full justify-between items-center pl-2.5 pr-2.5 cursor-pointer active:scale-95 transition ${
                darkMode
                  ? "dark:hover:bg-gray-900"
                  : "hover:bg-gray-100 border-black text-black"
              }`}
            >
              {loadingUser ? (
    
    <>
      <div className="w-[75px] h-[75px] rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse" />
      <div className="ml-3 h-5 w-32 bg-gray-300 dark:bg-gray-700 rounded-md animate-pulse" />
    </>
  ) : (
    
    <>
      {user?.perfil?.foto ? <img src={`${API_URL}/${user?.perfil?.foto}`} width={80} height={80} className="rounded-full" /> : <img src="/qwikpadrao.png" width={80} height={80} className="rounded-full" />}
      <span className="ml-3">{user?.usuario.nome}</span>
    </>
  )}
            </button>
            
            <Lightbulb
              onClick={toggleTheme}
              color={darkMode ? "yellow" : "black"}
              className="hover:scale-110 active:scale-95 cursor-pointer transition-colors duration-300"
            />
            
          </div>
        </div>
      </nav>
    </header>
  );
}
