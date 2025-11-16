import { useRole } from "../../contexts/RoleContext";

export default function InfoContent() {
  const { role } = useRole();

  return (
    <div>
      {role === "recrutador" && <span>Info Recrutador</span>}
      {role === "candidato" && <span>Info Candidato</span>}
    </div>
  );
}
