import { useRole } from "../../contexts/RoleContext";
import { PencilLine } from "lucide-react";
import { CalendarDays } from "lucide-react";
import { useState } from "react";
import { VenusAndMars } from "lucide-react";
import { Phone } from "lucide-react";
import { Mail } from "lucide-react";
import { MapPin } from "lucide-react";

export default function InfoContent() {
  const { role } = useRole();
  const [isEditing, setEditing] = useState(false);

  const tags = [{
    id: 1,
    tag: "HTML"
  }, {
    id:2,
    tag: "CSS"
  }, {
    id: 3,
    tag: "Rasengan"
  }, {
    id: 4,
    tag: "Pai"
  }, {
    id: 5,
    tag: "Kyuubi"
  }]

  return (
    <div className="w-full h-full flex flex-col">
      {role === "recrutador" && <span>Info Recrutador</span>}
      {role === "candidato" && (
      <>
        <header className=" flex bg-gradient-to-r from-orange-400 to-orange-500 w-full h-1/10">
          <img src="/naruto.png" className="absolute w-40 h-40 rounded-full left-2 top-4 border-4 border-white active:scale-90 cursor-pointer transition-transform duration-200 ease-in-out"/>
        </header>
        <main className="flex flex-col mt-25 ml-6 mr-5">
          <div className="flex justify-between items-center">
          <span className="font-inter font-bold text-2xl "> Naruto Uzumaki</span>
          {isEditing === false && <button className="bg-orange-500 gap-2 flex p-3 rounded-full shadow shadow-black hover:scale-110 active:scale-90 transition-transform duration-200 ease-in-out cursor-pointer" onClick={() => setEditing(true)}>
          <PencilLine color="white" size={15}/>
          <span className="font-inter text-white text-sm">Editar Perfil</span>
          </button>}
          </div>
          
          <span className="font-inter text-orange-400 font-medium text-md">Hokage</span>
          <br/>
          <span className="font-inter font-semibold text-xl">Habilidades</span>
          <div className="flex w-full gap-6 mt-10">
              
            
          {tags.map(tag => (
            <div key={tag.id} className="bg-orange-200 p-2 rounded-l-full rounded-r-full hover:scale-110 transition-transform duration-300 ease-in-out ">
              <span className="font-inter text-orange-800">{tag.tag}</span>
            </div>
          ))}
          </div>
          <h2 className="mt-10 font-inter font-bold">Informações Pessoais</h2>
          <form className="grid grid-cols-2 grid-rows-6 gap-y-8 justify-between mt-5">
            <label className="flex gap-2">
              <CalendarDays />
              <input type="text" id="nascimento" name="nascimento" disabled={!isEditing} placeholder="10/10/1999" />
            </label>
            <label className="flex gap-2">
              <VenusAndMars/>
              <input type="text" id="gender" name="gender" disabled={!isEditing} placeholder="Não-Binário" />
            </label>
            <label className="flex gap-2">
              <Phone />
              <input type="text" id="phone" name="phone" disabled={!isEditing} placeholder="(21) 90023-7695" />
            </label>
            <label className="flex gap-2">
              <Mail />
              <input type="email" id="email" name="email" disabled={!isEditing} placeholder="narutinho@konoha.com.br"/>
            </label>
            <label className="flex gap-2">
              <MapPin />
              <input type="text" id="address" name="address" disabled={!isEditing} placeholder="Rua do Hokage, 95" />
            </label>
            <label className="flex gap-2">
              <MapPin />
              <input type="text" id="block" name="block" disabled={!isEditing} placeholder="Bairro do Hokage" />
            </label>
            <label className="flex gap-2">
              <MapPin />
              <input type="text" id="city" name="city" disabled={!isEditing} placeholder="Konohagakure" />
            </label>
            <label className="flex gap-2">
              <MapPin />
              <input type="text" id="state" name="state" disabled={!isEditing} placeholder="País do Fogo" />
            </label>
          </form>

          {isEditing && (
            <div className="flex justify-end items-center gap-5">
                <button type="submit" className="bg-orange-500 text-white font-inter p-2 rounded-md shadow shadow-black hover:scale-110 active:scale-90 transition-transform duration-200 ease-in-out cursor-pointer" onClick={() => setEditing(false)}> Salvar </button>
                <button className="bg-orange-500 text-white font-inter p-2 rounded-md shadow shadow-black hover:scale-110 active:scale-90 transition-transform duration-200 ease-in-out cursor-pointer" onClick={() => setEditing(false)}> Cancelar </button>
            </div>
          )}
        </main>
        </>
      )}
    </div>
  );
}
