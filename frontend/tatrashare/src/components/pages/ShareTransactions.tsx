import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { groupApi } from "../../axios/api";
import type { GroupDto, CreateTransactionRequest } from "../../axios/api";
import "../../style/ShareTransactions.css";

type Props = {
  transactionToShare: CreateTransactionRequest;
  onClose: () => void;
};

export default function ShareTransactions({
                                            transactionToShare,
                                            onClose,
                                          }: Props) {
  const navigate = useNavigate();

  const [groups, setGroups] = useState<GroupDto[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    const selected = groups?.find((g) => g.id === id) || null;

    onClose();

    navigate(`/groups/${id}/newtransaction`, {
      state: {
        selectedGroup: selected,
        transactionToShare,
      },
    });
  }

  return (
      <div className="shareOverlay" onClick={onClose}>
        <div className="shareSheet" onClick={(e) => e.stopPropagation()}>
          <div className="shareHandle" />

          <div className="shareHeader">
            <h3>Select group</h3>
          </div>

          <div className="shareContent">
            {loading && <div className="shareState">Loading groups...</div>}
            {error && <div className="shareState shareError">{error}</div>}

            {!loading && groups && groups.length === 0 && (
                <div className="shareState">No groups available.</div>
            )}

            {!loading && groups && groups.length > 0 && (
                <div className="shareGroupList">
                  {groups.map((g) => (
                      <button
                          key={g.id}
                          className="shareGroupRow"
                          type="button"
                          onClick={() => onSelectGroup(g.id)}
                      >
                        <span className="shareGroupName">{g.name}</span>
                        <span className="shareGroupMeta">Members({g.members_count})</span>
                      </button>
                  ))}
                </div>
            )}
          </div>
        </div>
      </div>
  );
}