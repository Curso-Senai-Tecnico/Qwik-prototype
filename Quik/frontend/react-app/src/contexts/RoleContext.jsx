import { createContext, useContext } from "react";
export const RoleContext = createContext()

export function useRole(){
    return useContext(RoleContext)
}