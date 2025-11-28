import { useEffect, useState } from "react";
import { RoleContext } from "./RoleContext";

export function RoleProvider({ children }) {
  const [role, setRole] = useState(localStorage.getItem("role") || null);

  useEffect(() => {
    async function fetchRole() {
      try {
        const token = localStorage.getItem("token")
        const res = await fetch("http://127.0.0.1:8000/api/me/", {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json"
          }
        });
        const data = await res.json()
        if (data.usuario?.role) {
          setRole(data.usuario.role)
        }
      } catch(err) {
        console.log("Erro ao buscar role:", err)
      }
    }

    if (!role) {
      fetchRole()
    }
  }, [])

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
