import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import MobileFooter from "../MobileFooter";
import MobileHeader from "../MobileHeader";
import "../../style/TransactionsListPage.css";

export default function ShareTransactions() {
  return (
    <div className="transactionsPage">
      <MobileHeader
        left={
          <Link to="/transactiondetail" className="headerIconButton" aria-label="Back to transaction detail">
            <ArrowLeft size={24} strokeWidth={1.8} />
          </Link>
        }
        center={<span className="transactionsHeaderTitle">Share transaction</span>}
      />

      <main className="transactionDetailContent" />

      <MobileFooter />
    </div>
  );
}

