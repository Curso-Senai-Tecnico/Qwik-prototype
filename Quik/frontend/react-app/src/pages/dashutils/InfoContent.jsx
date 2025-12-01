import { useRole } from "../../contexts/RoleContext";
import { PencilLine } from "lucide-react";
import { CalendarDays } from "lucide-react";
import { useEffect, useState } from "react";
import { VenusAndMars } from "lucide-react";
import { Phone } from "lucide-react";
import { Mail } from "lucide-react";
import { MapPin } from "lucide-react";
import { useUser } from "../../contexts/UserContext";
import { useToken } from "../../contexts/TokenContext";
import { CircleCheck } from "lucide-react";
import { CircleX } from "lucide-react";
import { Gem } from "lucide-react";

export default function InfoContent() {
  const { role } = useRole();
  const {token} = useToken();
  const [isEditing, setEditing] = useState(false);
  const {user, setUser} = useUser()
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

  const [foto, setFoto] = useState(user?.perfil?.foto || "")

  
  const [nome, setNome] = useState(user?.usuario?.nome || "")
  const [isEditingName, setEditingName] = useState(false)

  useEffect(() => {
    if (user) {
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
      setCandidateData({
        usuario: user?.usuario?.id,
        data_nascimento: user?.candidato?.data_nascimento || "",
        genero: user?.candidato?.genero || "",
        estado_civil: user?.candidato?.estado_civil || "",
        cpf: user?.candidato?.cpf || ""
      })
    }
  }, [user])

  async function salvarAlteracoesCandidato() {
    const data = {
    usuario: user?.usuario?.id,
    data_nascimento: candidateData.data_nascimento,
    genero: candidateData.genero,
    estado_civil: candidateData.estado_civil,
    cpf: user.candidato.cpf

    }
    try {
    const response = await fetch (`http://127.0.0.1:8000/api/candidatos/${user?.candidato?.usuario}/`, {
      method: "PATCH",
      headers: {Authorization: `Token ${token}`, "Content-Type": "application/json"},
      body: JSON.stringify(data)
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
      usuario:{
      nome: nome,
      email: userData.email,
      telefone: userData.telefone,
      cidade: userData.cidade,
      estado: userData.estado,
      bairro: userData.bairro,
      role: userData.role
      }
    }

    try {
    const response = await fetch(`http://127.0.0.1:8000/api/candidatos/${user?.usuario?.id}/`, {
      method: "PATCH",
      headers: {Authorization: `Token ${token}`, "Content-Type": "application/json"},
      body: JSON.stringify(data)
    })

    if (response.ok){
      const newData = await response.json()
      setUser({...user, usuario: newData})
      setEditing(false)
      setEditingName(false)
    } 
  } catch (err) {
    console.error(err)
  }
    
  }
  

  

  return (
    <div className="w-full h-full flex flex-col">
      {role === "recrutador" && (
        <>
        <header className=" flex bg-gradient-to-r from-orange-400 to-orange-500 w-full h-1/10">
          <img src="/qwikpadrao.png" className="absolute w-40 h-40 rounded-full left-2 top-4 border-4 border-white active:scale-90 cursor-pointer transition-transform duration-200 ease-in-out"/>
        </header>
        <main className="flex flex-col mt-25 ml-6 mr-5">
          <div className="flex justify-between items-center">
          <form id="formNome" className="flex">
          <input type="text" size={10} name="nome" id="nome" className="font-inter font-bold text-2xl" disabled={!isEditingName} value={nome.nome != "" ? nome.nome : "Nome de usuário"} onChange={(e) => {setNome({nome: e.target.value})}}/>
          {!isEditingName ?  <PencilLine onClick={() => setEditingName(true)}/> : (<>
            <CircleCheck onClick={() => salvarAlteracoesCandidato()}/>
            <CircleX onClick={() => setEditingName(false)} />
            </>
            )}
          </form>
          {isEditing === false && <button className="bg-orange-500 gap-2 flex p-3 rounded-full shadow shadow-black hover:scale-110 active:scale-90 transition-transform duration-200 ease-in-out cursor-pointer" onClick={() => setEditing(true)}>
          <PencilLine color="white" size={15}/>
          <span className="font-inter text-white text-sm">Editar Perfil</span>
          </button>}
          </div>
          <span className="font-inter text-orange-400">{user != null ? user.perfil_recrutador : "Cargo na empresa"}</span>
          <br/>
          <h2 className="font-inter font-bold">Informações pessoais</h2>
          <form className="grid grid-cols-2 grid-rows-6 gap-y-8 justify-between mt-5">

          </form>
          {isEditing && (
            <div className="flex justify-end items-center gap-5">
                <button type="submit" className="bg-orange-500 text-white font-inter p-2 rounded-md shadow shadow-black hover:scale-110 active:scale-90 transition-transform duration-200 ease-in-out cursor-pointer" onClick={() => salvarAlteracoesCandidato()}> Salvar </button>
                <button className="bg-orange-500 text-white font-inter p-2 rounded-md shadow shadow-black hover:scale-110 active:scale-90 transition-transform duration-200 ease-in-out cursor-pointer" onClick={() => setEditing(false)}> Cancelar </button>
            </div>
          )}
          </main>
        </>
      )}
      {role === "candidato" && (
      <>
        <header className=" flex bg-gradient-to-r from-orange-400 to-orange-500 w-full h-1/10">
          <img src={user != null && user?.perfil?.foto != null ? `http://127.0.0.1:8000/media/${user?.perfil?.foto}` : "/qwikpadrao.png"} className="absolute w-40 h-40 rounded-full left-2 top-4 border-4 border-white active:scale-90 cursor-pointer transition-transform duration-200 ease-in-out"/>
        </header>
        <main className="flex flex-col mt-25 ml-6 mr-5">
          <div className="flex justify-between items-center">
          <form id="formNome" className="flex">
          <input type="text" size={10} name="nome" id="nome" className="font-inter font-bold text-2xl" disabled={!isEditingName} value={nome != "" ? nome : "Nome de usuário"} onChange={(e) => {setNome(e.target.value)}}/>
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
          <br/>
          <span className="font-inter font-semibold text-xl">Habilidades</span>
          {user != null && user?.perfil?.tags && user?.perfil?.tags.length > 0 && user?.perfil?.tags.length == 5 ? (
          <div className="flex w-full gap-6 mt-10">  
          {user?.perfil?.tags.map(tag => (
            <div key={tag} className="bg-orange-200 p-2 rounded-l-full rounded-r-full hover:scale-110 transition-transform duration-300 ease-in-out ">
              <span className="font-inter text-orange-800">{tag}</span>
            </div>
          ))}
          </div>
          ) : (
          <div className="flex w-full gap-6 mt-10">  
          {user?.perfil?.tags.map(tag => (
            <div key={tag} className="bg-orange-200 p-2 rounded-l-full rounded-r-full hover:scale-110 transition-transform duration-300 ease-in-out ">
              <span className="font-inter text-orange-800">{tag}</span>
            </div>
          ))}
          <button className="bg-orange-200 p-2 rounded-l-full rounded-r-full hover:scale-110 transition-transform duration-300 ease-in-out font-inter text-orange-800 cursor-pointer active:scale-90"> + Adicionar Tags</button>
          </div>
          )}
          <h2 className="mt-10 font-inter font-bold">Informações de Usuário</h2>
          <form id="infoUser" className="grid grid-cols-2 grid-rows-4 gap-y-8 justify-between mt-5" onSubmit={(e) => {
            e.preventDefault()
            saveUsuario()
          }}>
            <label className="flex gap-2">
              <Phone />
              <input type="text" id="phone" name="phone" disabled={!isEditing} placeholder={"Telefone"} value={userData.telefone} onChange={(e) => setuserData({...userData, telefone: e.target.value })} />
            </label>
            <label className="flex gap-2">
              <Mail />
              <input type="email" id="email" name="email" disabled={!isEditing} placeholder={"E-mail"} value={userData.email} onChange={(e) => setuserData({...userData, email: e.target.value })} />
            </label>
            <label className="flex gap-2">
              <MapPin />
              <input type="text" id="block" name="block" disabled={!isEditing} placeholder={"Bairro"} value={userData.bairro} onChange={(e) => setuserData({...userData, bairro: e.target.value })} />
            </label>
            <label className="flex gap-2">
              <MapPin />
              <input type="text" id="city" name="city" disabled={!isEditing} placeholder={"Cidade"} value={userData.cidade} onChange={(e) => setuserData({...userData, cidade: e.target.value })} />
            </label>
            <label className="flex gap-2">
              <MapPin />
              <input type="text" id="state" name="state" disabled={!isEditing} placeholder={"Estado"} value={userData.estado} onChange={(e) => setuserData({...userData, estado: e.target.value })} />
            </label>
          </form>
          

          {isEditing && (
            <div className="flex justify-end items-center gap-5">
                <button type="submit" form="infoUser" className="bg-orange-500 text-white font-inter p-2 rounded-md shadow shadow-black hover:scale-110 active:scale-90 transition-transform duration-200 ease-in-out cursor-pointer"> Salvar </button>
                <button className="bg-orange-500 text-white font-inter p-2 rounded-md shadow shadow-black hover:scale-110 active:scale-90 transition-transform duration-200 ease-in-out cursor-pointer" onClick={() => setEditing(false)}> Cancelar </button>
            </div>
          )}
          <h1 className="mt-10 font-inter font-bold">Informações de Candidato</h1>
          <form id="infoCandidato" onSubmit={(e) => {
            e.preventDefault()
            salvarAlteracoesCandidato()
          }} className="grid grid-cols-2 grid-rows-3 gap-y-8 justify-between mt-5">
            <label className="flex gap-2">
              <CalendarDays />
              <input type="text" id="nascimento" name="nascimento" disabled={!isEditing} placeholder={"Data de Nascimento"} value={candidateData.data_nascimento} onChange={(e) => setCandidateData({...candidateData, data_nascimento: e.target.value})} />
            </label>
            <label className="flex gap-2">
              <VenusAndMars/>
              <input type="text" id="gender" name="gender" disabled={!isEditing} placeholder={"Gênero"} value={candidateData.genero} onChange={(e) => setCandidateData({...candidateData, genero: e.target.value})} />
            </label>
            <label className="flex gap-2">
            <Gem/>
            <input type="text" id="civil" name="civil" disabled={!isEditing} placeholder={"Estado Civil"} value={candidateData.estado_civil} onChange={(e) => setCandidateData({...candidateData, estado_civil: e.target.value})}/>
            </label>
          </form>
          {isEditing && (
            <div className="flex justify-end items-center gap-5">
                <button type="submit" form="infoCandidato" className="bg-orange-500 text-white font-inter p-2 rounded-md shadow shadow-black hover:scale-110 active:scale-90 transition-transform duration-200 ease-in-out cursor-pointer"> Salvar </button>
                <button className="bg-orange-500 text-white font-inter p-2 rounded-md shadow shadow-black hover:scale-110 active:scale-90 transition-transform duration-200 ease-in-out cursor-pointer" onClick={() => setEditing(false)}> Cancelar </button>
            </div>
          )}
        </main>
        </>
      )}
    </div>
  );
}
