import { ArrowLeft } from "lucide-react"
import Button from "./Button"

export default function ArrowWithText (label: string) {
    return <div>
        <Button hasBackground={false} icon={<ArrowLeft/>} />
        <h2>{label}</h2>
    </div>
}