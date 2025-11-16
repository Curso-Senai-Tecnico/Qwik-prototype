import { useRole } from "../../contexts/RoleContext";

export default function DocsContent() {
  const { role } = useRole();
  return (
    <div>
      {role === "recrutador" && <span> Vagas</span>}
      {role === "candidato" && <span> Curriculo</span>}
    </div>
  );
}
