import { Outlet } from "react-router-dom";
import CustomNav from "./pages/home/CustomNav";

export default function MainLayout({ darkMode, setDarkMode}) {
  
  return (
    <div className="flex flex-col h-screen w-screen overflow-x-hidden overflow-y-scroll">
      <CustomNav darkMode={darkMode} setDarkMode={setDarkMode}/>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
