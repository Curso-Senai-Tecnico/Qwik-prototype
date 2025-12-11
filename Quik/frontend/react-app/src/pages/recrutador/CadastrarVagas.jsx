import { useEffect, useState, useRef } from "react";
import { useUser } from "../../contexts/UserContext";
import { Save, Tag, X } from "lucide-react";
import { useToken } from "../../contexts/TokenContext";
import { useNavigate } from "react-router-dom";



export default function CadastrarVagas({ darkMode, setDarkMode, onClose}) {
  const {user} = useUser()
  const {token} = useToken()
  const API_URL = import.meta.env.VITE_API_URL
  const navigate = useNavigate()
  const [tagsDisponiveis, setTagsDisponiveis] = useState([])
  const tagsAreaRef = useRef(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [tagsSelecionadas, setTagsSelecionadas] = useState([]);
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    recrutador: user?.usuario?.id || "",
    tipo: "",
    contrato: "",
    cargo: "",
    localizacao: "",
    resumo: "",
    responsabilidades: "",
    requisitos: "",
    beneficios: "",
    salario: "",
    quantidade: "",
    data_publicacao: new Date().toISOString().split("T")[0],
    status: "Ativa",
    tags_nomes: []
  })

  useEffect(() => {
    fetch(`${API_URL}/api/tags/`, {
      headers: { Authorization: `Token ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        console.log(data)
        setTagsDisponiveis(data)})
      .catch(err => console.error("Erro ao buscar tags:", err));
  }, []);

  useEffect(() => {
  function handleOutside(e) {
    if (!tagsAreaRef.current) return;
    if (!tagsAreaRef.current.contains(e.target)) {
      setShowDropdown(false);
    }
  }
  document.addEventListener("mousedown", handleOutside);
  return () => document.removeEventListener("mousedown", handleOutside);
}, []);
  
  useEffect(() => {
    console.log("tagsSelecionadas atualizou:", tagsSelecionadas);
  }, [tagsSelecionadas]);

  function showToast(msg) {
  const div = document.createElement("div");
  div.className = "fixed bottom-5 right-5 bg-orange-500 text-white px-4 py-2 rounded shadow-xl animate-fade";
  div.innerText = msg;
  document.body.appendChild(div);

  setTimeout(() => {
    div.remove();
  }, 3000);
}
  
  async function handleSubmit(e){
    e.preventDefault()
    setError("")

    const camposObrigatórios = [
      "tipo",
      "contrato",
      "cargo",
      "quantidade",
      "localizacao",
      "salario",
      "resumo",
      "responsabilidades",
      "beneficios",
      "requisitos"
    ]

    console.log(formData)
    const campoVazio = camposObrigatórios.find((campo) => {
      return !formData[campo] || formData[campo].trim() === ""
    });

    if (campoVazio){
      setError("Por favor preencha todos os campos vazios")
      return
    }

    if (tagsSelecionadas.length === 0) {
      setError("Selecione ao menos uma tag.")
      return;
    }

    const payload = {
      recrutador: user?.usuario?.id,
      tipo: formData.tipo,
      contrato: formData.contrato,
      cargo: formData.cargo,
      resumo: formData.resumo,
      responsabilidades: formData.responsabilidades,
      requisitos: formData.requisitos,
      beneficios: formData.beneficios,
      salario: Number(formData.salario),
      quantidade: Number(formData.quantidade),
      localizacao: formData.localizacao,
      data_publicacao: new Date().toISOString().split("T")[0],
      status: "Ativa",
      tags_nomes: tagsSelecionadas.map(t => t.nome),
    };

    try {
      const response = await fetch(`${API_URL}/api/vagas/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
          
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok){
        throw new Error("Erro ao criar vaga")
      }

      if (response.ok ){
      const data = await response.json()
      showToast("Vaga criada com sucesso!")
      console.log(data)
      onClose()
      }
      
    } catch (err){
      console.error(err);
      setError("Erro ao enviar dados, tente novamente.")
    }
  }

  const removerTag = (tagId) => {
  setTagsSelecionadas(prev => prev.filter(t => t.id !== tagId));
};
  return (
    <div className="flex flex-col w-3xl">
      <header className="flex flex-col gap-2 bg-gradient-to-r from-orange-500 to-orange-400 justify-center items-center p-5">
          <span className="font-inter text-6xl text-white text-shadow-2xl text-shadow">Cadastro de Vagas</span>
          <span className="font-inter text-white text-shadow text-shadow-2xl">Preencha todas as informações para cadastrar uma nova oportunidade!</span>
          <div className="bg-gradient-to-r from-transparent via-white to-transparent h-1 w-full "></div>
      </header>
      <main className="bg-white border-2 border-orange-500 h-full w-full mt-10 rounded-lg">
        {error && (
            <div className="bg-red-100 text-red-700 border border-red-300 p-2 rounded">
              {error}
            </div>
          )}
        <form onSubmit={handleSubmit} className="flex flex-col">
          <span className="text-[9px] text-red-500 mt-1 ml-3 font-inter">(*) Campos obrigatórios</span>
          <div className="grid grid-cols-2 grid-rows-2 m-3 gap-2">
            <label className="flex flex-col gap-2 font-inter">
              <span>
              Tipo da Vaga <span className="text-red-500 text-xs align-super">*</span></span>
              <div className="relative">
              <select className="appearance-none h-9 w-73 px-2 border border-orange-300 rounded-lg focus:outline-0" onChange={(e) => setFormData((prev) => ({...prev, tipo: e.target.value}))}>
                <option value={""}>Selecione o tipo</option>
                <option value={"Presencial"}>Presencial</option>
                <option value={"Home Office"}>Home Office</option>
                <option value={"Híbrido"}>Híbrido</option>
              </select>
              <svg
                  className="w-4 h-4 absolute right-20 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
                </div>
            </label>
            <label className="flex flex-col gap-2 font-inter">
              <span>
              Tipo de Contrato <span className="text-red-500 text-xs align-super">*</span></span>
              <div className="relative">
              <select className="appearance-none h-9 w-73 px-2 border border-orange-300 rounded-lg focus:outline-0" onChange={(e) => setFormData((prev) => ({...prev, contrato: e.target.value}))}>
                <option value={""}>Selecione o contrato</option>
                <option value={"CLT"}>CLT</option>
                <option value={"PJ"}>PJ</option>
                <option value={"Estágio"}>Estágio</option>
                <option value={"Freelancer"}>Freelancer</option>
                <option value={"Temporário"}>Temporário</option>
              </select>
              <svg
                  className="w-4 h-4 absolute right-20 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
                </div>
            </label>
            <label className="flex flex-col gap-2 font-inter">
              <span>Cargo <span className="text-red-500 text-xs align-super">*</span></span>
              <input
              type="text"
              id="cargo"
              name="cargo"
              value={formData.cargo}
              placeholder="Ex: Desenvolvedor Frontend"
              className="border border-orange-300 p-1 rounded-lg w-73 focus:outline-orange-300"
              onChange={(e) => setFormData((prev) => ({...prev, cargo: e.target.value}))} />
            </label>
            <label className="flex flex-col gap-2 font-inter">
              <span>Quantidade de Vagas <span className="text-red-500 text-xs align-super">*</span></span>
              <input
              type="text"
              id="quantidade"
              name="quantidade"
              value={formData.quantidade}
              placeholder="Ex: 3"
              className="border border-orange-300 p-1 rounded-lg w-73 focus:outline-orange-300"
              onChange={(e) => setFormData((prev) => ({...prev, quantidade: e.target.value}))} />
            </label>
          </div>
          <div className="flex flex-col m-3 gap-2">
              <label className="flex flex-col gap-2 font-inter">
                <span>Localização <span className="text-red-500 text-xs align-super">*</span></span>
                <input
                type="text"
                id="localizacao"
                name="localizacao"
                value={formData.localizacao}
                placeholder="Ex: São Gonçalo, Rio de Janeiro"
                className="border border-orange-300 p-1 rounded-lg w-full focus:outline-orange-300"
                onChange={(e) => setFormData((prev) => ({...prev, localizacao: e.target.value}))} />
            </label>
            <label className="flex flex-col gap-2 font-inter">
                <span>Salário <span className="text-red-500 text-xs align-super">*</span></span>
                <input
                type="text"
                id="salario"
                name="salario"
                value={formData.salario}
                placeholder="Ex: R$ 3.000"
                className="border border-orange-300 p-1 rounded-lg w-full focus:outline-orange-300"
                onChange={(e) => setFormData((prev) => ({...prev, salario: e.target.value}))} />
            </label>
            <label className="flex flex-col gap-2 font-inter">
                <span>Resumo da Vaga <span className="text-red-500 text-xs align-super">*</span></span>
                <textarea
                id="resumo"
                name="resumo"
                value={formData.resumo}
                placeholder="Ex: Trabalhar com a equipe de desenvolvimento..."
                className="border border-orange-300 p-1 rounded-lg w-full focus:outline-orange-300"
                onChange={(e) => setFormData((prev) => ({...prev, resumo: e.target.value}))} />
            </label>
            <label className="flex flex-col gap-2 font-inter">
                <span>Requisitos <span className="text-red-500 text-xs align-super">*</span></span>
                <textarea
                id="requisitos"
                name="requisitos"
                value={formData.requisitos}
                placeholder="Ex: Trabalho em equipe, Ensino Superior..."
                className="border border-orange-300 p-1 rounded-lg w-full focus:outline-orange-300"
                onChange={(e) => setFormData((prev) => ({...prev, requisitos: e.target.value}))} />
            </label>
            <label className="flex flex-col gap-2 font-inter">
                <span>Responsabilidades <span className="text-red-500 text-xs align-super">*</span></span>
                <textarea
                id="responsabilidades"
                name="responsabilidades"
                value={formData.responsabilidades}
                placeholder="Ex: Desenvolver websites responsivos..."
                className="border border-orange-300 p-1 rounded-lg w-full focus:outline-orange-300"
                onChange={(e) => setFormData((prev) => ({...prev, responsabilidades: e.target.value}))} />
            </label>
            <label className="flex flex-col gap-2 font-inter">
                <span>Benefícios <span className="text-red-500 text-xs align-super">*</span></span>
                <textarea
                id="beneficios"
                name="beneficios"
                value={formData.beneficios}
                placeholder="Ex: Gympass, Plano de Saúde..."
                className="border border-orange-300 p-1 rounded-lg w-full focus:outline-orange-300"
                onChange={(e) => setFormData((prev) => ({...prev, beneficios: e.target.value}))} />
            </label>
            <label ref={tagsAreaRef} className="flex flex-col gap-2 font-inter relative">
              <div className="flex items-center gap-2">
                <Tag size={20} />
                <span>
                  Tags da Vaga <span className="text-red-500 text-xs align-super">*</span>
                </span>
              </div>
              <div className="border border-orange-300 rounded-lg p-1 w-full min-h-[38px] flex gap-1 cursor-text"
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                setShowDropdown(true)}}
              >
                {tagsSelecionadas.map((tag) => (
                  <div
                    key={tag.id}
                    className="bg-orange-200 text-orange-800 px-2 py-1 rounded flex items-center gap-1 text-sm"
                  >
                    {tag.nome}
                    <X className="cursor-pointer hover:text-orange-500" 
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      removerTag(tag.id)
                    }}/>
                  </div>
                ))}
              </div>
              <div>
                {showDropdown && (
                  <div className="absolute top-full bg-white border border-gray-300 rounded mt-1 shadow-2xl shadow-black/40 z-[9999]"
                  onClick={(e) => e.stopPropagation()}
                  >
                    {tagsDisponiveis?.map((tag) => (
                      <div key={tag.id} onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        if (!tagsSelecionadas.some(t => t.id === tag.id)) {
                              setTagsSelecionadas((prev) => ([...prev, tag]));
                            }
                          }} className="p-2 hover:bg-gray-100 cursor-pointer" >
                            {tag.nome}
                      </div>
                    ))}
                  </div>
                )}

              </div>
            </label>
          </div>
          <button type="submit" className="flex self-center gap-2 bg-gradient-to-b from-orange-400 to-orange-500 border-2 border-orange-600 text-white p-2 rounded-lg m-4 hover:scale-110 active:scale-95 transition-all duration-300 ease-in-out cursor-pointer"> <Save />Cadastrar Vaga</button>
        </form>
      </main>
    </div>
  );
}
