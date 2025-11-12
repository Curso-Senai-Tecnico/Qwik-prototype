import { CircleUserRound } from "lucide-react";
import { Lock } from "lucide-react";
import { ScrollText } from "lucide-react";
import { useRole } from "../../contexts/RoleContext";

export default function DashNav({ darkMode }) {
  const { role } = useRole();
  return (
    <nav
      className={`flex flex-col gap-6 border-r h-dvh w-2/12  items-center justify-center  ${
        darkMode
          ? "bg-[#22303c] text-white border-r-white"
          : "bg-[#D9D9D9] text-black"
      }`}
    >
      <div className="flex items-center gap-1 min-w-full p-2">
        <CircleUserRound size={35} />
        <span className="font-inter font-semibold text-2xl ">
          Informações da conta
        </span>
      </div>
      <div className="flex items-center gap-1 min-w-full p-2">
        <Lock size={35} />
        <span className="font-inter font-semibold text-2xl ">
          Acesso e Segurança
        </span>
      </div>
      <div className="flex items-center gap-1 min-w-full p-2">
        <ScrollText size={35} />
        {role === "candidato" && (
          <span className="font-inter font-semibold text-2xl ">Currículo</span>
        )}
        {role === "recrutador" && (
          <span className="font-inter font-semibold text-2xl ">Vagas</span>
        )}
      </div>
    </nav>
  );
}
