import { Outlet } from "react-router-dom";
import CustomNav from "./pages/home/CustomNav";
import { useRole } from "./contexts/RoleContext";

export default function MainLayout({ darkMode, setDarkMode}) {
  const { role } = useRole()
  
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      <CustomNav darkMode={darkMode} setDarkMode={setDarkMode}/>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
