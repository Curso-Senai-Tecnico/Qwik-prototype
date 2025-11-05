import React, { useState } from "react";
import { Circle } from "lucide-react";
import { User } from "lucide-react";

export default function Messenger({ darkMode, setDarkMode }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen((prev) => setIsOpen(!prev));
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [contatos, setContatos] = useState([
    { id: 1, nome: "Jackson Jailson" },
    { id: 2, nome: "Phelipe Games" },
    { id: 3, nome: "Pedro Games" },
    { id: 4, nome: "Julio Jogos" },
    { id: 5, nome: "Thiago Zabumba" },
  ]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    console.log(contatos);
    console.log(filteredContacts);
  };

  const filteredContacts = contatos.filter((contato) =>
    contato.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className={`flex flex-col transition-all duration-300 fixed bottom-0 left-0`}
    >
      <div
        className={`flex font-inter font-bold justify-between items-center ml-4 w-80 rounded-t-2xl rounded-tr-2xl cursor-pointer h-10 ${
          darkMode ? "bg-[#22303c] text-white" : "bg-white text-black"
        } ${isOpen && "w-90 border-b"}`}
        onClick={toggleChat}
      >
        <span className="ml-4">Chat</span>
        <div className="flex justify-center gap-1 items-center mr-4">
          <span className="">3</span>
          <Circle fill="rgba(9,230,49,1)" color="rgba(9,230,49,1)" size={15} />
          <User size={20} />
        </div>
      </div>
      {isOpen && (
        <div
          className={`flex flex-col font-inter font-bold justify-between items-center ml-4 h-90 overflow-scroll ${
            darkMode ? "bg-[#22303c] text-white" : "bg-white text-black"
          }`}
        >
          <div className="mt-4 border rounded-full p-2">
            <input
              type="text"
              defaultValue={searchTerm}
              onChange={handleSearchChange}
              placeholder="Pesquisar contatos..."
              className="focus:outline-0"
            ></input>
          </div>
          <div className="flex flex-col justify-start items-center w-full h-full">
            {filteredContacts.length > 0 && (
              <ul className="mt-4 w-full h-full justify-center items-center text-center">
                {filteredContacts.map((contato) => (
                  <li key={contato.id} className="p-2 border-b border-gray-500">
                    <Circle /> {contato.nome}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
