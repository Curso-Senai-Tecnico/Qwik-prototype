import React from "react";
import { MapPin, DollarSign, Briefcase, Calendar } from "lucide-react";

export default function VagaDemo({ darkMode = false }) {
  const vaga = {
    contrato: "CLT",
    tipo: "Híbrido",
    cargo: "Desenvolvedor Full Stack",
    localizacao: "São Paulo - SP",
    resumo: "Estamos em busca de um desenvolvedor Full Stack para atuar no desenvolvimento e manutenção de aplicações web modernas.",
    responsabilidades: "Desenvolver novas funcionalidades, corrigir bugs e colaborar com a equipe.",
    requisitos: "Experiência com React, Node.js e bancos de dados relacionais.",
    beneficios: "Plano de saúde, VR e horário flexível.",
    salario: 6500,
    quantidade: 1,
    empresa: "Tech Corp",
    data_publicacao: new Date().toISOString().split("T")[0],
    status: "Ativa",
    tags: [
      { id: 1, nome: "React" },
      { id: 2, nome: "Node.js" },
      { id: 3, nome: "Full Stack" },
      { id: 4, nome: "JavaScript" },
    ]
  };

  const formatSalario = (v) =>
    Number(v).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  return (
    <div className="flex flex-col mt-4">
      <div
        className={`border border-orange-300 ${
          darkMode ? "bg-black text-white" : "bg-white text-black"
        } rounded-xl p-4 shadow-md hover:shadow-lg transition-all cursor-pointer font-inter`}
      >
        {/* Título + etiqueta CLT/PJ */}
        <div className="flex justify-between items-start">
          <h2 className="text-lg font-semibold text-gray-900">{vaga.cargo}</h2>
          <span className="px-2 py-1 bg-orange-200 text-orange-800 text-xs rounded-lg font-medium">
            {vaga.contrato}
          </span>
        </div>
        
        <p className="text-gray-600">{vaga.tipo}</p>
        {/* Empresa */}
        <p className="text-orange-700 font-medium mt-1">
          {vaga.empresa || "Empresa Confidencial"}
        </p>

        {/* Localização */}
        <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
          <MapPin size={16} />
          <span>{vaga.localizacao}</span>
        </div>

        {/* Salário */}
        <div className="flex items-center gap-2 text-gray-600 text-sm mt-1">
          <DollarSign size={16} />
          <span>
            {formatSalario(vaga.salario)}
            {vaga.quantidade > 1 &&
              ` - ${formatSalario(vaga.salario * vaga.quantidade)}`}
          </span>
        </div>

        {/* Resumo */}
        <p className="text-gray-700 text-sm mt-3 line-clamp-3">{vaga.resumo}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-3">
          {vaga.tags.slice(0, 3).map((tag) => (
            <span
              key={tag.id}
              className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-medium"
            >
              {tag.nome}
            </span>
          ))}
          {vaga.tags.length > 3 && (
            <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs">
              +{vaga.tags.length - 3}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center text-xs text-gray-500 mt-4">
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>
              Postado em{" "}
              {new Date(vaga.data_publicacao).toLocaleDateString("pt-BR")}
            </span>
          </div>

          
        </div>
      </div>
    </div>
  );
}
