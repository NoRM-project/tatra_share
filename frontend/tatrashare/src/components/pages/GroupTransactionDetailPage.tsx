import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, CircleQuestionMark } from "lucide-react";
import MobileHeader from "../MobileHeader";
import Button from "../Button";
import Avatar from "../Avatar";
import { transactionApi } from "../../axios/api";
import type { TransactionDto } from "../../axios/api";
import "../../style/GroupTransactionDetailPage.css";

function formatDate(iso: string): string {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

export default function GroupTransactionDetailPage() {
  const { groupId, transactionId } = useParams();
  const navigate = useNavigate();

  const [transaction, setTransaction] = useState<TransactionDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      const gId = Number(groupId);
      const tId = Number(transactionId);

      if (Number.isNaN(gId) || Number.isNaN(tId)) {
        setError("Invalid IDs");
        setLoading(false);
        return;
      }

      try {
        const res = await transactionApi.getTransaction(gId, tId);
        if (!mounted) return;
        setTransaction(res.data);
      } catch (err: unknown) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : "Failed to load transaction");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => { mounted = false; };
  }, [groupId, transactionId]);

  return (
    <div className="txDetailPage">
      <MobileHeader
        left={
          <Button
            hasBackground={false}
            icon={<ChevronLeft size={22} strokeWidth={2} />}
            onClick={() => navigate(`/groups/${groupId}`, { state: { activeTab: "transactions" } })}
          />
        }
        center={<span className="txDetailHeaderTitle">Transaction details</span>}
        right={<Button hasBackground={false} icon={<CircleQuestionMark color="#4da3ff" />} />}
      />

      {loading && <div className="txDetailState">Loading…</div>}
      {error   && <div className="txDetailError">{error}</div>}

      {!loading && !error && transaction && (
        <main className="txDetailContent">

          {/* ── key-value rows ── */}
          <section className="txDetailCard">
            <div className="txDetailRow">
              <span className="txDetailLabel">Payment name</span>
              <span className="txDetailValue">{transaction.name}</span>
            </div>

            <div className="txDetailDivider" />

            <div className="txDetailRow">
              <span className="txDetailLabel">Amount</span>
              <span className="txDetailValue">{transaction.amount.toFixed(2)} EUR</span>
            </div>

            <div className="txDetailDivider" />

            <div className="txDetailRow">
              <span className="txDetailLabel">Posting date</span>
              <span className="txDetailValue">{formatDate(transaction.created_at)}</span>
            </div>

            {transaction.description && (
              <>
                <div className="txDetailDivider" />
                <div className="txDetailBlock">
                  <span className="txDetailLabel">Description</span>
                  <p className="txDetailDescription">{transaction.description}</p>
                </div>
              </>
            )}
          </section>

          {/* ── paid by ── */}
          <p className="txDetailSectionLabel">PAID BY</p>

          <div className="txDetailMemberCard">
            <Avatar name={transaction.paid_by.full_name} />
            <div className="txDetailMemberInfo">
              <div className="txDetailMemberName">{transaction.paid_by.full_name}</div>
              <div className="txDetailMemberIban">{transaction.paid_by.iban}</div>
            </div>
          </div>

          {/* ── paid for ── */}
          <div className="txDetailSectionRow">
            <p className="txDetailSectionLabel">
              PAID FOR({transaction.beneficiaries.length})
            </p>
            <button
              type="button"
              className="txDetailEditBtn"
              onClick={() => navigate(`/groups/${groupId}/transactions/${transactionId}/edit`)}
            >
              Edit
            </button>
          </div>

          <div className="txDetailMemberList">
            {transaction.beneficiaries.map((b) => (
              <div key={b.id} className="txDetailMemberCard">
                <Avatar name={b.full_name} />
                <div className="txDetailMemberInfo">
                  <div className="txDetailMemberName">{b.full_name}</div>
                  <div className="txDetailMemberIban">{b.iban}</div>
                </div>
                <span className="txDetailSplitAmount">
                  {(transaction.amount / transaction.beneficiaries.length).toFixed(2)} EUR
                </span>
              </div>
            ))}
          </div>

        </main>
      )}
    </div>
  );
}
