import { useEffect, useState } from "react";
import { RoleContext } from "./RoleContext";

export function RoleProvider({ children }) {
  const [role, setRole] = useState(localStorage.getItem("role"));

  useEffect(() => {
    if (role){

    
    localStorage.setItem("role", role);
  } else {
    localStorage.removeItem("role")
  }
  }, [role]);

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
}
