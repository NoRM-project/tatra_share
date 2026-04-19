import { useState } from "react";
import { useLocation } from "react-router-dom";
import MobileHeader from "../MobileHeader";
import ShareTransactions from "./ShareTransactions";
import "../../style/TransactionPage.css";
import ArrowWithText from "../ArrowWithText.tsx";
import type { TransactionItem } from "./TransactionsListPage";

export default function TransactionPage() {
  const location = useLocation();
  const tx = (location.state as { transaction?: TransactionItem } | null)?.transaction;

  const [isShareOpen, setIsShareOpen] = useState(false);

  const sharePayload = {
    name: tx?.description ?? "Transaction",
    description: tx?.statementDetail ?? "",
    amount: tx ? parseFloat(tx.amount.replace(",", ".")) : 0,
    beneficiary_ids: [],
  };

  return (
      <div className="transactionPage">
        <MobileHeader
            left={<ArrowWithText label="Transaction detail" to="/transactionslist" />}
            right={
              <button
                  className="transactionSplitButton"
                  type="button"
                  onClick={() => setIsShareOpen(true)}
              >
                Split
              </button>
            }
        />

        <main className="transactionPageContent">
          <section className="transactionSummaryCard">
            {tx?.cardNumber && (
              <div className="transactionSmallText">Platba kartou {tx.cardNumber}</div>
            )}
            <div className="transactionMerchant">{tx?.merchant ?? "—"}</div>

            <div className="transactionAmountLabel">Amount</div>
            <div className={`transactionAmountValue ${tx?.isIncome ? "" : "expense"}`}>
              {tx?.isIncome ? "+ " : "- "}{tx?.amount ?? "0,00"} EUR
            </div>
          </section>

          <section className="transactionUtilityBlock">
            <div className="transactionPdfWrap">
              <div className="transactionPdfIcon">PDF</div>
              <div className="transactionPdfText">Export to PDF</div>
            </div>

            {tx?.co2 && (
              <button className="transactionImpactCard" type="button">
                <div className="transactionImpactLeft">
                  <div className="transactionImpactBadge">co2</div>
                  <div>
                    <div className="transactionImpactValue">{tx.co2}</div>
                    <div className="transactionImpactDescription">
                      Estimated carbon footprint of this transaction.
                    </div>
                  </div>
                </div>
                <div className="transactionChevron">›</div>
              </button>
            )}
          </section>

          <section className="transactionDetailsCard">
            <div className="transactionDetailRow">
              <span className="transactionDetailKey">Posting date</span>
              <span className="transactionDetailVal">{tx?.postingDate ?? "—"}</span>
            </div>

            <div className="transactionDetailRow">
              <span className="transactionDetailKey">Value date</span>
              <span className="transactionDetailVal">{tx?.valueDate ?? "—"}</span>
            </div>

            <div className="transactionDetailRow">
              <span className="transactionDetailKey">Type of transaction</span>
              <span className="transactionDetailVal">{tx?.transactionType ?? "—"}</span>
            </div>

            <div className="transactionDetailRow transactionDetailRowTall">
              <span className="transactionDetailKey">Merchant</span>
              <span className="transactionDetailVal transactionDetailValRight">
                {tx?.merchant ?? "—"}
                {tx?.merchantCity && tx.merchantCity !== "—" && (
                  <><br />{tx.merchantCity}</>
                )}
              </span>
            </div>

            <div className="transactionDetailBlock">
              <div className="transactionDetailKey">Statement detail</div>
              <div className="transactionStatementText">
                {tx?.statementDetail ?? "Detail is not available."}
              </div>
            </div>
          </section>
        </main>

        {isShareOpen && (
            <ShareTransactions
                transactionToShare={sharePayload}
                onClose={() => setIsShareOpen(false)}
            />
        )}
      </div>
  );
}