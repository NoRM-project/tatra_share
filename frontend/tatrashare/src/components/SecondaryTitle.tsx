import type { ReactElement } from "react";
import "../style/SecondaryTitle.css";

interface SecondaryTitleProps {
  label: string;
  button: ReactElement;
}

export default function SecondaryTitle({ label, button }: SecondaryTitleProps) {
  return (
    <div className="secondaryTitle">
      <h2>{label}</h2>
      <div>{button}</div>
    </div>
  );
}