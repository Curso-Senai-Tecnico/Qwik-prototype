import { CircleUserRound } from "lucide-react";
import { Lock } from "lucide-react";
import { ScrollText } from "lucide-react";
import { useRole } from "../../contexts/RoleContext";

export default function DashNav({ darkMode, activeTab, onNavClick }) {
  const { role } = useRole();

  const navItems = [
    { id: "info", label: "Informações da conta", icon: CircleUserRound },
    { id: "access", label: "Acesso e Segurança", icon: Lock },
    {
      id: "docs",
      label: role === "candidato" ? "Currículo" : "Vagas",
      icon: ScrollText,
    },
  ];

  return (
    <nav
      className={`flex flex-col gap-6 border-r min-h-dvh w-2/12  items-center justify-center  ${
        darkMode
          ? "bg-[#22303c] text-white border-r-white"
          : "bg-white text-black"
      }`}
    >
      {navItems.map(({ id, label, icon: Icon }) => (
        <div
          key={id}
          onClick={() => onNavClick(id)}
          className={`flex items-center gap-1 min-w-full p-2 cursor-pointer transition-all duration-200 ${
            activeTab === id ? "rounded-full bg-[#FFD580]" : ""
          }`}
        >
          <Icon size={35} />
          <span className="font-inter font-semibold text-2xl">{label}</span>
        </div>
      ))}
    </nav>
  );
}
