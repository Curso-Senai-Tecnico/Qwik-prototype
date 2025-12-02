import { useEffect, useState } from "react";
import { RoleContext } from "./RoleContext";
import { useToken } from "./TokenContext";

export function RoleProvider({ children }) {
  const [role, setRole] = useState(localStorage.getItem("role") || null);
  const {token, setToken} = useToken()

  useEffect(() => {
    async function fetchRole() {
      try {
        if (!token) return
        const res = await fetch("http://localhost:8000/api/me/", {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json"
          }
        });
        
        if (res.ok) {
          const data = await res.json()
          setRole(data.usuario.role)
        }
      } catch(err) {
        console.log("Erro ao buscar role:", err)
      }
    }

     
      fetchRole()
    
  }, [token])

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
