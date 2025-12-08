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

export default function CandidatoContent({darkMode}) {
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
      headers: {Authorization: `Token ${token}`, "Content-Type": "application/json"},
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
      headers: {Authorization: `Token ${token}`, "Content-Type": "application/json"},
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
     
      {role === "candidato" && (
      <>
        <header className=" flex bg-gradient-to-r from-orange-400 to-orange-500 w-full h-1/12">
        <div className="relative w-40 h-40 top-0 left-3 group">
          <img src={user != null && user?.perfil?.foto != null ? `${API_URL}/${user?.perfil?.foto}` : "/qwikpadrao.png"} className="rounded-full w-full h-full object-cover group-active:scale-90 cursor-pointer transition-all duration-200 ease-in-out" onClick={handleImageClick}/>
          <div onClick={handleImageClick} className="absolute inset-5 rounded-full bg-black/30 backdrop-blur-xs 
               opacity-0 group-hover:opacity-100 flex justify-center items-center 
               transition-all duration-200 ease-in-out w-30 h-30 cursor-pointer pointer-events-none group-hover:pointer-events-auto group-active:scale-90">
                <PencilLine size={28}/>
          </div>
          <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"/>
          </div>
        </header>
        <main className="flex flex-col mt-18 ml-6 mr-5">
          <div className="flex flex-wrap justify-between items-center">
          <form id="formNome" className="flex flex-wrap">
          <input type="text" size={11} name="nome" id="nome" className="font-inter font-bold text-2xl" disabled={!isEditingName} value={nome} placeholder="Nome de usuário" onChange={(e) => {setNome(e.target.value)}}/>
          {!isEditingName ?  <PencilLine className="hover:scale-110 transition-transform duration-200 active:scale-90 cursor-pointer" onClick={() => setEditingName(true)}/> : (<>
            <CircleCheck className="hover:scale-110 transition-transform duration-200 active:scale-90 cursor-pointer" type="submit" onClick={(e) => {
              e.preventDefault()
              saveUsuario()}}/>
            <CircleX className="hover:scale-110 transition-transform duration-200 active:scale-90 cursor-pointer" onClick={() => setEditingName(false)} />
            </>
            )}
          </form>
          {isEditing === false && <button className="bg-orange-400 border border-orange-600 gap-2 flex p-3 rounded-lg shadow-2xl shadow-black/60 hover:scale-110 active:scale-90 transition-transform duration-200 ease-in-out cursor-pointer" onClick={() => setEditing(true)}>
          <PencilLine color="white" size={15}/>
          <span className="font-inter text-white text-sm">Editar Perfil</span>
          </button>}
          </div>
          <br/>
          <span className="font-inter font-semibold text-xl">Habilidades</span>
          <div className="flex w-full gap-6 mt-2">  
          <AddTagsButton darkMode={darkMode} />
          </div>
          <h2 className="mt-10 font-inter font-bold" style={{borderBottom: '2px solid #FF8C00', paddingBottom: '5px'}}>Informações de Usuário</h2>
          <form id="infoUser" className="grid grid-cols-2 grid-rows-4 gap-y-8 sm:grid-cols-1 justify-between mt-5" onSubmit={(e) => {
            e.preventDefault()
            saveUsuario()
          }}>
            <label className="flex flex-wrap gap-2">
              <Phone />
              <input type="text" id="phone" name="phone" disabled={!isEditing} placeholder={"Telefone"} value={userData.telefone} onChange={(e) => setuserData({...userData, telefone: e.target.value })} className="sm:text-sm" />
            </label>
            <label className="flex flex-wrap gap-2">
              <Mail />
              <input type="email" id="email" name="email" disabled={!isEditing} placeholder={"E-mail"} value={userData.email} onChange={(e) => setuserData({...userData, email: e.target.value })} className="sm:text-sm" />
            </label>
            <label className="flex flex-wrap gap-2">
              <MapPin />
              <input type="text" id="block" name="block" disabled={!isEditing} placeholder={"Bairro"} value={userData.bairro} onChange={(e) => setuserData({...userData, bairro: e.target.value })} className="sm:text-sm" />
            </label>
            <label className="flex flex-wrap gap-2">
              <MapPin />
              <input type="text" id="city" name="city" disabled={!isEditing} placeholder={"Cidade"} value={userData.cidade} onChange={(e) => setuserData({...userData, cidade: e.target.value })} className="sm:text-sm" />
            </label>
            <label className="flex flex-wrap gap-2">
              <MapPin />
              <input type="text" id="state" name="state" disabled={!isEditing} placeholder={"Estado"} value={userData.estado} onChange={(e) => setuserData({...userData, estado: e.target.value })} className="sm:text-sm" />
            </label>
          </form>
          

          {isEditing && (
            <div className="flex justify-end items-center gap-5">
                <button type="submit" form="infoUser" className="bg-gradient-to-b from-orange-400 to-orange-500 border border-orange-600 text-white font-inter p-2 rounded-lg shadow-2xl shadow-black/60 hover:scale-110 active:scale-90 transition-transform duration-200 ease-in-out cursor-pointer"> Salvar </button>
                <button className="bg-gradient-to-b from-orange-400 to-orange-500 border border-orange-600 text-white font-inter p-2 rounded-lg shadow-2xl shadow-black/60 hover:scale-110 active:scale-90 transition-transform duration-200 ease-in-out cursor-pointer" onClick={() => setEditing(false)}> Cancelar </button>
            </div>
          )}
          <h1 className="mt-10 font-inter font-bold" style={{borderBottom: '2px solid #FF8C00', paddingBottom: '5px'}}>Informações de Candidato</h1>
          <form id="infoCandidato" onSubmit={(e) => {
            e.preventDefault()
            salvarAlteracoesCandidato()
          }} className="grid grid-cols-2 grid-rows-3 gap-y-8 justify-between mt-5">
            <label className="flex items-center gap-2">
              <CalendarDays />
              <input type="text" id="nascimento" name="nascimento" disabled={!isEditing} placeholder={"Data de Nascimento"} value={candidateData.data_nascimento} onChange={(e) => setCandidateData({...candidateData, data_nascimento: e.target.value})} />
            </label>
            <label className="flex justify-center items-center gap-2">
              <VenusAndMars/>
              <select name="gender" className={`border px-3 py-2 rounded w-full ${darkMode ? "bg-[#22303c] text-white" : "bg-white text-black"}`} disabled={!isEditing} value={candidateData.genero} onChange={(e) => setCandidateData({...candidateData, genero: e.target.value})}>
                <option value={""}>Selecione o seu gênero</option>
                <option value={"M"}>Masculino</option>
                <option value={"F"}>Feminino</option>
                <option value={"OUTRO"}>Outros/Prefiro não responder</option>
              </select>
            </label>
            <label className="flex items-center justify-center gap-2">
            <Gem/>
            <select name="civil" className={`border px-3 py-2 rounded w-full ${darkMode ? "bg-[#22303c] text-white" : "bg-white text-black"}`} disabled={!isEditing} value={candidateData.estado_civil} onChange={(e) => setCandidateData({...candidateData, estado_civil: e.target.value})}>
              <option value={""}>Selecione seu estado civil</option>
              <option value={"Casado(a)"}>Casado(a)</option>
              <option value={"Solteiro(a)"}>Solteiro(a)</option>
              <option value={"Divorciado(a)"}>Divorciado(a)</option>
              <option value={"Viúvo(a)"}>Viúvo(a)</option>
            </select>
            
            </label>
          </form>
          {isEditing && (
            <div className="flex justify-end items-center gap-5">
                <button type="submit" form="infoCandidato" className="bg-gradient-to-b from-orange-400 to-orange-500 border border-orange-600 text-white font-inter p-2 rounded-lg shadow-2xl shadow-black/60 hover:scale-110 active:scale-90 transition-transform duration-200 ease-in-out cursor-pointer"> Salvar </button>
                <button className="bg-gradient-to-b from-orange-400 to-orange-500 border border-orange-600 text-white font-inter p-2 rounded-lg shadow-2xl shadow-black/60 hover:scale-110 active:scale-90 transition-transform duration-200 ease-in-out cursor-pointer" onClick={() => setEditing(false)}> Cancelar </button>
            </div>
          )}
        </main>
        </>
      )}
    </div>
  );
}
