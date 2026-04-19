import { ArrowLeft } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import MobileFooter from "../MobileFooter";
import MobileHeader from "../MobileHeader";
import "../../style/TransactionsListPage.css";
import { useEffect, useState } from "react";
import { groupApi } from "../../axios/api";
import type { GroupDto, CreateTransactionRequest } from "../../axios/api";

type ShareState = {
  transactionToShare?: CreateTransactionRequest;
};

export default function ShareTransactions() {
  const navigate = useNavigate();
  const location = useLocation();
  const [groups, setGroups] = useState<GroupDto[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const state = (location.state ?? {}) as unknown as ShareState;
  const payloadToShare: CreateTransactionRequest | null = state.transactionToShare ?? null;

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const res = await groupApi.getGroups();
        if (!mounted) return;
        setGroups(res.data);
        setError(null);
      } catch (err: unknown) {
        if (!mounted) return;
        const message = err instanceof Error ? err.message : String(err);
        setError(message || "Failed to load groups");
        setGroups([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  function onSelectGroup(id: number) {
    const selected = groups?.find(g => g.id === id) || null;
    // Navigate to the group's new transaction page. Pass the transaction payload (if any) and the selected group.
    navigate(`/groups/${id}/newtransaction`, { state: { selectedGroup: selected, transactionToShare: payloadToShare } });
  }

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

      <main className="transactionDetailContent">
        <div style={{ padding: 20 }}>
          <p>Choose the group to share this transaction with.</p>

          {loading && <div>Loading groups...</div>}
          {error && (
            <div style={{ color: 'red' }}>
              Error loading groups: {error}
              <div>
                <button onClick={() => { setError(null); setGroups(null); setLoading(false); /* trigger reload */ window.location.reload(); }} style={{ marginTop: 8 }}>Retry</button>
              </div>
            </div>
          )}

          {/* creation is handled on the group's New Transaction page */}

          {!loading && groups && groups.length === 0 && <div>No groups available.</div>}

          {!loading && groups && groups.length > 0 && (
            <div style={{ marginTop: 12 }}>
              {groups.map((g) => (
                <div key={g.id} style={{ padding: 8, borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{g.name}</div>
                    <div style={{ fontSize: 12, color: '#666' }}>{g.members_count} members • Balance: {g.user_balance}</div>
                  </div>
                  <div>
                    <button onClick={() => onSelectGroup(g.id)} style={{ padding: '6px 10px', borderRadius: 6 }}>
                      Select
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </main>

      <MobileFooter />

    </div>
  );
}
