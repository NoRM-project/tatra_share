import "../style/GroupContainer.css"

interface GroupContainerProps {
  header: string;
  members: number;
  amount: number;
}

export default function GroupContainer({
  header,
  members,
  amount,
}: GroupContainerProps) {
  const isPositive = amount > 0;

  return (
    <div className="groupContainer">
      <div className="groupLeft">
        <h2>{header}</h2>
        <p className="groupMembers">Members ({members})</p>
      </div>

      <div className={`groupAmount ${isPositive ? "positive" : "negative"}`}>
        {amount.toFixed(2)} EUR
      </div>
    </div>
  );
}