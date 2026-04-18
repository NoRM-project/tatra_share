import type { ReactNode } from "react";
import "../style/Button.css"

interface ButtonProps {
    text?: string;
    icon?: ReactNode;
    hasBackground?: boolean;
    onClick?: () => void;
}

export default function Button({
    text,
    icon,
    hasBackground = true,
    onClick
}: ButtonProps) {
    const className = hasBackground ? "buttonPrimary" : "buttonSecondary";

    return (
        <button className={className} onClick={onClick}>
            {icon && <span className="buttonIcon">{icon}</span>}
            {text && <span className="buttonText">{text}</span>}
        </button>
    );
}