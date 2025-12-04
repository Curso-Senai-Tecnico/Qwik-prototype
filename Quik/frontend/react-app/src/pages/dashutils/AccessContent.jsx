import { motion, AnimatePresence } from "framer-motion";
import { Circle, Signal } from "lucide-react";
import { Battery } from "lucide-react";

export default function AccessContent() {
  function getCurrentDeviceInfo() {
    const ua = navigator.userAgent;

    // Sistema operacional
    let os = "Desconhecido";
    if (/Windows/i.test(ua)) os = "Windows";
    else if (/Mac/i.test(ua)) os = "macOS";
    else if (/Linux/i.test(ua)) os = "Linux";
    else if (/Android/i.test(ua)) os = "Android";
    else if (/iPhone|iPad/i.test(ua)) os = "iOS";

    // Navegador
    let browser = "Desconhecido";
    if (/Edg/i.test(ua)) browser = "Edge";
    else if (/Chrome/i.test(ua)) browser = "Chrome";
    else if (/Firefox/i.test(ua)) browser = "Firefox";
    else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = "Safari";
    

    const deviceType = /Mobile/i.test(ua) ? "Mobile" : "Desktop";

    return {
      os,
      browser,
      deviceType,
      language: navigator.language,
      resolution: `${window.screen.width}x${window.screen.height}`,
      userAgent: ua,
      location: "São Gonçalo",
      icon: `/${os}.svg`,
      battery: `${Math.floor(Math.random() * 100) + 1}`
    };
  }

  function fakeDevice() {
    const osList = ["Windows", "Android", "iOS", "macOS", "Linux"];
    const browserList = ["Chrome", "Firefox", "Safari", "Edge"];
    const cities = [
  "Alcântara",
  "Trindade",
  "Neves",
  "Mutuá",
  "Porto da Pedra",
  "Zé Garoto",
  "Jockey",
  "Colubandê",
  "Amendoeira",
  "Itaúna",
  "Paraíso",
  "São Miguel",
  "Jardim Catarina",
  "Laranjal",
  "Barro Vermelho",
  "Gradim",
  "Engenho Pequeno",
  "Pita",
  "Mutondo",
  "Raul Veiga"
];
    const statuses = ["Ativo", "Inativo"];

    function rand(list) { return list[Math.floor(Math.random() * list.length)]; }

    const os = rand(osList)
    return {
      os,
      browser: rand(browserList),
      deviceType: Math.random() > 0.5 ? "Desktop" : "Mobile",
      location: rand(cities),
      lastActive: `${Math.floor(Math.random() * 6) + 1} horas atrás`,
      status: rand(statuses),
      name: `Dispositivo ${Math.floor(Math.random() * 10)}`,
      battery: `${Math.floor(Math.random() * 100) + 1}`,
      icon: `/${os}.svg`
    };
  }

  const current = getCurrentDeviceInfo();
  const fake1 = fakeDevice();
  const fake2 = fakeDevice();

  const devices = [
    { ...current, name: "Este dispositivo", status: "Ativo", lastActive: "Agora" },
    fake1,
    fake2
  ];

  function BatteryBar({level}){
    return(
      <div className="w-[100px] h-3 bg-neutral-200 rounded overflow-hidden">
        <motion.div 
        initial={{width: 0}}
        animate={{width: `${level}%`}}
        transition={{duration: 0.6, ease: "easeIn"}}
        className={` h-full bg-orange-500`}>

        </motion.div>
      </div>
    )
  }
  return (
    <div className="flex flex-col">
      <h1 className="ml-10 mt-2 text-xl font-inter font-bold">Dispositivos Conectados</h1>
      <h2 className="font-inter text-gray-500 ml-10">{devices.length} conectados agora</h2>
      <div className="grid grid-cols-2 grid-rows-2 gap-y-2 p-2">
        
        {devices.map((dev, i) => (
          <div key={i} className="flex flex-col gap-3 items-center p-3 rounded cursor-pointer">
            <img src={dev.icon} className="w-6 h-6"/>
            <div>
            <h3 className="font-inter">{dev.name}</h3>
            <p className="text-xs text-gray-500">{dev.os} - {dev.browser}</p>

            <p className="text-xs text-gray-400">{dev.lastActive}</p>
            </div>
            <div className="grid grid-cols-2 grid-rows-2 gap-x-2 gap-y-1 mt-3">
              <div className="gap-3">
            <p className="flex gap-2">Status </p>
            <p className="flex gap-2 items-center ">{dev.status === "Ativo" ? <Circle fill="green" color="green" size={15} /> : <Circle color="gray" size={15} />} {dev.status}</p>
            </div>
            <div>
            <p className="">Localização</p>
            <p>{dev.location}</p>
            </div>
            <div>
              <p>Bateria</p>
              <div className="flex flex-col gap-2">
                <p className="flex gap-2">{<Battery color="orange" />} {dev.battery}%</p>
                <BatteryBar level={dev.battery} />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p>Sinal</p>
              <div className="flex gap-2">
                  <Signal color="orange" />
                  <p>Excelente</p>
              </div>
            </div>
          </div>
        </div>
        ))}
      </div>
    </div>
  );
}
