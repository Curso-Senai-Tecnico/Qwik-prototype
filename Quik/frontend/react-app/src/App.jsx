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
import MainLayout from "./MainLayout";
import { RoleProvider } from "./contexts/RoleProvider";
import { TokenProvider } from "./contexts/TokenProvider";
import { UserProvider } from "./contexts/UserProvider";
import SaibaMais from "./pages/SaibaMais";

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
    <TokenProvider>
    <RoleProvider>
      <UserProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route path="/login" element={<Login />} />

        {/*Grupo cadastro */}
        <Route path="/candidato/cadastro" element={<CadastroCandidato />} />
        <Route path="/recrutador/cadastro" element={<CadastroRecrutador />} />

        {/*Grupo com layout */}
        <Route
          element={<MainLayout darkMode={darkMode} setDarkMode={setDarkMode} />}
        >
          <Route
            path="/home"
            element={<Home darkMode={darkMode} setDarkMode={setDarkMode} />}
          />
          <Route
            path="/candidato/dashboard"
            element={
              <DashboardCandidato
                darkMode={darkMode}
                setDarkMode={setDarkMode}
              />
            }
          />
          <Route
            path="/recrutador/dashboard"
            element={
              <DashboardRecrutador
                darkMode={darkMode}
                setDarkMode={setDarkMode}
              />
            }
          />
          <Route
            path="/recrutador/vagas"
            element={
              <CadastrarVagas darkMode={darkMode} setDarkMode={setDarkMode} />
            }
          />
          <Route
            path="/recrutador/assinatura"
            element={
              <Assinatura darkMode={darkMode} setDarkMode={setDarkMode} />
            }
          />
          <Route
          path="/saibamais"
          element={
            <SaibaMais darkMode={darkMode}/>
          }
          />
        </Route>
      </Routes>
      </UserProvider>
    </RoleProvider>
    </TokenProvider>
  );
}
