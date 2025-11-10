import React from "react";
import { Circle } from "lucide-react";

export default function ContactList({
  contatos,
  onSelectContact,
  searchTerm,
  onSearchChange,
}) {
  return (
    <div className="flex flex-col items-center w-full h-full">
      <div className="mt-4 border rounded-full p-2 w-4/5">
        <input
          type="text"
          value={searchTerm}
          onChange={onSearchChange}
          placeholder="Pesquisar contatos..."
          className="focus:outline-0 bg-transparent w-full text-center"
        />
      </div>

      <div className="flex flex-col justify-start items-center w-full h-full mt-3">
        {contatos.length > 0 ? (
          contatos.map((contato) => (
            <div
              key={contato.id}
              onClick={() => onSelectContact(contato)}
              className="flex gap-3 w-full justify-start p-3 items-center border-b border-gray-500 cursor-pointer hover:bg-gray-200/20 transition"
            >
              <img src={contato.foto} className="w-9 h-9 rounded-full" />
              {contato.online && (
                <Circle
                  fill="rgba(9,230,49,1)"
                  color="rgba(9,230,49,1)"
                  size={15}
                />
              )}
              <span className="font-inter font-bold text-center">
                {contato.nome}
              </span>
            </div>
          ))
        ) : (
          <p className="mt-4 text-sm opacity-60">Nenhum contato encontrado</p>
        )}
      </div>
    </div>
  );
}
