import React, { useEffect, useState } from "react";
import CustomNav from "./CustomNav";
import { motion } from "framer-motion";
import Messenger from "./Messenger";
import VideoChamada from "./VideoChamada";

export default function Home({ darkMode, setDarkMode }) {
  const [role, setRole] = useState("");
  useEffect(() => {
    console.log("O use effect executou!");
    const roleSalva = localStorage.getItem("role");
    if (roleSalva) {
      setRole(roleSalva);
    } else {
      localStorage.setItem("role", "candidato");
      setRole("candidato");
    }
  }, []);
  return (
    <motion.div
      className="bg-gradient-to-br from-[#ffd064] via-[#ffab4b] to-[#934500] flex flex-col w-vh h-dvh bg-[length:200%_200%] items-center"
      animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
      transition={{
        duration: 5,
        ease: "circInOut",
        repeat: Infinity,
      }}
    >
      <CustomNav darkMode={darkMode} setDarkMode={setDarkMode} role={role} />
      <VideoChamada />
      <Messenger darkMode={darkMode} setDarkMode={setDarkMode} />
    </motion.div>
  );
}
