import { useRole } from "../../contexts/RoleContext";
import { useToken } from "../../contexts/TokenContext";
import { useUser } from "../../contexts/UserContext";
import PdfViewer from "./PdfViewer";

export default function DocsContent() {
  const { role } = useRole();
  const {user, setUser} = useUser()
  const {token} = useToken()
  const API_URL = import.meta.env.VITE_API_URL

  const handleUpload = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "application/pdf"

    input.onchange = async () => {
      const file = input.files[0]
      if (!file) return;

      const formData = new FormData()
      formData.append("curriculo", file)

      const response = await fetch (`${API_URL}/api/perfis/${user?.usuario?.id}/`, {
        method: "PATCH",
        headers: {
          Authorization: `Token ${token}`,
        },
        body: formData,
      })

      const data = await response.json()

      setUser(prev => ({
        ...prev, perfil: {
          ...prev.perfil,
          curriculo: data.curriculo
        }
      }))
    }

    input.click();
  }

  const handleRemove = async () => {
    const formData = new FormData();
    formData.append("curriculo", "");

    const response = await fetch(`${API_URL}/api/perfis/${user.usuario.id}/`, {
      method: "PATCH",
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
      body: formData,
    });

    const data = await response.json();

    // Atualiza contexto
    setUser(prev => ({
      ...prev,
      perfil: {
        ...prev.perfil,
        curriculo: null,
      }
    }));
  };

  function formatCurriculoUrl(url) {
    if (!url) return "";
    return url.replace(/^\/media\//, '')
  }

  const curriculoUrl = user?.perfil?.curriculo
  const trueUrl = formatCurriculoUrl(curriculoUrl)
  console.log(trueUrl)
  return (
    <div className="w-full h-full">
      {role === "recrutador" && <span> Vagas</span>}
      {role === "candidato" && (
        <div className="w-full h-full flex flex-col">
          <PdfViewer fileUrl={`${API_URL}/api/file/ ${trueUrl}`} />
          <div className="flex items-center justify-center gap-2 bg-none">
            <button onClick={handleUpload} className="bg-orange-500 backdrop-blur-2xl p-2 m-4 text-white shadow shadow-black rounded-full hover:scale-110 active:scale-90 cursor-pointer transition-transform duration-300 ease-in-out">Enviar Currículo</button>
            <button onClick={handleUpload} className="bg-orange-500 backdrop-blur-2xl p-2 m-4 text-white shadow shadow-black rounded-full hover:scale-110 active:scale-90 cursor-pointer transition-transform duration-300 ease-in-out">Alterar Currículo</button>
            <button onClick={handleRemove} className="bg-orange-500 backdrop-blur-2xl p-2 m-4 text-white shadow shadow-black rounded-full hover:scale-110 active:scale-90 cursor-pointer transition-transform duration-300 ease-in-out">Remover Currículo</button>
          </div>
        </div>
      )}
    </div>
  );
}
