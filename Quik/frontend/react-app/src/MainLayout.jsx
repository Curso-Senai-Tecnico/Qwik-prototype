import { Outlet } from "react-router-dom";
import CustomNav from "./pages/home/CustomNav";

export default function MainLayout({ darkMode, setDarkMode, role }) {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      <CustomNav darkMode={darkMode} setDarkMode={setDarkMode} role={role} />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
