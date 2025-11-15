import { useEffect, useState } from "react";
import { RoleContext } from "./RoleContext";


export function RoleProvider({children}) {
    const [role, setRole] = useState(localStorage.getItem("role") || "candidato")

    useEffect(() => {
        localStorage.setItem("role", role)
    }, [role])

    return (
        <RoleContext.Provider value={{role, setRole}}>
            {children}
        </RoleContext.Provider>
    )
}

