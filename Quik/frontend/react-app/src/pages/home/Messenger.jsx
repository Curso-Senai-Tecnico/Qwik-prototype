import React, { useState } from "react";
import { Circle, User } from "lucide-react";
import ContactList from "./ContactList";
import ChatWindow from "./ChatWindow";
import { motion, AnimatePresence } from "framer-motion";

export default function Messenger({ darkMode, setDarkMode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);

  const [contatos] = useState([
    { id: 1, nome: "Jackson Jailson", foto: "./jack.png", online: false },
    { id: 2, nome: "Phelipe Lima", foto: "./phelipe.png", online: true },
    { id: 3, nome: "Pedro Cardoso", foto: "./pedro.png", online: false },
    { id: 4, nome: "Diogo Souza", foto: "./diogo.png", online: true },
    { id: 5, nome: "Thiago Muniz", foto: "./thiago.png", online: true },
  ]);

  const toggleChat = () => setIsOpen((prev) => !prev);
  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleSelectContact = (contato) => setSelectedContact(contato);
  const handleBack = () => setSelectedContact(null);

  const filteredContacts = contatos.filter((contato) =>
    contato.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col transition-all duration-300 fixed bottom-0 left-0">
      {/* --- Cabeçalho --- */}
      <div
        className={`flex font-inter font-bold justify-between items-center ml-4 w-80 rounded-t-2xl cursor-pointer h-10 ${
          darkMode ? "bg-[#22303c]/80 text-white" : "bg-white/80 text-black"
        } ${isOpen && "w-90 border-b"}`}
        onClick={toggleChat}
      >
        <span className="ml-4">Chat</span>
        <div className="flex justify-center gap-1 items-center mr-4">
          <span>3</span>
          <Circle fill="rgba(9,230,49,1)" color="rgba(9,230,49,1)" size={15} />
          <User size={20} />
        </div>
      </div>

      {/* --- Corpo --- */}
      {isOpen && (
        <div
          className={`flex flex-col font-inter font-bold justify-between items-center ml-4 h-90 overflow-y-scroll ${
            darkMode ? "bg-[#22303c]/80 text-white" : "bg-white/80 text-black"
          }`}
        >
          {/* Navegação interna */}
          <AnimatePresence mode="wait">
            {selectedContact ? (
              <motion.div
                key="chat"
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="relative top-0 left-0 w-full h-full"
              >
                <ChatWindow contact={selectedContact} onBack={handleBack} />
              </motion.div>
            ) : (
              <motion.div
                key="contacts"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 100, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="relative top-0 left-0 w-full h-full"
              >
                <ContactList
                  searchTerm={searchTerm}
                  onSearchChange={handleSearchChange}
                  contatos={filteredContacts}
                  onSelectContact={handleSelectContact}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
