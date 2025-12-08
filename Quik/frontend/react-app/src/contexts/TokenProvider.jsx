import { useEffect, useState } from "react";
import { TokenContext } from "./TokenContext";
import { useNavigate } from "react-router-dom";

export function TokenProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const navigate = useNavigate()

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  function logout(e){
    e.stopPropagation()
    setToken(null)
    navigate("/login")
  }

  return (
    <TokenContext.Provider value={{ token, setToken, logout }}>
      {children}
    </TokenContext.Provider>
  );
}
