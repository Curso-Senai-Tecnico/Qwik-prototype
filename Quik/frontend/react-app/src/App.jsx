import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Home from "./pages/home/Home";
import Login from "./pages/Login";
import CadastroCandidato from "./pages/candidato/CadastroCandidato";
import DashboardCandidato from "./pages/candidato/DashboardCandidato";
import CadastroRecrutador from "./pages/recrutador/CadastroRecrutador";
import DashboardRecrutador from "./pages/recrutador/DashboardRecrutador";
import CadastrarVagas from "./pages/recrutador/CadastrarVagas";
import Assinatura from "./pages/recrutador/Assinatura";

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  console.log(darkMode);
  return (
    /* Configuração de rotas usando React Router para fins de organização*/
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/home"
        element={<Home darkMode={darkMode} setDarkMode={setDarkMode} />}
      />
      <Route path="/login" element={<Login />} />

      {/*Grupo candidato */}
      <Route path="/candidato/cadastro" element={<CadastroCandidato />} />
      <Route path="/candidato/dashboard" element={<DashboardCandidato />} />
      {/*Grupo recrutador */}
      <Route path="/recrutador/cadastro" element={<CadastroRecrutador />} />
      <Route path="/recrutador/dashboard" element={<DashboardRecrutador />} />
      <Route path="/recrutador/vagas" element={<CadastrarVagas />} />
      <Route path="/recrutador/assinatura" element={<Assinatura />} />
    </Routes>
  );
}
