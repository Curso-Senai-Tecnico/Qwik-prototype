import DashNav from "../dashutils/DashNav";

export default function Dashboard({darkMode}) {
  return (
    <div className="flex bg-orange-500 w-dvw h-dvh">
      <DashNav darkMode={darkMode} />
    </div>
  );
}
