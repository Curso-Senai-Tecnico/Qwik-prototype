import { useEffect, useRef, useState, useCallback } from "react";
import SignalIcon from "./SignalIcon";
import { Mic, Phone, MicOff, VideoOff, HeadphoneOff, Video, Headphones } from "lucide-react";
import LogoLoading from "./LogoLoading";
import Logo from "/logoNova.png";
import { AnimatePresence, motion } from "framer-motion";
import { useRole } from "../../contexts/RoleContext";
import PdfViewer from "../dashutils/PdfViewer";
import VagaDemo from "../dashutils/VagaDemo";

//Config STUN (google)
const iceConfiguration = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302",
             "stun:stun2.l.google.com:19302"],
    },
  ],
};

export default function VideoChamada() {
  const {role} = useRole()
  const roomName = 'sala-teste';

  const [mic, setMic] = useState(true);
  const [headset, setHeadset] = useState(true);
  const [video, setVideo] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [activeCall, setActiveCall] = useState(false);
  const [callStatus, setCallStatus] = useState("idle");
  const [canCall, setCanCall] = useState(true);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const socketRef = useRef(null);
  const API_URL = import.meta.env.VITE_API_URL

  
  


  const refuseCall = () => {
    setActiveCall(false)
    endCall()
  }

  const handleSocketMessage = async (event) => {
    const data = JSON.parse(event.data);

    if (data.type === "user_update") {
      if (data.status === "joined" && data.count >= 2) { 
        setCanCall(true);
    }
    if (data.status === "left") {
      endCall();
    }
  }
  
  if (data.type === "offer") await handleOffer(data);
  if (data.type === "answer") await handleAnswer(data);
  if (data.type === "candidate") await handleCandidate(data);
};
 

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
      if (localVideoRef.current) 
        localVideoRef.current.srcObject = stream;

    } catch (err) {
      console.error("Erro ao acessar câmera/mic:", err);
    }
  };

  const connectWebSocket = () => {
    const wsScheme = window.location.protocol === "https:" ? "wss" : "ws";
    const wsUrl = `${wsScheme}://${window.location.host}/ws/signaling/${roomName}/`;
    socketRef.current = new WebSocket(wsUrl);

    socketRef.current.onmessage = handleSocketMessage;
  };

  startLocalMedia();
  connectWebSocket();

  return () => {
    mounted = false;
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    socketRef.current?.close();
    peerConnectionRef.current?.close();
  };
}, []);


  const createPeerConnection = () => {
    if (peerConnectionRef.current) return;

    const pc = new RTCPeerConnection(iceConfiguration);
    
  pc.onicecandidate = (event) => {
    if (event.candidate && socketRef.current) {
      socketRef.current.send(
        JSON.stringify({
          type: "candidate",
          candidate: event.candidate,
        })
      );
    }
  } 

  pc.ontrack = (event) => {
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = event.streams[0];
    }
  };

  if (localStreamRef.current) {
    localStreamRef.current.getTracks().forEach((track) => {
      pc.addTrack(track, localStreamRef.current);
    });
  }

  peerConnectionRef.current = pc;
};

  const startCall = async () => {
    setIsLoading(true);
    setCallStatus("calling");
    console.log(isLoading)

    createPeerConnection();

    const offer = await peerConnectionRef.current.createOffer();
    await peerConnectionRef.current.setLocalDescription(offer);

    setTimeout(() => {
      socketRef.current.send(
        JSON.stringify({
          type: "offer",
          sdp: offer.sdp,
        })
      );
      setIsLoading(false);
      setActiveCall(true);
      console.log(activeCall)
    },5000);
  };

  const handleCandidate = async (data) => {
  try {
    if (peerConnectionRef.current) {
      await peerConnectionRef.current.addIceCandidate(
        new RTCIceCandidate(data.candidate)
      );
    }
  } catch (err) {
    console.error("Erro ao adicionar ICE candidate:", err);
  }
};

  
  const handleOffer = async (data) => {
    setCallStatus("receiving");
    setActiveCall(true);

    createPeerConnection();

    await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription({type: "offer", sdp: data.sdp}));
  };

  const acceptCall = async () => {
    const answer = await peerConnectionRef.current.createAnswer();
    await peerConnectionRef.current.setLocalDescription(answer);

    socketRef.current.send(
      JSON.stringify({
        type: "answer",
        sdp: answer.sdp,
      })
    );
   
    setActiveCall(false);
    setCallStatus("connected");
  };

  const handleAnswer = async (data) => {
    try {
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.setRemoteDescription(
          new RTCSessionDescription({
            type: "answer",
            sdp: data.sdp,
          })
        );
      }
    } catch (err) {
      console.error("Erro ao adicionar candidato ICE:", err);
    }
  };

  const endCall = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    setActiveCall(false);
    setCallStatus("idle");
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
  }

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
          ref={localVideoRef}
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
                  <button onClick={acceptCall} className="bg-gradient-to-b from-orange-400 to-orange-500 shadow-inner shadow-white/30 border border-orange-600 rounded-lg text-white p-2 cursor-pointer hover:scale-110 active:scale-90 transition-transform duration-200 ease-in-out">
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
                  <button onClick={acceptCall} className="bg-gradient-to-b from-orange-400 to-orange-500 shadow-inner shadow-white/30 border border-orange-600 rounded-lg text-white p-2 cursor-pointer hover:scale-110 active:scale-90 transition-transform duration-200 ease-in-out">
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
