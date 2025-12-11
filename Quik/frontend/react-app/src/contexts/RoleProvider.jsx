import { useEffect, useState } from "react";
import { RoleContext } from "./RoleContext";
import { useToken } from "./TokenContext";

export function RoleProvider({ children }) {
  const [role, setRole] = useState(localStorage.getItem("role") || null);
  const {token, setToken} = useToken()
  const API_URL = import.meta.env.VITE_API_URL

  useEffect(() => {
    async function fetchRole() {
      try {
        if (!token) return
        const res = await fetch(`${API_URL}/api/me/`, {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
            "User-Agent": "qwik-app",
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
  }, [token]);

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
}
