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


export default function RecrutadorContent({darkMode}){
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

    const [recrutadorData, setRecrutadorData] = useState({
        usuario: user?.usuario?.id,
        cnpj: user?.recrutador?.cnpj,
        perfil_recrutador: user?.recrutador?.perfil_recrutador
    })
    const [nome, setNome] = useState(user?.usuario?.nome || "")
    const [isEditingName, setEditingName] = useState(false)
    const [cargo, setCargo] = useState(user?.recrutador?.perfil_recrutador)
    const [isEditingCargo, setEditingCargo] = useState(false)

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
        if (user?.recrutador){
        setRecrutadorData({
            usuario: user?.usuario?.id,
            cnpj: user?.recrutador?.cnpj || "",
            perfil_recrutador: user?.recrutador?.perfil_recrutador || ""
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

    async function salvarAlteracoesRecrutador() {

    
        const data = {
        cnpj: recrutadorData.cnpj,
        perfil_recrutador: recrutadorData.perfil_recrutador
        }

        const cleanData = cleanFields(data, user.recrutador)

        
        try {
        const response = await fetch (`${API_URL}/api/recrutadores/${user?.usuario?.id}/`, {
        method: "PATCH",
        headers: {Authorization: `Token ${token}`, "Content-Type": "application/json"},
        body: JSON.stringify(cleanData)
        })

        const newData = await response.json()
        setUser({...user, recrutador: newData})
        setEditing(false)
        setEditingCargo(false)
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
        const response = await fetch(`${API_URL}/api/recrutadores/${user?.usuario?.id}/`, {
        method: "PATCH",
        headers: {Authorization: `Token ${token}`, "Content-Type": "application/json"},
        body: JSON.stringify(cleanData)
        })

        if (response.ok){
        const newData = await response.json()
        setUser({...user, usuario: newData.usuario})
        setEditing(false)
        setEditingCargo(false)
        } 
    } catch (err) {
        console.error(err)
    }
        
    }

    return (
        <div className="w-full h-full flex flex-col">
      {role === "recrutador" && (
        <>
      <header className="flex bg-gradient-to-r from-orange-400 to-orange-500 w-full h-1/12">
        <div className="relative w-40 h-40 top-0 left-3">
          <img
            src="/qwikpadrao.png"
            className="rounded-full w-full h-full object-cover"
          />
        </div>
      </header>

      <main className="flex flex-col mt-18 ml-6 mr-5">
        <div className="flex justify-between gap-2">
          <form id="formNome" className="flex">
          <input type="text" size={7} name="nome" id="nome" className="font-inter font-bold text-2xl" disabled={!isEditingName} value={nome} placeholder="Nome de usuário" onChange={(e) => {setNome(e.target.value)}}/>
          {!isEditingName ?  <PencilLine className="hover:scale-110 transition-transform duration-200 active:scale-90 cursor-pointer" onClick={() => setEditingName(true)}/> : (<>
            <CircleCheck className="hover:scale-110 transition-transform duration-200 active:scale-90 cursor-pointer" type="submit" onClick={(e) => {
              e.preventDefault()
              saveUsuario()}}/>
            <CircleX className="hover:scale-110 transition-transform duration-200 active:scale-90 cursor-pointer" onClick={() => setEditingName(false)} />
            </>
            )}
          </form>
          {isEditing === false && <button className="bg-orange-500 gap-2 flex p-3 rounded-full shadow shadow-black hover:scale-110 active:scale-90 transition-transform duration-200 ease-in-out cursor-pointer" onClick={() => setEditing(true)}>
          <PencilLine color="white" size={15}/>
          <span className="font-inter text-white text-sm">Editar Perfil</span>
          </button>}
        </div>
        <form onSubmit={(e) => {
          e.preventDefault()
          salvarAlteracoesRecrutador()
        }} id="formCargo" className="flex">
        <input type="text" size={11} disabled={!isEditingCargo} value={cargo} onChange={(e) => setCargo(e.target.value)} className="font-inter text-orange-500 text-lg"/>
        {!isEditingCargo ?(
          <button onClick={() => setEditingCargo(true)}>{<PencilLine color="orange" className="hover:scale-110 transition-transform duration-200 active:scale-90 cursor-pointer"/>}</button>
        ) : (
          <>
            <CircleCheck color="orange" className="hover:scale-110 transition-transform duration-200 active:scale-90 cursor-pointer" type="submit" onClick={(e) => {
              e.preventDefault()
              salvarAlteracoesRecrutador()}}/>
            <CircleX color="orange" className="hover:scale-110 transition-transform duration-200 active:scale-90 cursor-pointer" onClick={() => setEditingCargo(false)} />
          </>
        )}
       
        </form>

        <h2 className="mt-10 font-inter font-bold">Informações de Usuário</h2>
        <div className="grid grid-cols-2 grid-rows-4 gap-y-8 justify-between mt-5">
          <label className="flex gap-2">
            <Phone />
            <input
              type="text"
              disabled
              placeholder="Telefone"
              value={user?.usuario?.telefone || ""}
              className="bg-gray-100 p-2 rounded"
            />
          </label>
          <label className="flex gap-2">
            <Mail />
            <input
              type="email"
              disabled
              placeholder="E-mail"
              value={user?.usuario?.email || ""}
              className="bg-gray-100 p-2 rounded"
            />
          </label>
          <label className="flex gap-2">
            <MapPin />
            <input
              type="text"
              disabled
              placeholder="Bairro"
              value={user?.usuario?.bairro || ""}
              className="bg-gray-100 p-2 rounded"
            />
          </label>
          <label className="flex gap-2">
            <MapPin />
            <input
              type="text"
              disabled
              placeholder="Cidade"
              value={user?.usuario?.cidade || ""}
              className="bg-gray-100 p-2 rounded"
            />
          </label>
          <label className="flex gap-2">
            <MapPin />
            <input
              type="text"
              disabled
              placeholder="Estado"
              value={user?.usuario?.estado || ""}
              className="bg-gray-100 p-2 rounded"
            />
          </label>
        </div>
      </main>
    </>
      )}
      </div>
    )
    
}