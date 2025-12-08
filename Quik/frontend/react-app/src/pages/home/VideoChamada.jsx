import { useEffect, useRef, useState } from "react";
import SignalIcon from "./SignalIcon";
import { Mic, Phone, MicOff, VideoOff, HeadphoneOff } from "lucide-react";
import { Video } from "lucide-react";
import { Headphones } from "lucide-react";
import LogoLoading from "./LogoLoading";
import Logo from "/logoNova.png";
import { AnimatePresence, motion } from "framer-motion";
import { useRole } from "../../contexts/RoleContext";
import PdfViewer from "../dashutils/PdfViewer";
import VagaDemo from "../dashutils/VagaDemo";

export default function VideoChamada() {
  const {role} = useRole()
  const [mic, setMic] = useState(true);
  const [headset, setHeadset] = useState(true);
  const [video, setVideo] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [activeCall, setActiveCall] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL
  


  const refuseCall = () => {
    setActiveCall(false)
  }

  const videoRef = useRef(null);
  const localStreamRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    const startLocalMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        if (!mounted) return;

        localStreamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        console.error("Erro ao acessar câmera/microfone:", err);
      }
    };

    startLocalMedia();

    return () => {
      mounted = false;
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((t) => t.stop());
        localStreamRef.current = null;
      }
    };
  }, []);

  const startCall = () => {
    setIsLoading(true);
    console.log(isLoading)
    console.log(activeCall)
    setTimeout(() => {
      
      setIsLoading(false);
      console.log(isLoading)
      
      setActiveCall(true);
      console.log(activeCall)
    }, 5000);
  };

  const changeMic = () => {
    setMic((prev) => {
      const newState = !prev;
      localStreamRef.current
        ?.getAudioTracks()
        .forEach((t) => (t.enabled = newState));
      return newState;
    });
  };
  const changeHeadset = () => {
    setHeadset((prev) => !prev);
  };
  const changeVideo = () => {
    setVideo((prev) => {
      const newState = !prev;
      localStreamRef.current
        ?.getVideoTracks()
        .forEach((t) => (t.enabled = newState));
      return newState;
    });
  };

  return (
    <div className="bg-black w-9/12 h-9/12 rounded-md mt-4 flex justify-center items-center">
      <div className="relative bg-[rgb(26,26,26,100)] w-11/12 h-11/12 flex flex-col justify-between group">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`absolute inset-0 self-center w-280 h-120 z-0 transition-opacity duration-500 ${
            isLoading ? "opacity-50 blur-2xl" : "opacity-100"
          }`}
        />
        <div className="relative z-10 flex flex-col h-full justify-between group">
          <SignalIcon />

          {!isLoading ? (
            <button
              className="self-center opacity-0 group-hover:opacity-100 transition-all duration-300 text-white font-inter text-2xl font-bold bg-gradient-to-b from-orange-400 to-orange-500 shadow-inner shadow-white/40 border border-orange-600 p-5 rounded-full cursor-pointer"
              onClick={startCall}
            >
              Faça um Quik
            </button>
          ) : (
            <div className="flex flex-col justify-center items-center">
              <img src={Logo} width={250} height={100} />
              <LogoLoading />
            </div>
          )}

          
<AnimatePresence mode="wait">
          {activeCall && (
            <motion.div className="fixed inset-0 backdrop-blur bg-black/50 flex items-center justify-center"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.3, ease: "easeInOut"}}
            onClick={refuseCall}
            >
              <motion.div className=" h-[90vh] w-[60vw] flex"
              initial={{scale: 0.9, opacity: 0, y:20}}
              animate={{scale: 1, opacity: 1, y: 0}}
              exit={{scale: 0.8, opacity: 0, y: 20}}
              onClick={(e) => e.stopPropagation()}
              transition={{duration:0.3, ease: "easeInOut"}}
              >
               {role === "candidato" && (
                <div className="flex h-full w-full justify-center items-center gap-[5%]">
                <VagaDemo />
                <div className="flex flex-col gap-10">
                  <button onClick={refuseCall} className="bg-gradient-to-b from-orange-400 to-orange-500 shadow-inner shadow-white/30 border border-orange-600 rounded-lg text-white p-2 cursor-pointer hover:scale-110 active:scale-90 transition-transform duration-200 ease-in-out">
                    Aceitar chamada
                  </button>
                  <button onClick={refuseCall} className="bg-gradient-to-b from-orange-400 to-orange-500 shadow-inner shadow-white/30 border border-orange-600 rounded-lg text-white p-2 cursor-pointer hover:scale-110 active:scale-90 transition-transform duration-200 ease-in-out">
                    Recusar Chamada
                  </button>
                </div>
                </div>
               )}
               {role === "recrutador" && (
                <div className="flex h-full w-full justify-center items-center gap-[5%]">
                  <PdfViewer fileUrl={`${API_URL}/api/file/curriculos/PedroCardosoCVenUS_sFhigql.pdf`} />
                  <div className="flex flex-col gap-10">
                  <button onClick={refuseCall} className="bg-gradient-to-b from-orange-400 to-orange-500 shadow-inner shadow-white/30 border border-orange-600 rounded-lg text-white p-2 cursor-pointer hover:scale-110 active:scale-90 transition-transform duration-200 ease-in-out">
                    Aceitar chamada
                  </button>
                  <button onClick={refuseCall} className="bg-gradient-to-b from-orange-400 to-orange-500 shadow-inner shadow-white/30 border border-orange-600 rounded-lg text-white p-2 cursor-pointer hover:scale-110 active:scale-90 transition-transform duration-200 ease-in-out">
                    Recusar Chamada
                  </button>
                </div>
                </div>
               )}

              </motion.div>
            </motion.div>
            
          )}
</AnimatePresence>
          {/* BOTÕES */}
          <div className="flex justify-around opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {mic ? (
              <Mic color="white" onClick={changeMic} />
            ) : (
              <MicOff color="white" onClick={changeMic} />
            )}
            {headset ? (
              <Headphones color="white" onClick={changeHeadset} />
            ) : (
              <HeadphoneOff
                color="white"
                onClick={() => setHeadset(!headset)}
              />
            )}
            {video ? (
              <Video color="white" onClick={changeVideo} />
            ) : (
              <VideoOff color="white" onClick={changeVideo} />
            )}
            <Phone size={35} className="border bg-red-500 p-1 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
