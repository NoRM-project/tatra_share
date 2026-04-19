import { Cloud, Search } from "lucide-react";
import { Link } from "react-router-dom";
import ComponentsBlock from "../ComponentsBlock";
import MobileFooter from "../MobileFooter";
import MobileHeader from "../MobileHeader";
import "../../style/TransactionsListPage.css";
import ArrowWithText from "../ArrowWithText";

export interface TransactionItem {
  id: string;
  person: string;
  description: string;
  amount: string;
  isIncome: boolean;
  // detail fields
  cardNumber?: string;
  postingDate: string;
  valueDate: string;
  transactionType: string;
  merchant: string;
  merchantCity: string;
  statementDetail: string;
  co2?: string;
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
        isIncome: false,
        cardNumber: "4444**3333",
        postingDate: "16.05.2025",
        valueDate: "14.05.2025",
        transactionType: "Debit",
        merchant: "ZELEZIARSTVO CENTRUM 04",
        merchantCity: "KOŠICE",
        statementDetail: "POS purchase at ZELEZIARSTVO CENTRUM 04, Košice.",
        co2: "20,95 kg CO₂e",
      },
      {
        id: "2",
        person: "Obuv Bata",
        description: "VE POS nakup",
        amount: "125,00",
        isIncome: false,
        cardNumber: "4444**3333",
        postingDate: "16.05.2025",
        valueDate: "15.05.2025",
        transactionType: "Debit",
        merchant: "OBUV BATA 120091",
        merchantCity: "BRATISLAVA",
        statementDetail: "POS purchase at OBUV BATA 120091, Bratislava.",
        co2: "14,22 kg CO₂e",
      },
      {
        id: "3",
        person: "Anna Petrovicka",
        description: "Prijata platba",
        amount: "178,00",
        isIncome: true,
        postingDate: "16.05.2025",
        valueDate: "16.05.2025",
        transactionType: "Credit",
        merchant: "Anna Petrovicka",
        merchantCity: "—",
        statementDetail: "Incoming transfer from Anna Petrovicka. Ref: 2025/05/178.",
        co2: "0,00 kg CO₂e",
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
        postingDate: "15.05.2025",
        valueDate: "15.05.2025",
        transactionType: "Credit",
        merchant: "Jan Novy",
        merchantCity: "—",
        statementDetail: "Incoming transfer from Jan Novy. Ref: JN-0512.",
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
        postingDate: "14.05.2025",
        valueDate: "14.05.2025",
        transactionType: "Debit",
        merchant: "Ing. Peter Novak",
        merchantCity: "—",
        statementDetail: "Outgoing transfer to Ing. Peter Novak. Ref: PN-MAJ25.",
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
        postingDate: "10.05.2025",
        valueDate: "10.05.2025",
        transactionType: "Credit",
        merchant: "Klaudia Kovacova",
        merchantCity: "—",
        statementDetail: "Incoming transfer from Klaudia Kovacova. Ref: KK0510.",
      },
    ],
  },
];

export default function TransactionsListPage() {
  return (
    <div className="transactionsPage">
      <MobileHeader
        left={<ArrowWithText label="Transactions" to="/" />}
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
              <Link key={transaction.id} to="/transactiondetail" state={{ transaction }} className="transactionRow">
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