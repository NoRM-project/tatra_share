import { CircleQuestionMark } from "lucide-react";
import Button from "../Button";
import MobileFooter from "../MobileFooter";
import MobileHeader from "../MobileHeader";
import SecondaryTitle from "../SecondaryTitle";

export default function GroupsPage() {

    return <>
        <MobileHeader left={<h2>TatraShare</h2>} right={<Button hasBackground={false} icon={<CircleQuestionMark color="#4da3ff"/>} />} />
        <SecondaryTitle label="Groups" button={<Button hasBackground={false} text="Add group" />} />
        {/* TODO: load groups from backend */}
        <MobileFooter/>
    </>
} 