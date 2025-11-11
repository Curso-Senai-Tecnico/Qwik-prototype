import { BellIcon } from "lucide-react";
import { User } from "lucide-react";
import { Briefcase } from "lucide-react";
import { Circle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Lightbulb } from "lucide-react";
import Logo from "/logoNova.png";

export default function CustomNav({ darkMode, setDarkMode, role, setRole }) {
  const navigate = useNavigate();
  console.log("Role recebida da Home: ", role);
  const toggleTheme = () => {
    setDarkMode((prevMode) => !prevMode);
  };
  return (
    <header>
      <nav
        className={`flex  w-dvw h-24 border-b ${
          darkMode
            ? "border-white bg-[#22303c]  text-white"
            : "text-black bg-white"
        }  `}
      >
        <div className="flex justify-between items-center border-r w-1/2 h-full">
          <img
            src={Logo}
            width={250}
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
            <BellIcon
              className={`border rounded-full p-1 cursor-pointer hover:scale-110 transition active:scale-95 ${
                darkMode ? "border-white" : "border-black"
              }`}
              size={35}
              color={darkMode ? "white" : "black"}
            />
            <button
              onClick={() => navigate(`/${role}/dashboard`)}
              className={`flex w-fit border rounded-4xl h-full justify-between items-center pl-2.5 pr-2.5 cursor-pointer active:scale-95 transition ${
                darkMode
                  ? "dark:hover:bg-gray-900"
                  : "hover:bg-gray-100 border-black text-black"
              }`}
            >
              <Circle size={75} fill="rgba(114,114,114,1)" strokeWidth={0.5} />
              Nome Sobrenome
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
