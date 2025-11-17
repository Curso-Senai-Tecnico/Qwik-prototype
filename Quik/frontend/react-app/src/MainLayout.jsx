import { Outlet } from "react-router-dom";
import CustomNav from "./pages/home/CustomNav";

export default function MainLayout({ darkMode, setDarkMode, role }) {
  const { role } = useRole();
  //const {token} = useToken();
  //console.log("Token: ", token);

  /* const [foto, setFoto] = useState(null);
  const [nome, setNome] = useState("");
 */
  /* useEffect(() => {
    async function loadProfile() {
      if (!token) return;

      const response = await fetch(`/usuario/me`, {
        headers: {Authorization: `Bearer ${token}`}
      });

      if (response.ok) {

      
      const user = await response.json();
      setNome(user.nome ?? "")
      setFoto(user.foto ?? null)
      }
    }

    loadProfile()
  }, [token]) */
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      <CustomNav darkMode={darkMode} setDarkMode={setDarkMode} role={role} />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
