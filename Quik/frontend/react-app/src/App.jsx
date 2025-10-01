import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Home from "./pages/home/Home";
import Login from "./pages/Login";
import CadastroCandidato from "./pages/candidato/CadastroCandidato";
import DashboardCandidato from "./pages/candidato/DashboardCandidato";
import PerfilCandidato from "./pages/candidato/PerfilCandidato";
import CadastroRecrutador from "./pages/recrutador/CadastroRecrutador";
import DashboardRecrutador from "./pages/recrutador/DashboardRecrutador";
import CadastrarVagas from "./pages/recrutador/CadastrarVagas";
import Assinatura from "./pages/recrutador/Assinatura";
import Separator from "./pages/Separator";

export default function App() {
  return (
    /* Configuração de rotas usando React Router para fins de organização*/
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/separator" element={<Separator />} />

      {/*Grupo candidato */}
      <Route path="/candidato/cadastro" element={<CadastroCandidato />} />
      <Route path="/candidato/dashboard" element={<DashboardCandidato />} />
      <Route path="/candidato/perfil" element={<PerfilCandidato />} />
      {/*Grupo recrutador */}
      <Route path="/recrutador/cadastro" element={<CadastroRecrutador />} />
      <Route path="/recrutador/dashboard" element={<DashboardRecrutador />} />
      <Route path="/recrutador/vagas" element={<CadastrarVagas />} />
      <Route path="/recrutador/assinatura" element={<Assinatura />} />
    </Routes>
  );
}
