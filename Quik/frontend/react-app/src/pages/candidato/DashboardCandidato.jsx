import DashNav from "../dashutils/DashNav";
import { useState } from "react";
import MainContent from "../dashutils/MainContent";

export default function Dashboard({ darkMode }) {
  const [activeTab, setActiveTab] = useState("info");
  const handleNavClick = (tab) => {
    setActiveTab(tab);
  };
  return (
    <div className="flex gap-120 bg-orange-500 w-dvw h-dvh ">
      <DashNav
        darkMode={darkMode}
        activeTab={activeTab}
        onNavClick={handleNavClick}
      />
      <MainContent darkMode={darkMode} activeTab={activeTab} />
    </div>
  );
}
