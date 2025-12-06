import { useState, useEffect } from "react";
import { useUser } from "../../contexts/UserContext";
import { useToken } from "../../contexts/TokenContext";

export default function AddTagsButton() {
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
      setUser(prev => ({
        ...prev,
        perfil: {
          ...prev.perfil,
          tags: [...userTags, tag.nome]
        }
      }));
    } else {
      console.error("Erro ao adicionar tag");
    }
  };


  const tagsFiltradas = tagsDisponiveis.filter(tag => !userTags.includes(tag.nome));

  return (
    <div className="flex flex-col mt-4">
      <div className="flex flex-wrap gap-6">
        {userTags.map(tag => (
          <div key={tag} className="bg-orange-200 p-2 rounded-full hover:scale-110 transition-transform duration-300 ease-in-out">
            <span className="font-inter text-orange-800">{tag}</span>
          </div>
        ))}

        {userTags.length < 5 && (
          <button
            onClick={() => setShowDropdown(prev => !prev)}
            className="bg-orange-200 p-2 rounded-full hover:scale-110 transition-transform duration-300 ease-in-out font-inter text-orange-800 cursor-pointer active:scale-90"
          >
            + Adicionar Tags
          </button>
        )}
      </div>

      {showDropdown && (
        <div className="absolute mt-2 bg-white border rounded shadow p-2 z-50 w-60 max-h-60 overflow-auto">
          {tagsFiltradas.map(tag => (
            <div
              key={tag.id}
              onClick={() => handleAddTag(tag)}
              className="p-1 cursor-pointer hover:bg-orange-100 rounded"
            >
              {tag.nome}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
