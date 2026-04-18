import { useParams } from "react-router-dom";
import MobileHeader from "../MobileHeader";
import ArrowWithText from "../ArrowWithText";
import Button from "../Button";
import { QrCode } from "lucide-react";

export default function GroupDetailedPage() {
    const { groupId } = useParams();
    // TODO: get the group with id from api
    const group;


    return <>
        <MobileHeader
            left={<ArrowWithText label={group.name}
            right={<Button icon={<QrCode/>} />}
        />} />

    </>
}