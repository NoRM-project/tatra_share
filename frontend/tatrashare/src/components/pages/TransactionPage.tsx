import { Link } from "react-router-dom";
import Button from "../Button";
import MobileFooter from "../MobileFooter";
import MobileHeader from "../MobileHeader";
import "../../style/TransactionsListPage.css";
import BackIcon from "../../assets/icons/BackIcon";

export default function TransactionPage() {
  return (
    <div className="transactionsPage">
      <MobileHeader
        left={
          <Link to="/transactionslist" className="headerIconButton" aria-label="Back to transactions">
            <BackIcon />
          </Link>
        }
        center={<span className="transactionsHeaderTitle">Detail pohybu</span>}
      />

      <main className="transactionDetailContent">
        <div className="transactionDetailCard">
          <p className="transactionDetailLabel">Suma</p>
          <p className="transactionAmount expense">184,00 EUR</p>

          <p className="transactionDetailLabel">Prijemca</p>
          <p className="transactionDetailValue">ZELEZIARSTVO</p>

          <p className="transactionDetailLabel">Typ</p>
          <p className="transactionDetailValue">VE POS nakup</p>

          <p className="transactionDetailLabel">Datum</p>
          <p className="transactionDetailValue">16. maja 2025</p>

          <Link to="/sharetransaction" className="shareTransactionButtonWrap">
            <Button text="share transaction" />
          </Link>
        </div>
      </main>

      <MobileFooter />
    </div>
  );
}