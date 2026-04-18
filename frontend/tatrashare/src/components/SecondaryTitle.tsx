import type { ReactElement } from "react";

interface SecondaryTitleProps {
    label: string;
    button: ReactElement;
}

export default function SecondaryTitle({label, button} : SecondaryTitleProps) {
    return <div>
        <h2>{label}</h2>
        <div>{button}</div>
    </div>
}