import "../style/Tabs.css"

export default function Tabs({
  active,
  setActive,
}: {
  active: string;
  setActive: (tab: "report" | "members" | "transactions") => void;
}) {
  return (
    <div className="tabs">
      <button
        className={active === "report" ? "active" : ""}
        onClick={() => setActive("report")}
      >
        Report
      </button>

      <button
        className={active === "members" ? "active" : ""}
        onClick={() => setActive("members")}
      >
        Members
      </button>

      <button
        className={active === "transactions" ? "active" : ""}
        onClick={() => setActive("transactions")}
      >
        Transactions
      </button>
    </div>
  );
}