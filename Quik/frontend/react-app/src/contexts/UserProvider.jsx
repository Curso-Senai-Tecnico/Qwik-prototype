
import { useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import { useToken } from "./TokenContext";

export function UserProvider({ children }) {
  const { token } = useToken();
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setUser(null);
        setLoadingUser(false);
        return;
      }

      try {
        setLoadingUser(true);

        const response = await fetch("/usuario/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Falha ao carregar usuário");
        }

        const data = await response.json();
        setUser(data);

      } catch (err) {
        console.error("Erro ao buscar dados do usuário:", err);
        setUser(null);

      } finally {
        setLoadingUser(false);
      }
    }

    loadUser();
  }, [token]);

  return (
    <UserContext.Provider value={{ user, setUser, loadingUser }}>
      {children}
    </UserContext.Provider>
  );
}


