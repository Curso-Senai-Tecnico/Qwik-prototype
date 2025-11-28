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
  const [formData, setFormData] = useState({
    nascimento: user?.candidato?.data_nascimento || "",
    genero: user?.candidato?.genero || "",
    estado_civil: user?.candidato?.estado_civil || "",
    telefone: user?.usuario?.telefone || "",
    email: user?.usuario?.email || "",
    bairro: user?.usuario?.bairro || "",
    cidade: user?.usuario?.cidade || "",
    estado: user?.usuario?.estado || ""
  })

  const [nome, setNome] = useState({nome: user?.usuario.nome || ""})
  const [isEditingName, setEditingName] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData({
        nascimento: user?.candidato?.data_nascimento || "",
    genero: user?.candidato?.genero || "",
    estado_civil: user?.candidato?.estado_civil || "",
    telefone: user?.usuario?.telefone || "",
    email: user?.usuario?.email || "",
    bairro: user?.usuario?.bairro || "",
    cidade: user?.usuario?.cidade || "",
    estado: user?.usuario?.estado || ""
      });
      setNome({nome: user.usuario?.nome})
    }
  }, [user])

  async function salvarAlteracoes() {
    const data = {... nome, ... formData}
    const response = await fetch (`http://127.0.0.1:800/api/${role}s`, {
      method: "PUT",
      headers: {Authorization: `Bearer ${token}`, "Content-Type": "application/json"},
      body: JSON.stringify(data)
    })

    const newData = await response.json()
    setUser(newData)
    setEditing(false)
    setEditingName(false)
  }
  

  

  return (
    <div className="w-full h-full flex flex-col">
      {role === "recrutador" && (
        <>
        <header className=" flex bg-gradient-to-r from-orange-400 to-orange-500 w-full h-1/10">
          <img src={user != null ? `${user.foto}` : "/qwikpadrao.png"} className="absolute w-40 h-40 rounded-full left-2 top-4 border-4 border-white active:scale-90 cursor-pointer transition-transform duration-200 ease-in-out"/>
        </header>
        <main className="flex flex-col mt-25 ml-6 mr-5">
          <div className="flex justify-between items-center">
          <form id="formNome" className="flex">
          <input type="text" size={10} name="nome" id="nome" className="font-inter font-bold text-2xl" disabled={!isEditingName} value={nome.nome != "" ? nome.nome : "Nome de usuário"} onChange={(e) => {setNome({nome: e.target.value})}}/>
          {!isEditingName ?  <PencilLine onClick={() => setEditingName(true)}/> : (<>
            <CircleCheck onClick={() => salvarAlteracoes()}/>
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
                <button type="submit" className="bg-orange-500 text-white font-inter p-2 rounded-md shadow shadow-black hover:scale-110 active:scale-90 transition-transform duration-200 ease-in-out cursor-pointer" onClick={() => salvarAlteracoes()}> Salvar </button>
                <button className="bg-orange-500 text-white font-inter p-2 rounded-md shadow shadow-black hover:scale-110 active:scale-90 transition-transform duration-200 ease-in-out cursor-pointer" onClick={() => setEditing(false)}> Cancelar </button>
            </div>
          )}
          </main>
        </>
      )}
      {role === "candidato" && (
      <>
        <header className=" flex bg-gradient-to-r from-orange-400 to-orange-500 w-full h-1/10">
          <img src={user != null ? `http://127.0.0.1:8000/media/${user.perfil.foto}` : "/qwikpadrao.png"} className="absolute w-40 h-40 rounded-full left-2 top-4 border-4 border-white active:scale-90 cursor-pointer transition-transform duration-200 ease-in-out"/>
        </header>
        <main className="flex flex-col mt-25 ml-6 mr-5">
          <div className="flex justify-between items-center">
          <form id="formNome" className="flex">
          <input type="text" size={10} name="nome" id="nome" className="font-inter font-bold text-2xl" disabled={!isEditingName} value={nome.nome != "" ? nome.nome : "Nome de usuário"} onChange={(e) => {setNome({nome: e.target.value})}}/>
          {!isEditingName ?  <PencilLine className="hover:scale-110 transition-transform duration-200 active:scale-90 cursor-pointer" onClick={() => setEditingName(true)}/> : (<>
            <CircleCheck className="hover:scale-110 transition-transform duration-200 active:scale-90 cursor-pointer" type="submit" onClick={(e) => {
              e.preventDefault()
              salvarAlteracoes()}}/>
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
          {user != null && user.perfil.tags && user.perfil.tags.length > 0 && (
          <div className="flex w-full gap-6 mt-10">  
          {user.perfil.tags.map(tag => (
            <div key={tag} className="bg-orange-200 p-2 rounded-l-full rounded-r-full hover:scale-110 transition-transform duration-300 ease-in-out ">
              <span className="font-inter text-orange-800">{tag}</span>
            </div>
          ))}
          </div>
          )}
          <h2 className="mt-10 font-inter font-bold">Informações Pessoais</h2>
          <form id="info" className="grid grid-cols-2 grid-rows-6 gap-y-8 justify-between mt-5" onSubmit={(e) => {
            e.preventDefault()
            salvarAlteracoes()
          }}>
            <label className="flex gap-2">
              <CalendarDays />
              <input type="text" id="nascimento" name="nascimento" disabled={!isEditing} placeholder={user != null ? user.data_nascimento : "Data de Nascimento"} value={formData.nascimento} onChange={(e) => setFormData({...formData, nascimento: e.target.value})} />
            </label>
            <label className="flex gap-2">
              <VenusAndMars/>
              <input type="text" id="gender" name="gender" disabled={!isEditing} placeholder={user != null ? user.genero : "Gênero"} value={formData.genero} onChange={(e) => setFormData({...formData, genero: e.target.value})} />
            </label>
            <label className="flex gap-2">
            <Gem/>
            <input type="text" id="civil" name="civil" disabled={!isEditing} placeholder={user != null ? user.estado_civil : "Estado Civil"} value={formData.estado_civil} onChange={(e) => setFormData({...formData, estado_civil: e.target.value})}/>
            </label>
            <label className="flex gap-2">
              <Phone />
              <input type="text" id="phone" name="phone" disabled={!isEditing} placeholder={user != null ? user.telefone : "Telefone"} value={formData.telefone} onChange={(e) => setFormData({...formData, telefone: e.target.value })} />
            </label>
            <label className="flex gap-2">
              <Mail />
              <input type="email" id="email" name="email" disabled={!isEditing} placeholder={user != null ? user.email : "E-mail"} value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value })} />
            </label>
            <label className="flex gap-2">
              <MapPin />
              <input type="text" id="block" name="block" disabled={!isEditing} placeholder={user != null ? user.bairro : "Bairro"} value={formData.bairro} onChange={(e) => setFormData({...formData, bairro: e.target.value })} />
            </label>
            <label className="flex gap-2">
              <MapPin />
              <input type="text" id="city" name="city" disabled={!isEditing} placeholder={user != null ? user.cidade : "Cidade"} value={formData.cidade} onChange={(e) => setFormData({...formData, cidade: e.target.value })} />
            </label>
            <label className="flex gap-2">
              <MapPin />
              <input type="text" id="state" name="state" disabled={!isEditing} placeholder={user != null ? user.estado : "Estado"} value={formData.estado} onChange={(e) => setFormData({...formData, estado: e.target.value })} />
            </label>
          </form>

          {isEditing && (
            <div className="flex justify-end items-center gap-5">
                <button type="submit" form="info" className="bg-orange-500 text-white font-inter p-2 rounded-md shadow shadow-black hover:scale-110 active:scale-90 transition-transform duration-200 ease-in-out cursor-pointer"> Salvar </button>
                <button className="bg-orange-500 text-white font-inter p-2 rounded-md shadow shadow-black hover:scale-110 active:scale-90 transition-transform duration-200 ease-in-out cursor-pointer" onClick={() => setEditing(false)}> Cancelar </button>
            </div>
          )}
        </main>
        </>
      )}
    </div>
  );
}
