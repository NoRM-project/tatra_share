import { Cloud, Search } from "lucide-react";
import { Link } from "react-router-dom";
import ComponentsBlock from "../ComponentsBlock";
import MobileFooter from "../MobileFooter";
import MobileHeader from "../MobileHeader";
import "../../style/TransactionsListPage.css";
import ArrowWithText from "../ArrowWithText";

interface TransactionItem {
  id: string;
  person: string;
  description: string;
  amount: string;
  impact?: string;
  isIncome: boolean;
}

const transactionSections: Array<{ date: string; items: TransactionItem[] }> = [
  {
    date: "16. maja 2025",
    items: [
      {
        id: "1",
        person: "ZELEZIARSTVO",
        description: "VE POS nakup",
        amount: "184,00",
        impact: "20,95 kg CO2e",
        isIncome: false,
      },
      {
        id: "2",
        person: "Obuv Bata",
        description: "VE POS nakup",
        amount: "125,00",
        impact: "20,95 kg CO2e",
        isIncome: false,
      },
      {
        id: "3",
        person: "Anna Petrovicka",
        description: "Prijata platba",
        amount: "178,00",
        impact: "20,95 kg CO2e",
        isIncome: true,
      },
    ],
  },
  {
    date: "15. maja 2025",
    items: [
      {
        id: "4",
        person: "Jan Novy",
        description: "Prijata platba",
        amount: "197,00",
        isIncome: true,
      },
    ],
  },
  {
    date: "14. maja 2025",
    items: [
      {
        id: "5",
        person: "Ing. Peter Novak",
        description: "Odoslana platba",
        amount: "120,00",
        isIncome: false,
      },
    ],
  },
  {
    date: "10. maja 2025",
    items: [
      {
        id: "6",
        person: "Klaudia Kovacova",
        description: "Prijata platba",
        amount: "115,00",
        isIncome: true,
      },
    ],
  },
];

export default function TransactionsListPage() {
  return (
    <div className="transactionsPage">
      <MobileHeader
        left={<ArrowWithText label="Tranzactions"/>}
        right={
          <button className="headerIconButton" type="button" aria-label="Search transactions">
            <Search size={22} strokeWidth={1.8} />
          </button>
        }
      />

      <main className="transactionsContent">
        {transactionSections.map((section) => (
          <ComponentsBlock key={section.date} label={section.date}>
            {section.items.map((transaction) => (
              <Link key={transaction.id} to="/transactiondetail" className="transactionRow">
                <span className={`transactionSign ${transaction.isIncome ? "income" : "expense"}`}>
                  {transaction.isIncome ? "+" : "-"}
                </span>

                <div className="transactionBody">
                  <p className="transactionPerson">{transaction.person}</p>
                  <p className="transactionDescription">{transaction.description}</p>
                </div>

                <div className="transactionMeta">
                  <p className={`transactionAmount ${transaction.isIncome ? "income" : "expense"}`}>
                    {transaction.amount} EUR
                  </p>
                  {transaction.impact && (
                    <p className="transactionImpact">
                      <Cloud size={14} strokeWidth={1.6} />
                      <span>{transaction.impact}</span>
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </ComponentsBlock>
        ))}
      </main>

      <MobileFooter />
    </div>
  );
}