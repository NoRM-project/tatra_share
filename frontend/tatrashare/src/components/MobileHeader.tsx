import type { ReactNode } from "react";
import "../style/MobileHeader.css"

interface MobileHeaderProps {
  left?: ReactNode;
  center?: ReactNode;
  right?: ReactNode;
}

export default function MobileHeader({
  left,
  center,
  right
}: MobileHeaderProps) {
  return (
    <header className="mobileHeader">
      <div className="headerLeft">
        {left}
      </div>

      <div className="headerCenter">
        {center}
      </div>

      <div className="headerRight">
        {right}
      </div>
    </header>
  );
}