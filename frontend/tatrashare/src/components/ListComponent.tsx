import type { ReactElement } from "react";

interface ListComponentProps {
    header: string;
    subheader: string;
    amount?: number;
    icon?: ReactElement;
}

export default function ListComponent ({header, subheader, amount, icon} : ListComponentProps) {
    return <div>
        {icon && <>{icon}</>}
        {header && <h2>{header}</h2>}
        {subheader && <h3>{subheader}</h3>}
        {amount && <p>{amount}</p>}
    </div>
}