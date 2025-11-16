import AccessContent from "./AccessContent";
import DocsContent from "./DocsContent";
import InfoContent from "./InfoContent";

export default function MainContent({ darkMode, activeTab }) {
  return (
    <div
      className={`flex flex-col h-dvh w-4/12  ${
        darkMode
          ? "bg-[#22303c] text-white border-r-white"
          : "bg-[#D9D9D9] text-black"
      }`}
    >
      {activeTab === "info" && <InfoContent />}
      {activeTab === "access" && <AccessContent />}
      {activeTab === "docs" && <DocsContent />}
    </div>
  );
}
