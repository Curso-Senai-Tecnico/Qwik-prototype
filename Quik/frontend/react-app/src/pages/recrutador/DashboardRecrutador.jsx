import React from "react";
import { CircleUserRound } from "lucide-react";
import DashNav from "../dashutils/DashNav";

export default function Dashboard({darkMode, setDarkMode, role}) {
  return (
    <div className="flex bg-orange-500 w-dvw h-dvh">
      <DashNav role={role} />
    </div>
  );
}
