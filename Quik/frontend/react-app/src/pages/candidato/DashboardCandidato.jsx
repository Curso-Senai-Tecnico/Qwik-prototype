import DashNav from "../dashutils/DashNav";

export default function Dashboard({ darkMode}) {
  return (
    <div className="flex flex-col">
      <DashNav darkMode={darkMode}/>
    </div>
  );
}
