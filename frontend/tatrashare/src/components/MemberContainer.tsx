import CheckIcon from "../assets/icons/CheckIcon";
import SendIcon from "../assets/icons/SendIcon";
import "../style/MemberContainer.css";
import Avatar from "./Avatar";

interface MemberContainerProps {
  fullName: string;
  iban?: string;
  isReport: boolean;
  amount?: number;
}

export default function MemberContainer({
  fullName,
  iban,
  isReport,
  amount = 0,
}: MemberContainerProps) {
  const isPositive = amount > 0;

  return (
    <div className="memberContainer">
      <Avatar name={fullName} />

      <div className="memberInfo">
        <h2>{fullName}</h2>
        {!isReport && <p className="memberIban">{iban}</p>}
      </div>

      {isReport ? (
        <div className="memberRight">
          <span className={`memberAmount ${isPositive ? "positive" : "negative"}`}>
            {amount.toFixed(2)} EUR
          </span>

          <SendIcon />
          <CheckIcon />
        </div>
      ) : null}
    </div>
  );
}