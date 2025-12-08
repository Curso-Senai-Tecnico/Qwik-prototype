import React from "react";
import { MapPin, DollarSign, Briefcase, Calendar } from "lucide-react";

export default function VagasMapper({ vagas = [], view, darkMode}) {
  // formata R$ X e R$ X
  const formatSalario = (v) => Number(v).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });

  return (
    <div className={`${view ? "grid grid-cols-1 md:grid-cols-2 gap-6 mt-4" : "flex flex-col gap-4 mt-4"}`}>
      {vagas.map((vaga, idx) => (
        <div
          key={idx}
          className={`border border-orange-300 ${darkMode ? "bg-black text-white" : "bg-white text-black"} rounded-xl p-4 shadow-md hover:shadow-lg transition-all cursor-pointer font-inter`}
        >
          {/* Título + etiqueta CLT/PJ */}
          <div className="flex justify-between items-start">
            <h2 className="text-lg font-semibold text-gray-900">{vaga.cargo}</h2>
            <span className="px-2 py-1 bg-orange-200 text-orange-800 text-xs rounded-lg font-medium">
              {vaga.contrato}
            </span>
          </div>

          <p >{vaga.tipo}</p>

          {/* Nome Fake da Empresa */}
          <p className="text-orange-700 font-medium mt-1">{vaga.empresa || "Empresa Confidencial"}</p>

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
              {vaga.quantidade > 1 && ` - ${formatSalario(vaga.salario * vaga.quantidade)}`}
            </span>
          </div>

          {/* Resumo }}
          <p className="text-gray-700 text-sm mt-3 line-clamp-3">{vaga.resumo}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-3">
            {vaga.tags?.slice(0, 3).map((tag) => (
              <span
                key={tag.id}
                className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-medium"
              >
                {tag.nome}
              </span>
            ))}
            {vaga.tags?.length > 3 && (
              <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs">+{vaga.tags.length - 3}</span>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center text-xs text-gray-500 mt-4">
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>Postado em {new Date(vaga.data_publicacao).toLocaleDateString("pt-BR")}</span>
            </div>

            <div className="flex gap-3">
              <button className="text-orange-700 hover:text-orange-900">✏️</button>
              <button className="text-red-600 hover:text-red-800">🗑️</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
