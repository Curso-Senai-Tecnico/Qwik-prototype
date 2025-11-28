import { useRole } from "../../contexts/RoleContext";

export default function DocsContent() {
  const { role } = useRole();
  return (
    <div className="w-full h-full">
      {role === "recrutador" && <span> Vagas</span>}
      {role === "candidato" && (
        <div className="w-full h-full flex flex-col">
          <iframe src="/curriculo_alexandre.pdf" className="h-full w-full"/>
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
