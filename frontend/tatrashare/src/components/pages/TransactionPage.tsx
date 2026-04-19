import { Link } from "react-router-dom";
import Button from "../Button";
import MobileHeader from "../MobileHeader";
import ArrowWithText from "../ArrowWithText";
import ComponentsBlock from "../ComponentsBlock";

export default function TransactionPage() {
  const payload = {
    name: "VE POS nakup",
    description: "VE POS nakup",
    amount: 184.0,
    beneficiary_ids: [],
  };

  return (
    <div className="transactionsPage">
      <MobileHeader left={<ArrowWithText label="Detail pohybu" />} />

      <main>
        <ComponentsBlock>
          <div className="transactionDetailCard">
            <div className="transactionRow">
              <p className="transactionDetailLabel">Suma</p>
              <p className="transactionAmount expense">184,00 EUR</p>
            </div>

            <div className="transactionRow">
              <p className="transactionDetailLabel">Prijemca</p>
              <p className="transactionDetailValue">ZELEZIARSTVO</p>
            </div>

            <div className="transactionRow">
              <p className="transactionDetailLabel">Typ</p>
              <p className="transactionDetailValue">VE POS nakup</p>
            </div>

            <div className="transactionRow">
              <p className="transactionDetailLabel">Dátum</p>
              <p className="transactionDetailValue">16. mája 2025</p>
            </div>

            <Link
              to="/sharetransaction"
              state={{ transactionToShare: payload }}
              className="shareTransactionButtonWrap"
            >
              <Button text="Share transaction" />
            </Link>
          </div>
        </ComponentsBlock>
      </main>
    </div>
  );
}