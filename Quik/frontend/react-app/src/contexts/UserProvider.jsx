
import { useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import { useToken } from "./TokenContext";
import { useNavigate } from "react-router-dom";

export function UserProvider({ children }) {
  const { token, setToken } = useToken();
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const navigate = useNavigate()
  const API_URL = import.meta.env.VITE_API_URL

  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setUser(null);
        setLoadingUser(false);
        return;
      }

      try {
        setLoadingUser(true);

        const response = await fetch(`${API_URL}/api/me/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,

          },
        });

        if (!response.ok) {
          throw new Error("Falha ao carregar usuário");
        }

        const data = await response.json();
        console.log(data)
        setUser(data);
        navigate("/home")

      } catch (err) {
        console.error("Erro ao buscar dados do usuário:", err);
        setUser(null);
        setToken(null)

      } finally {
        setLoadingUser(false);
      }
    }

    loadUser();
  }, [token, setToken]);

  return (
    <UserContext.Provider value={{ user, setUser, loadingUser }}>
      {children}
    </UserContext.Provider>
  );
}


