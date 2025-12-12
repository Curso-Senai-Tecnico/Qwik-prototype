import { useState, useEffect } from "react";
import { useUser } from "../../contexts/UserContext";
import { useToken } from "../../contexts/TokenContext";
import { X } from "lucide-react";

export default function AddTagsButton({darkMode}) {
  const { user, setUser } = useUser();
  const { token } = useToken();
  const API_URL = import.meta.env.VITE_API_URL;

  const [tagsDisponiveis, setTagsDisponiveis] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  
  const userTags = user?.perfil?.tags || [];

 
  useEffect(() => {
    fetch(`${API_URL}/api/tags/`, {
      headers: { Authorization: `Token ${token}` }
    })
      .then(res => res.json())
      .then(data => setTagsDisponiveis(data))
      .catch(err => console.error("Erro ao buscar tags:", err));
  }, []);


  const handleAddTag = async (tag) => {
    if (userTags.includes(tag.nome)) return; // evita duplicata
    if (userTags.length >= 5) return; // limite de 5 tags

    const response = await fetch(`${API_URL}/api/perfis/${user?.perfil?.candidato}/add_tag/`, {
      method: "POST",
      headers: {
        "Authorization": `Token ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ tag_id: tag.id })
    });

    if (response.ok) {
        const data = await response.json()
        setUser(prev => ({
        ...prev,
        perfil: {
          ...prev.perfil,
          tags: data.tags
        }
      }));
    } else {
      console.error("Erro ao adicionar tag");
    }
  };


  const tagsFiltradas = tagsDisponiveis.filter(tag => !userTags.includes(tag.nome));

  return (
    <div className="flex flex-col mt-4 relative">
      <div className="flex flex-wrap gap-6">
        {userTags.map(tag => (
          <div key={tag} className={`${darkMode ? "bg-[#22303c]" : "bg-white"} flex gap-2 items-center border shadow shadow-black border-orange-600 p-2 rounded-full hover:scale-110 transition-transform duration-300 ease-in-out group`}>
            <span className="font-inter font-semibold text-orange-400">{tag}</span>
            <X color="orange" size={15} className="cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out" />
          </div>
        ))} 
        

        {userTags.length < 5 && (
          <button
            onClick={() => setShowDropdown(prev => !prev)}
            className={`${darkMode ? "bg-[#2203c]" : "bg-white"} border border-orange-300 shadow shadow-black p-2 rounded-full hover:scale-110 transition-transform duration-300 ease-in-out font-inter text-orange-400 cursor-pointer active:scale-90`}
          >
            + Adicionar Tags
          </button>
        )}
      </div>

      {showDropdown && (
        <div className="absolute mt-2 bg-white border rounded-xl shadow-lg p-2 z-50 w-60 max-h-60 overflow-auto" style={{top: "100%", left: 0}}>
          {tagsFiltradas.map(tag => (
            <div
              key={tag.id}
              onClick={() => handleAddTag(tag)}
              className="p-1 cursor-pointer hover:bg-orange-100 hover:border hover:border-orange-300 rounded text-orange-400"
            >
              {tag.nome}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
