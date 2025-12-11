import { useEffect, useState } from "react";
import { RoleContext } from "./RoleContext";
import { useToken } from "./TokenContext";
import { useUser } from "./UserContext";

export function RoleProvider({ children }) {
  const [role, setRole] = useState(localStorage.getItem("role") || null);
  const {token, setToken} = useToken()
  const {user} = useUser()

 
  useEffect(() => {
    if (token){

    
    localStorage.setItem("role", user?.usuario?.role);
  } else {
    localStorage.removeItem("role")
  }
  }, [token, user?.usuario?.role]);

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
}
