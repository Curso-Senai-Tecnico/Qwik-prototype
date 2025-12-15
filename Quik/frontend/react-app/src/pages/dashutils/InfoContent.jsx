import { useRole } from "../../contexts/RoleContext";
import { PencilLine } from "lucide-react";
import { CalendarDays } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { VenusAndMars } from "lucide-react";
import { Phone } from "lucide-react";
import { Mail } from "lucide-react";
import { MapPin } from "lucide-react";
import { useUser } from "../../contexts/UserContext";
import { useToken } from "../../contexts/TokenContext";
import { CircleCheck } from "lucide-react";
import { CircleX } from "lucide-react";
import { Gem } from "lucide-react";
import AddTagsButton from "./AddTagsButton";
import CandidatoContent from "./CandidatoContent";
import RecrutadorContent from "./RecrutadorContent";

export default function InfoContent({darkMode}) {
  const { role } = useRole();
  const {token} = useToken();
  const [isEditing, setEditing] = useState(false);
  const {user, setUser} = useUser()
  const API_URL = import.meta.env.VITE_API_URL
  const [userData, setuserData] = useState({
    nome: user?.usuario?.nome || "",
    telefone: user?.usuario?.telefone || "",
    email: user?.usuario?.email || "",
    bairro: user?.usuario?.bairro || "",
    cidade: user?.usuario?.cidade || "",
    estado: user?.usuario?.estado || "",
    role: user?.usuario?.role || "candidato"
  })

  const [candidateData, setCandidateData] = useState({
    usuario: user?.usuario?.id,
    data_nascimento: user?.candidato?.data_nascimento || "",
    genero: user?.candidato?.genero || "",
    estado_civil: user?.candidato?.estado_civil || "",
    cpf: user?.candidato?.cpf || ""
  })

  const [perfil, setPerfil] = useState({
    candidato: user?.candidato?.usuario,
    nome_perfil: user?.usuario?.nome || "",
    foto: user?.perfil?.foto || "/qwikpadrao.png",
    data_nascimento_perfil: candidateData.data_nascimento,
    tags: user?.perfil?.tags
  })

  
  const [nome, setNome] = useState(user?.usuario?.nome || "")
  const [isEditingName, setEditingName] = useState(false)


  useEffect(() => {
    if (user?.usuario) {
      setuserData({
      nome: user?.usuario?.nome || "",
      telefone: user?.usuario?.telefone || "",
      email: user?.usuario?.email || "",
      bairro: user?.usuario?.bairro || "",
      cidade: user?.usuario?.cidade || "",
      estado: user?.usuario?.estado || "",
      role: user?.usuario?.role || "candidato"
      });
      setNome(user?.usuario?.nome)
    }
    if (user?.candidato){
      setCandidateData({
        usuario: user?.usuario?.id,
        data_nascimento: user?.candidato?.data_nascimento || "",
        genero: user?.candidato?.genero || "",
        estado_civil: user?.candidato?.estado_civil || "",
        cpf: user?.candidato?.cpf || ""
      })
    }
  }, [user])

  function cleanFields(newData, oldData) {
  const result = {};
  for (const key in newData) {
    if (newData[key] !== oldData[key]) {
      result[key] = newData[key];
    }
  }
  return result;
}

  async function salvarAlteracoesCandidato() {

    
    const data = {
    data_nascimento: candidateData.data_nascimento,
    genero: candidateData.genero,
    estado_civil: candidateData.estado_civil,
    cpf: user.candidato.cpf
    }

    const cleanData = cleanFields(data, user.candidato)

    
    try {
    const response = await fetch (`${API_URL}/api/candidatos/${user?.usuario?.id}/`, {
      method: "PATCH",
      headers: {Authorization: `Token ${token}`, "Content-Type": "application/json", 
},
      body: JSON.stringify(cleanData)
    })

    const newData = await response.json()
    setUser({...user, candidato: newData})
    setEditing(false)
    setEditingName(false)
    } catch(err) {
      console.error(err)
    }
  }

  async function saveUsuario() {

    const data = {
      
      nome: nome,
      telefone: userData.telefone,
      cidade: userData.cidade,
      estado: userData.estado,
      bairro: userData.bairro,
      role: userData.role
      
    }

    const payload = cleanFields(data, user.usuario)

    if (Object.keys(payload).length === 0) return;

    const cleanData = {usuario: payload}

    try {
    const response = await fetch(`${API_URL}/api/candidatos/${user?.usuario?.id}/`, {
      method: "PATCH",
      headers: {Authorization: `Token ${token}`, "Content-Type": "application/json", 
},
      body: JSON.stringify(cleanData)
    })

    if (response.ok){
      const newData = await response.json()
      setUser({...user, usuario: newData.usuario})
      setEditing(false)
      setEditingName(false)
    } 
  } catch (err) {
    console.error(err)
  }
    
  }
  
  async function upload(file) {
    if (!file) return;

    const formData = new FormData();
    formData.append("foto", file)
    try {
    const response = await fetch(`${API_URL}/api/perfis/${user?.usuario?.id}/`, {
      method: "PATCH",
      headers: {
        Authorization: `Token ${token}`,
        

      },
      body: formData
    })

    if (!response.ok){
      throw new Error("Erro ao alterar foto de perfil")
    }
    const newPerfil = await response.json()
    setUser((prev) => ({...prev, perfil: {
      ...prev.perfil, foto: newPerfil.foto
    }}))
  } catch (err) {
    console.error(err)
  }
}
  
const fileInputRef = useRef(null)
function handleImageClick() {
  fileInputRef.current?.click()
}
function handleFileChange(e) {
  const selectedFile = e.target.files[0];
  if (selectedFile) {
    upload(selectedFile)
  }
}
  return (
    <div className="w-full h-full flex flex-col">
      {role === "recrutador" && (
        <RecrutadorContent darkMode={darkMode} />
      )}
      
      {role === "candidato" && (
      <CandidatoContent darkMode={darkMode} />)}
    </div>
  );
}
