import { useEffect, useRef, useState } from "react";
import SignalIcon from "./SignalIcon";
import { Mic, Phone, MicOff, VideoOff, HeadphoneOff } from "lucide-react";
import { Video } from "lucide-react";
import { Headphones } from "lucide-react";
import LogoLoading from "./LogoLoading";
import Logo from "/logoNova.png";

export default function VideoChamada() {
  const [mic, setMic] = useState(true);
  const [headset, setHeadset] = useState(true);
  const [video, setVideo] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localStreamRef.current = stream;
        if (videoRef.current){
          videoRef.current.srcObject = stream
        }
      })
      .catch((err) => console.error("Erro ao acessar webcam/microfone: ", err));
  }, []);

  useEffect(() => {
    if (videoRef.current && localStreamRef.current) {
      videoRef.current.srcObject = localStreamRef.current;
    }
  }, []);

  const startCall = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
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
      <div className="bg-[rgb(26,26,26,100)] w-11/12 h-11/12 flex flex-col justify-between group">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-500 ${
            isLoading ? "opacity-100" : "opacity-0"
          }`}
        />
        <div className="relative z-10 flex flex-col h-full justify-between group">
          <SignalIcon />

          {!isLoading ? (
            <button
              className="self-center text-white font-inter text-2xl font-bold bg-orange-400 p-5 rounded-full cursor-pointer"
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

          {/* BOTÕES */}
          <div className="flex justify-around opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {mic ? (
              <Mic color="white" onClick={changeMic} />
            ) : (
              <MicOff color="white" onClick={() => setMic(!mic)} />
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
              <VideoOff color="white" onClick={() => setVideo(!video)} />
            )}
            <Phone size={35} className="border bg-red-500 p-1 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
