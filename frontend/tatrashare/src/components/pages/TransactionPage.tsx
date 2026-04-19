import { useState } from "react";
import MobileHeader from "../MobileHeader";
import ShareTransactions from "./ShareTransactions";
import "../../style/TransactionPage.css";
import ArrowWithText from "../ArrowWithText.tsx";

export default function TransactionPage() {
  const [isShareOpen, setIsShareOpen] = useState(false);

  const payload = {
    name: "VE POS nakup",
    description: "VE POS nakup",
    amount: 184.0,
    beneficiary_ids: [],
  };

  return (
      <div className="transactionPage">
        <MobileHeader
            left={<ArrowWithText label="Transaction detail" />}
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
            <div className="transactionSmallText">Platba kartou 4444**3333</div>
            <div className="transactionMerchant">PEPCO 120083 KOSICE</div>

            <div className="transactionAmountLabel">Amount</div>
            <div className="transactionAmountValue expense">- 1,30 EUR</div>
          </section>

          <section className="transactionUtilityBlock">
            <div className="transactionPdfWrap">
              <div className="transactionPdfIcon">PDF</div>
              <div className="transactionPdfText">Export to PDF</div>
            </div>

            <button className="transactionImpactCard" type="button">
              <div className="transactionImpactLeft">
                <div className="transactionImpactBadge">co2</div>
                <div>
                  <div className="transactionImpactValue">1,49 kg CO₂e</div>
                  <div className="transactionImpactDescription">
                    Equal to a short-distance flight of 8 kilometres.
                  </div>
                </div>
              </div>

              <div className="transactionChevron">›</div>
            </button>
          </section>

          <section className="transactionDetailsCard">
            <div className="transactionDetailRow">
              <span className="transactionDetailKey">Posting date</span>
              <span className="transactionDetailVal">18.04.2026</span>
            </div>

            <div className="transactionDetailRow">
              <span className="transactionDetailKey">Value date</span>
              <span className="transactionDetailVal">16.04.2026</span>
            </div>

            <div className="transactionDetailRow">
              <span className="transactionDetailKey">Type of transaction</span>
              <span className="transactionDetailVal">Debit</span>
            </div>

            <div className="transactionDetailRow transactionDetailRowTall">
              <span className="transactionDetailKey">Merchant</span>
              <span className="transactionDetailVal transactionDetailValRight">
              PEPCO 120083 KOSICE
              <br />
              KOSICE
            </span>
            </div>

            <div className="transactionDetailBlock">
              <div className="transactionDetailKey">Statement detail</div>
              <div className="transactionStatementText">Detail is not available.</div>
            </div>
          </section>
        </main>

        {isShareOpen && (
            <ShareTransactions
                transactionToShare={payload}
                onClose={() => setIsShareOpen(false)}
            />
        )}
      </div>
  );
}