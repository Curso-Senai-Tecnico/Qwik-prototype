import React, { useState, useEffect } from 'react'
import { Users, Search } from 'lucide-react'
import Modal from './Modal'
import CadastrarVagas from '../recrutador/CadastrarVagas'
import VagasMapper from './VagasMapper'
import { useUser } from '../../contexts/UserContext'

export default function Vagas({darkMode}) {

    const [view, setView] = useState(false); // grid | list
    const [searchTerm, setSearchTerm] = useState("");
    const [modal, setModal] = useState(false);

    const [vagas, setVagas] = useState([]);
    const API_URL = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem("token");
    const {user} = useUser()

    // Buscar vagas ao carregar a página
    useEffect(() => {
        async function fetchVagas() {
            try {
                const response = await fetch(`${API_URL}/api/vagas/`, {
                    headers: {
                        Authorization: `Token ${token}`
                    }
                });
                const data = await response.json();
                console.log(data)
                setVagas(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Erro ao buscar vagas:", err);
            }
        }
        fetchVagas();
    }, []);

    
    let vagasFiltradas = []
    if (vagas !== null) {
        vagasFiltradas = vagas.filter(v =>
        v.cargo.toLowerCase().includes(searchTerm.toLowerCase()) && v.recrutador === user?.usuario?.id
    )}
    
    return (
        <div className='flex flex-col h-full'>
            <header className="flex items-center justify-between p-4 bg-gradient-to-b from-orange-400 to-orange-600 h-1/12 shadow-black/40 shadow-2xl">
                <div className='flex items-center gap-2'>
                    <div className='rounded-full bg-white p-2'>
                        <Users color='orange' />
                    </div>
                    <span className='font-inter font-bold text-white text-xl text-shadow-2xs'>
                        Gerenciamento de Vagas
                    </span>
                </div>

                <button 
                    className='font-inter font-bold bg-white text-orange-400 border border-orange-600 p-3 hover:shadow-inner hover:shadow-black/50 cursor-pointer hover:scale-110 transition-all duration-200 ease-in-out active:scale-95 rounded-lg'
                    onClick={() => setModal(true)}
                >
                    + Nova Vaga
                </button>
            </header>

            {/* ÁREA PRINCIPAL */}
            <main className='flex flex-col p-4'>
                <div className='flex mt-4 border-2 border-orange-300 p-4 items-center justify-between rounded-lg'>
                    
                    {/* SEARCH */}
                    <div className='flex items-center gap-2 p-2 border-2 border-orange-400 rounded-lg'>
                        <Search size={20} color='orange' />
                        <input 
                            type='text'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder='Buscar vaga...'
                            className='focus:outline-0 bg-transparent'
                            size={40}
                        />
                    </div>

                    {/* TROCAR VIEW */}
                    <div className='flex items-center gap-2'>
                        <span className='font-inter font-light'>Visualizar:</span>
                        <div className='flex items-center gap-2 bg-orange-200 rounded-lg p-1.5'>
                            <button 
                                className={`bg-white rounded-lg font-inter p-2 text-sm border border-white transition-colors duration-200 ease-in-out cursor-pointer hover:border hover:border-orange-400 ${view === true ? "text-orange-300" : "text-black"}`}
                                onClick={() => setView(true)}
                            >
                                Grade
                            </button>

                            <button 
                                className={`bg-white rounded-lg font-inter p-2 text-sm border border-white transition-colors duration-200 ease-in-out cursor-pointer hover:border hover:border-orange-400 ${view === false ? "text-orange-300" : "text-black"}`}
                                onClick={() => setView(false)}
                            >
                                Lista
                            </button>
                        </div>
                    </div>
                </div>

                {/* AQUI RENDERIZA AS VAGAS */}
                {vagasFiltradas.length >= 1 ? <VagasMapper
                    vagas={vagasFiltradas}
                    view={view}
                    darkMode={darkMode}
                /> : <p className='text-center'>Nenhuma vaga encontrada. Crie uma nova vaga!</p>}

            </main>

            {/* MODAL */}
            <Modal open={modal} onClose={() => setModal(false)}>
                <div className="bg-orange-100 p-10 rounded-xl overflow-y-scroll" onClick={(e) => e.stopPropagation()}>
                    <CadastrarVagas onClose={() => setModal(false)} />
                </div>
            </Modal>
        </div>
    )
}
