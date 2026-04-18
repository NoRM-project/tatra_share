import type { ReactNode } from "react";
import "../style/ComponentsBlock.css"

interface ComponentsBlockProps {
  label?: string;
  button?: ReactNode;
  children?: ReactNode;
}

export default function ComponentsBlock({
  label,
  button,
  children
}: ComponentsBlockProps) {
  return (
    <div className="componentBlock">
      {(label || button) && (
        <div className="componentBlockHeader">
          {label && <h2>{label}</h2>}
          {button && <div>{button}</div>}
        </div>
      )}

      <div className="componentBlockContent">
        {children}
      </div>
    </div>
  );
}