import DashNav from "../dashutils/DashNav";
import MainContent from "../dashutils/MainContent";
import { useState } from "react";

export default function Dashboard({ darkMode }) {
  const [activeTab, setActiveTab] = useState("info");
  const handleNavClick = (tab) => {
    setActiveTab(tab);
  };
  return (
    <div className="flex gap-[20%] bg-orange-500 w-screen overflow-x-hidden">
      <DashNav
        darkMode={darkMode}
        activeTab={activeTab}
        onNavClick={handleNavClick}
      />
      <MainContent darkMode={darkMode} activeTab={activeTab} />
    </div>
  );
}
