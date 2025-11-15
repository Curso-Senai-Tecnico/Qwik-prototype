import { motion } from "framer-motion";
import Messenger from "./Messenger";
import VideoChamada from "./VideoChamada";

export default function Home({ darkMode, setDarkMode }) {
  return (
    <motion.div
      className="bg-gradient-to-br from-[#ffd064] via-[#ffab4b] to-[#934500] flex flex-col w-screen h-screen bg-[length:200%_200%] items-center overflow-hidden"
      animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
      transition={{
        duration: 5,
        ease: "circInOut",
        repeat: Infinity,
      }}
    >
      <VideoChamada />
      <Messenger darkMode={darkMode} setDarkMode={setDarkMode} />
    </motion.div>
  );
}
