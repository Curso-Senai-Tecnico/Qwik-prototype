import React from "react";
import CustomNav from "./CustomNav";
import { motion } from "framer-motion";

export default function Home({ darkMode, setDarkMode }) {
  return (
    <motion.div
      className="bg-gradient-to-br from-[#ffd064] via-[#ffab4b] to-[#934500] flex w-vh h-dvh bg-[length:200%_200%] justify-center"
      animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
      transition={{
        duration: 5,
        ease: "circInOut",
        repeat: Infinity,
      }}
    >
      <CustomNav darkMode={darkMode} setDarkMode={setDarkMode} />
    </motion.div>
  );
}
