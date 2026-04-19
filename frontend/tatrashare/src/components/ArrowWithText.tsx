import Button from "./Button";
import BackIcon from "../assets/icons/BackIcon";
import { useNavigate } from "react-router-dom";
import "../style/ArrowWithText.css"

export default function ArrowWithText({ label, to }: { label: string; to?: string }) {
  const navigate = useNavigate();

  return (
    <div className="arrowWithText">
      <Button
        hasBackground={false}
        icon={<BackIcon />}
        onClick={() => to ? navigate(to) : navigate(-1)}
      />
      <h2>{label}</h2>
    </div>
  );
}