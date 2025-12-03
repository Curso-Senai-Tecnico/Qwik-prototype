import AccessContent from "./AccessContent";
import DocsContent from "./DocsContent";
import InfoContent from "./InfoContent";

export default function MainContent({ darkMode, activeTab }) {

  
  return (
    <div
      className={`flex flex-col h-dvh w-2/6 rounded-t-3xl shadow-2xl backdrop-blur-3xl  overflow-clip ${
        darkMode
          ? "bg-[#22303c] text-white border-r-white"
          : "bg-white text-black"
      }`}
    >
      {activeTab === "info" && <InfoContent darkMode={darkMode} />}
      {activeTab === "access" && <AccessContent />}
      {activeTab === "docs" && <DocsContent />}
    </div>
  );
}
