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
import { Users } from "lucide-react";
import { CheckCircle } from "lucide-react";
import { Clock } from "lucide-react";


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
        perfil_recrutador: cargo
        }

        const cleanData = cleanFields(data, user.recrutador)

        
        try {
        const response = await fetch (`${API_URL}/api/recrutadores/${user?.usuario?.id}/`, {
        method: "PATCH",
        headers: {Authorization: `Token ${token}`, "Content-Type": "application/json", 
},
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

    const payload = {}
    for (const key in data) {
    if (data[key] !== null && data[key] !== "") {
      payload[key] = data[key]
    }
  }

    if (Object.keys(payload).length === 0) return;

    const cleanData = {usuario: payload}

      try {
        const response = await fetch(`${API_URL}/api/recrutadores/${user?.usuario?.id}/`, {
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
        setEditingCargo(false)
        } 
    } catch (err) {
        console.error(err)
    }
        
    }

    const statistics = [{ icon: CalendarDays, label: 'Entrevistas Realizadas', value: 127, color: 'text-orange-600' },
    { icon: Users, label: 'Candidatos em Análise', value: 23, color: 'text-orange-600' },
    { icon: CheckCircle, label: 'Contratações Efetuadas', value: 8, color: 'text-orange-600' },
    { icon: Clock, label: 'Média de Tempo por Processo', value: '3 dias', color: 'text-orange-600' }]

    const monthly = [{label: 'Taxa de Contratação', value: '96%'},
      {label: 'Recomendações de candidatos', value: 45},
      {label: 'Vagas Ativas', value: '15'}
    ]

    return (
        <div className="w-full flex flex-col">
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

      <main className="flex flex-col mt-15 ml-6 mr-5">
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
          {isEditing === false && <button className="bg-gradient-to-b from-orange-400 to-orange-500 border border-orange-600 gap-2 flex p-3 rounded-lg shadow-2xl shadow-black/50 hover:scale-110 active:scale-90 transition-transform duration-200 ease-in-out cursor-pointer" onClick={() => setEditing(true)}>
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

        <h1 className="mt-10 font-inter font-bold text-xl" style={{borderBottom: '2px solid #FF8C00', paddingBottom: '5px'}}>Informações de Usuário</h1>
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
                <button type="submit" form="infoUser" className="bg-gradient-to-b from-orange-400 to-orange-500 border border-orange-600 text-white font-inter p-2 rounded-lg shadow-2xl shadow-black/60 hover:scale-110 active:scale-90 transition-transform duration-200 ease-in-out cursor-pointer"> Salvar </button>
                <button className="bg-gradient-to-b from-orange-400 to-orange-500 border border-orange-600 text-white font-inter p-2 rounded-lg shadow-2xl shadow-black/60 hover:scale-110 active:scale-90 transition-transform duration-200 ease-in-out cursor-pointer" onClick={() => setEditing(false)}> Cancelar </button>
            </div>
          )}
          <div>
            <h1 className="font-inter font-bold text-xl text-shadow-lg" style={{borderBottom: '2px solid #FF8C00', paddingBottom: '5px'}}>Estatísticas de Recrutamento</h1>
            <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
              {statistics.map((stat, index) => (
                <div key={index} className="flex flex-col gap-2 mt-5 rounded-xl p-6 border border-orange-400 shadow-black/40 shadow-2xl">
                  <div className="flex gap-2 font-bold font-inter items-center">
                    <stat.icon className={stat.color} size={25} />
                    <span className="text-xl text-shadow text-shadow-2xl">{stat.value}</span>
                  </div>
                  <div>
                    <span>{stat.label}</span>
                  </div>
                  
                </div>
              ))}

            </div>
          </div>
          <div className="flex flex-col mt-10">
              <h1 className="font-inter font-bold text-xl text-shadow-lg" style={{borderBottom: '2px solid #FF8C00', paddingBottom: '5px'}}>Desempenho Mensal</h1>
              <div className="grid grid-cols-3 gap-4 mb-10">
                {monthly.map((stat, index) => (
                  <div key={index} className="flex flex-col mt-5 bg-orange-400 border rounded-lg border-orange-600 shadow-2xl shadow-black/50 p-2">
                    <span className="font-bold text-white font-inter text-xl text-shadow-2xs ">{stat.value}</span>
                    <span className="text-white font-inter text-md text-shadow-2xs">{stat.label}</span>
                  </div>
                ))}
              </div>
          </div>
      </main>
    </>
      )}
      </div>
    )
    
}