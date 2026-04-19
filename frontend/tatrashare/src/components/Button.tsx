import type { ReactNode } from "react";
import "../style/Button.css"

interface ButtonProps {
    text?: string;
    icon?: ReactNode;
    hasBackground?: boolean;
    onClick?: () => void;
    className?: string;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
}

export default function Button({
    text,
    icon,
    hasBackground = true,
    onClick,
    className,
    type = "button",
    disabled
}: ButtonProps) {
    const baseClassName = hasBackground ? "buttonPrimary" : "buttonSecondary";
    const finalClassName = className ? `${baseClassName} ${className}` : baseClassName;

    return (
        <button className={finalClassName} onClick={onClick} type={type} disabled={disabled}>
            {icon && <span className="buttonIcon">{icon}</span>}
            {text && <span className="buttonText">{text}</span>}
        </button>
    );
}