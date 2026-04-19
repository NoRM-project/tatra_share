import { Link } from "react-router-dom";
import MobileFooter from "../MobileFooter";
import MobileHeader from "../MobileHeader";
import "../../style/TransactionsListPage.css";
import BackIcon from "../../assets/icons/BackIcon";

export default function ShareTransactions() {
  return (
    <div className="transactionsPage">
      <MobileHeader
        left={
          <Link to="/transactiondetail" className="headerIconButton" aria-label="Back to transaction detail">
            <BackIcon />
          </Link>
        }
        center={<span className="transactionsHeaderTitle">Share transaction</span>}
      />

      <main className="transactionDetailContent" />

      <MobileFooter />
    </div>
  );
}

