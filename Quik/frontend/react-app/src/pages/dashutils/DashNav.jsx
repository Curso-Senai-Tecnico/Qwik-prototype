import { CircleUserRound } from "lucide-react";
import { Lock } from "lucide-react";
import { ScrollText } from "lucide-react";

export default function DashNav({ role }) {
  return (
    <nav className="flex flex-col gap-6 border-r h-dvh w-2/12 bg-[#D9D9D9] items-center justify-center">
      <div className="flex items-center gap-1 min-w-full p-2">
        <CircleUserRound />
        <span className="font-inter font-semibold ">Informações da conta</span>
      </div>
      <div className="flex items-center gap-1 min-w-full p-2">
        <Lock />
        <span className="font-inter font-semibold ">Acesso e Segurança</span>
      </div>
      <div className="flex items-center gap-1 min-w-full p-2">
        <ScrollText />
        {role === "candidato" && (
          <span className="font-inter font-semibold ">Currículo</span>
        )}
        {role === "recrutador" && (
          <span className="font-inter font-semibold ">Vagas</span>
        )}
      </div>
    </nav>
  );
}
