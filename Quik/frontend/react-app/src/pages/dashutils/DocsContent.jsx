import { useRole } from "../../contexts/RoleContext";
import { useUser } from "../../contexts/UserContext";

export default function DocsContent() {
  const { role } = useRole();
  const {user} = useUser()
  const API_URL = import.meta.env.VITE_API_URL
  return (
    <div className="w-full h-full">
      {role === "recrutador" && <span> Vagas</span>}
      {role === "candidato" && (
        <div className="w-full h-full flex flex-col">
          <embed src={`${API_URL}/api/file/${user?.perfil?.curriculo}`} type="application/pdf" className="h-full w-full"/>
          <div className="flex gap-2">
            <button className="bg-orange-500 backdrop-blur-2xl p-2 m-4 text-white shadow shadow-black rounded-full hover:scale-110 active:scale-90 cursor-pointer transition-transform duration-300 ease-in-out">Enviar Currículo</button>
            <button className="bg-orange-500 backdrop-blur-2xl p-2 m-4 text-white shadow shadow-black rounded-full hover:scale-110 active:scale-90 cursor-pointer transition-transform duration-300 ease-in-out">Alterar Currículo</button>
            <button className="bg-orange-500 backdrop-blur-2xl p-2 m-4 text-white shadow shadow-black rounded-full hover:scale-110 active:scale-90 cursor-pointer transition-transform duration-300 ease-in-out">Remover Currículo</button>
          </div>
        </div>
      )}
    </div>
  );
}
