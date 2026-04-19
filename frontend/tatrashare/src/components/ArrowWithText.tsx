import Button from "./Button"
import BackIcon from "../assets/icons/BackIcon"

export default function ArrowWithText ({ label } : {label: string}) {
    return <div>
        <Button hasBackground={false} icon={<BackIcon/>} />
        <h2>{label}</h2>
    </div>
}