import { useEffect, useRef, useState, useCallback } from "react";
import SignalIcon from "./SignalIcon";
import { Mic, Phone, MicOff, VideoOff, HeadphoneOff, Video, Headphones } from "lucide-react";
import LogoLoading from "./LogoLoading";
import Logo from "/logoNova.png";
import { AnimatePresence, motion } from "framer-motion";
import { useRole } from "../../contexts/RoleContext";
import VagasMapper from "../dashutils/VagasMapper";

const iceConfiguration = {
  iceServers: [
    { urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"] },
  ],
};

export default function VideoChamada() {
  const { role } = useRole();
  const roomName = "sala-teste3"; // DICA: Em produção, gere IDs únicos

  // Estados
  const [mic, setMic] = useState(true);
  const [headset, setHeadset] = useState(true);
  const [video, setVideo] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [activeCall, setActiveCall] = useState(false);
  const [callStatus, setCallStatus] = useState("idle"); 
  const [canCall, setCanCall] = useState(false);

  // Refs
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const socketRef = useRef(null);
  const BASE = import.meta.env.VITE_API_URL

  const vagas = [{
    "recrutador": 6,
    "tipo": "Estágio",
    "contrato": "Parcial",
    "cargo": "Assistente Administrativo",
    "resumo": "Suporte a tarefas administrativas.",
    "responsabilidades": "Organização de documentos, atendimento telefônico.",
    "requisitos": "Pacote Office, Boa comunicação",
    "beneficios": "Bolsa Auxílio, Recesso Remunerado",
    "salario": "1500.00",
    "quantidade": 3,
    "localizacao": "Rio de Janeiro - RJ",
    "data_publicacao": "2025-10-22",
    "status": "Ativa",
    "tags": [
        {
            "id": 1,
            "nome": "HTML"
        },
        {
            "id": 4,
            "nome": "Java"
        },
        {
            "id": 6,
            "nome": "Desenvolvimento de Sistemas"
        },
        {
            "id": 7,
            "nome": "Análise de Dados"
        },
        {
            "id": 9,
            "nome": "Frontend"
        }
    ]
}, {
    "recrutador": 6,
    "tipo": "CLT",
    "contrato": "Integral",
    "cargo": "Gerente de Vendas",
    "resumo": "Gestão de equipe e metas de vendas.",
    "responsabilidades": "Liderar equipe, planejar estratégias.",
    "requisitos": "Experiência em liderança, Negociação",
    "beneficios": "Comissão, Carro da empresa, Plano Odontológico",
    "salario": "10000.00",
    "quantidade": 1,
    "localizacao": "Belo Horizonte - MG",
    "data_publicacao": "2025-10-15",
    "status": "Expirada",
    "tags": [
        {
            "id": 2,
            "nome": "CSS"
        },
        {
            "id": 3,
            "nome": "Javascript"
        },
        {
            "id": 5,
            "nome": "Python"
        },
        {
            "id": 8,
            "nome": "Ciência de Dados"
        },
        {
            "id": 10,
            "nome": "Backend"
        }
    ]
}]

  // --- FUNÇÃO SEGURA PARA ENVIAR MENSAGENS ---
  // Isso resolve o "InvalidStateError"
  const sendMessage = (msg) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(msg));
    } else {
      console.warn("WebSocket não está pronto. Mensagem perdida ou fila necessária:", msg.type);
    }
  };

  // 1. Inicialização
  useEffect(() => {
    let mounted = true;

    // Conexão WebSocket
    const connectWebSocket = () => {
      // Se estiver rodando localmente, mas acessando via IP da rede, mude '127.0.0.1' para seu IP
      const wsUrl = BASE
      .replace("https://", "wss://")
      .replace("http://", "ws://") 
      + `/ws/call/${roomName}/`;

      
      socketRef.current = new WebSocket(wsUrl);

      socketRef.current.onopen = () => {
        console.log("✅ WebSocket Conectado");
      };
      
      socketRef.current.onmessage = handleSocketMessage;
      
      socketRef.current.onclose = () => {
        console.log("❌ WebSocket Desconectado");
        setCanCall(false);
      };

      socketRef.current.onerror = (err) => {
        console.error("Erro no WebSocket:", err);
      };
    };

    // Captura de Mídia (Câmera)
    const startLocalMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        
        if (!mounted) {
            // Se o componente desmontou enquanto carregava, pare as tracks
            stream.getTracks().forEach(t => t.stop());
            return;
        }

        localStreamRef.current = stream;
        
        // Resolve o DOMException de srcObject
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Erro CRÍTICO ao acessar câmera:", err);
        alert("Não conseguimos acessar sua câmera. Verifique as permissões ou se outro app está usando.");
      }
    };

    startLocalMedia();
    connectWebSocket();

    return () => {
      mounted = false;
      // Limpeza ao sair da tela
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (socketRef.current) {
        socketRef.current.close();
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
    };
  }, []);

  // 2. Manipular Mensagens do Socket
  const handleSocketMessage = async (event) => {
    const data = JSON.parse(event.data);

    if (data.type === "user_update") {
      if (data.status === "joined" && data.count >= 2) setCanCall(true);
      if (data.status === "left") endCall(); 
    }

    if (data.type === "offer") await handleOffer(data);
    if (data.type === "answer") await handleAnswer(data);
    if (data.type === "candidate") await handleCandidate(data);
  };

  // 3. WebRTC - Criar Conexão
  const createPeerConnection = () => {
    // Evita criar duas conexões por cima
    if (peerConnectionRef.current) return;

    try {
      const pc = new RTCPeerConnection(iceConfiguration);

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          // Usa a função segura sendMessage
          sendMessage({ type: "candidate", candidate: event.candidate });
        }
      };

      pc.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      // Adiciona tracks APENAS se o stream local existir
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => {
          pc.addTrack(track, localStreamRef.current);
        });
      } else {
        console.error("Local Stream não estava pronto ao criar PeerConnection");
      }

      peerConnectionRef.current = pc;
    } catch (e) {
      console.error("Erro ao criar RTCPeerConnection:", e);
    }
  };

  // 4. Fluxos de Chamada
  const startCall = async () => {
    if (!canCall) return;
    setIsLoading(true);
    setCallStatus("calling");

    createPeerConnection();

    // Pequeno delay para garantir estabilidade
    setTimeout(async () => {
        if(!peerConnectionRef.current) return;
        
        try {
            const offer = await peerConnectionRef.current.createOffer();
            await peerConnectionRef.current.setLocalDescription(offer);
            
            sendMessage({ type: "offer", sdp: offer.sdp });
            setIsLoading(false);
            setActiveCall(true);
        } catch (e) {
            console.error("Erro ao criar oferta:", e);
        }
    }, 500);
  };

  const handleOffer = async (data) => {
    setCallStatus("receiving");
    setActiveCall(true);
    createPeerConnection();
    try {
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription({ type: "offer", sdp: data.sdp }));
    } catch (e) {
        console.error("Erro ao setar remote description (Offer):", e);
    }
  };

  const acceptCall = async () => {
    if(!peerConnectionRef.current) return;
    try {
        const answer = await peerConnectionRef.current.createAnswer();
        await peerConnectionRef.current.setLocalDescription(answer);
        
        sendMessage({ type: "answer", sdp: answer.sdp });
        setCallStatus("connected");
        setActiveCall(false);
    } catch (e) {
        console.error("Erro ao criar resposta:", e);
    }
  };

  const handleAnswer = async (data) => {
    if(!peerConnectionRef.current) return;
    try {
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription({ type: "answer", sdp: data.sdp }));
        setCallStatus("connected");
        setActiveCall(false);
    } catch (e) {
        console.error("Erro ao processar resposta:", e);
    }
  };

  const handleCandidate = async (data) => {
    try {
      if (peerConnectionRef.current && peerConnectionRef.current.remoteDescription) {
        await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
      } 
    } catch (e) {
       console.warn("Candidato ICE ignorado ou erro:", e);
    }
  };

  const endCall = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    setActiveCall(false);
    setCallStatus("idle");
    window.location.reload(); 
  };

  // Controles
  const changeMic = () => {
    console.log("O estado de mic é: " + mic)
    setMic((prev) => {
      const newState = !prev;
      localStreamRef.current?.getAudioTracks().forEach((t) => (t.enabled = newState));
      return newState;
    });
  };

  const changeVideo = () => {
    setVideo((prev) => {
      const newState = !prev;
      localStreamRef.current?.getVideoTracks().forEach((t) => (t.enabled = newState));
      return newState;
    });
  };

  return (
    <div className="bg-black w-9/12 h-[80vh] rounded-md mt-4 flex justify-center items-center relative overflow-hidden">
      
      {/* VÍDEO REMOTO */}
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        className={`absolute w-full h-full object-cover z-0 transition-opacity duration-500 ${
            callStatus === "connected" ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* VÍDEO LOCAL */}
      <motion.div 
        className={`absolute z-10 overflow-hidden rounded-xl shadow-lg transition-all duration-500 bg-gray-900
            ${callStatus === "connected" 
                ? "w-40 h-28 bottom-4 right-4 border-2 border-orange-400" 
                : "w-full h-full inset-0 opacity-40 blur-sm" 
            }`}
        animate={callStatus === "connected" ? { scale: 1 } : { scale: 1 }}
      >
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
      </motion.div>

      {/* INTERFACE */}
      <div className="bg-transparent w-11/12 h-11/12 flex flex-col justify-between group z-20">
        
        <div className="flex justify-between items-start">
            <SignalIcon />
            {!canCall && <span className="text-white text-xs bg-red-500 px-2 py-1 rounded">Aguardando usuário...</span>}
            {canCall && callStatus === 'idle' && <span className="text-white text-xs bg-green-500 px-2 py-1 rounded">Pronto para ligar</span>}
        </div>

        {callStatus === "idle" && (
            !isLoading ? (
            <button
                disabled={!canCall}
                className={`self-center transition-all duration-300 text-white font-inter text-2xl font-bold p-5 rounded-full 
                    ${canCall 
                        ? "bg-orange-400 cursor-pointer opacity-0 group-hover:opacity-100 hover:scale-105" 
                        : "bg-gray-600 cursor-not-allowed opacity-50"}`}
                onClick={startCall}
            >
                {canCall ? "Faça um Quik" : <LogoLoading />}
            </button>
            ) : (
            <div className="flex flex-col justify-center items-center">
                <img src={Logo} width={250} height={100} />
                <LogoLoading />
                <p className="text-white mt-2">Conectando...</p>
            </div>
            )
        )}

        <AnimatePresence mode="wait">
          {activeCall && (
            <motion.div
              className="fixed inset-0 backdrop-blur bg-black/50 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="h-[90vh] w-[60vw] flex bg-[rgb(26,26,26)] rounded-xl p-4 shadow-2xl border border-gray-700"
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 20 }}
              >
                <div className="flex h-full w-full justify-center items-center gap-10">
                  {role === "candidato" && (
                    <VagasMapper vagas={vagas} view={true} />
                  )}

                  {role === "recrutador" && (
                    <iframe src="/curriculo_alexandre.pdf" className="w-1/2 h-full rounded-xl bg-white" />
                  )}
                  <div className="flex flex-col gap-10 items-center text-white">
                    <h2 className="text-2xl font-bold">
                        {callStatus === 'calling' ? "Chamando..." : "Chamada de Vídeo"}
                    </h2>
                    {callStatus === 'receiving' && (
                        <>
                            <button onClick={acceptCall} className="bg-green-500 w-full rounded-full text-white p-3 font-bold hover:bg-green-600 active:scale-95 transition-all">
                            Aceitar Chamada
                            </button>
                            <button onClick={endCall} className="bg-red-500 w-full rounded-full text-white p-3 font-bold hover:bg-red-600 active:scale-95 transition-all">
                            Recusar
                            </button>
                        </>
                    )}
                     {callStatus === 'calling' && (
                        <button onClick={endCall} className="bg-red-500 rounded-full text-white p-3 hover:bg-red-600">
                             Cancelar
                        </button>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-around bg-black/20 backdrop-blur-sm p-4 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {mic ? <Mic color="white" onClick={changeMic} className="cursor-pointer hover:scale-110 transition"/> : <MicOff color="red" onClick={changeMic} className="cursor-pointer hover:scale-110 transition"/>}
          {headset ? <Headphones color="white" onClick={() => setHeadset(!headset)} className="cursor-pointer hover:scale-110 transition"/> : <HeadphoneOff color="red" onClick={() => setHeadset(!headset)} className="cursor-pointer hover:scale-110 transition"/>}
          {video ? <Video color="white" onClick={changeVideo} className="cursor-pointer hover:scale-110 transition"/> : <VideoOff color="red" onClick={changeVideo} className="cursor-pointer hover:scale-110 transition"/>}
          <Phone size={35} className="border bg-red-600 p-2 rounded-full cursor-pointer hover:bg-red-700 transition" onClick={endCall} />
        </div>

      </div>
    </div>
  );
}