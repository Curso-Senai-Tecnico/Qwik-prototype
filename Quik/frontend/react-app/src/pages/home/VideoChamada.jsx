import { useState } from "react";
import SignalIcon from "./SignalIcon";
import { Mic, Phone, MicOff, VideoOff, HeadphoneOff } from "lucide-react";
import { Video } from "lucide-react";
import { Headphones } from "lucide-react";

export default function VideoChamada() {
  const [mic, setMic] = useState(true);
  const [headset, setHeadset] = useState(true);
  const [video, setVideo] = useState(true);

  const changeMic = () => {
    setMic((prev) => !prev);
  };
  const changeHeadset = () => {
    setHeadset((prev) => !prev);
  };
  const changeVideo = () => {
    setVideo((prev) => !prev);
  };

  return (
    <div className="bg-black w-10/12 h-10/12 rounded-md mt-4 flex justify-center items-center">
      <div className="bg-[rgb(26,26,26,100)] w-11/12 h-11/12 flex flex-col justify-between group">
        <SignalIcon />
        <button className="text-white font-inter text-2xl font-bold border-orange-400 bg-orange-400 w-fit h-fit self-center justify-self-center p-4 rounded-full inset-shadow-black inset-shadow-2xs cursor-pointer">
          Faça um Quik
        </button>
        <div className="flex justify-around opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {mic ? (
            <Mic color="white" onClick={changeMic} />
          ) : (
            <MicOff color="white" onClick={changeMic} />
          )}
          {headset ? (
            <Headphones color="white" onClick={changeHeadset} />
          ) : (
            <HeadphoneOff color="white" onClick={changeHeadset} />
          )}
          {video ? (
            <Video color="white" onClick={changeVideo} />
          ) : (
            <VideoOff color="white" onClick={changeVideo} />
          )}
          <Phone
            fill="red"
            color="white"
            size={35}
            className="border bg-red-500 p-1 rounded-full hover:bg-red-700 active:scale-95"
          />
        </div>
      </div>
    </div>
  );
}
