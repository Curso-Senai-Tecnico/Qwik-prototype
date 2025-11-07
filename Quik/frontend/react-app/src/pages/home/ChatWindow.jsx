import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";

export default function ChatWindow({ contact, onBack }) {
  const [mensagem, setMensagem] = useState("");
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftkey) {
      e.preventDefault();
      send();
    }
  };

  const send = () => {
    if (mensagem.trim() === "") return;
    console.log("enviou: ", mensagem);
    setMensagem("");
  };

  const enviarMensagem = () => {};
  return (
    <div className="flex flex-col w-full h-full justify-between">
      <div className="flex items-center w-full p-3 border-b border-gray-500">
        <button onClick={onBack} className="mr-3 hover:opacity-70">
          <ArrowLeft size={20} className="cursor-pointer" />
        </button>
        <img src={contact.foto} className="w-8 h-8 rounded-full mr-2" />
        <span className="font-bold">{contact.nome}</span>
      </div>

      <div>
        <textarea
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={2}
          placeholder="Digite sua mensagem..."
        ></textarea>
      </div>
    </div>
  );
}
