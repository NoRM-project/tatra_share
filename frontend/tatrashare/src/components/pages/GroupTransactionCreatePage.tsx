import { ArrowLeft } from "lucide-react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import MobileHeader from "../MobileHeader";
import MobileFooter from "../MobileFooter";
import { groupApi, groupMemberApi, transactionApi } from "../../axios/api";
import type {
  GroupDto,
  TransactionUserDto,
  CreateTransactionRequest,
} from "../../axios/api";
import ArrowWithText from "../ArrowWithText";
import Avatar from "../Avatar";

type LocationState = {
  selectedGroup?: GroupDto;
  transactionToShare?: CreateTransactionRequest;
};

export default function GroupTransactionCreatePage() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const state = (location.state ?? {}) as LocationState;

  const parsedGroupId = Number(groupId);

  const [group, setGroup] = useState<GroupDto | null>(state.selectedGroup ?? null);
  const [members, setMembers] = useState<TransactionUserDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState(state.transactionToShare?.name ?? "");
  const [amount, setAmount] = useState(
      state.transactionToShare?.amount ? String(state.transactionToShare.amount) : ""
  );
  const [description, setDescription] = useState(
      state.transactionToShare?.description ?? ""
  );
  const [selectedBeneficiaryIds, setSelectedBeneficiaryIds] = useState<number[]>(
      state.transactionToShare?.beneficiary_ids ?? []
  );

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const [groupsRes, membersRes] = await Promise.all([
          groupApi.getGroups(),
          groupMemberApi.getMembers(parsedGroupId),
        ]);

        if (!mounted) return;

        const foundGroup =
            groupsRes.data.find((g) => g.id === parsedGroupId) ?? state.selectedGroup ?? null;

        setGroup(foundGroup);
        setMembers(membersRes.data);
      } catch (err: unknown) {
        if (!mounted) return;
        const message = err instanceof Error ? err.message : String(err);
        setError(message || "Failed to load page data");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    if (!Number.isNaN(parsedGroupId)) {
      load();
    } else {
      setError("Invalid group id");
      setLoading(false);
    }

    return () => {
      mounted = false;
    };
  }, [parsedGroupId]);

  function toggleBeneficiary(userId: number) {
    setSelectedBeneficiaryIds((prev) =>
        prev.includes(userId)
            ? prev.filter((id) => id !== userId)
            : [...prev, userId]
    );
  }

  const canSubmit = useMemo(() => {
    return (
        name.trim().length > 0 &&
        amount.trim().length > 0 &&
        !Number.isNaN(Number(amount)) &&
        Number(amount) > 0 &&
        selectedBeneficiaryIds.length > 0
    );
  }, [name, amount, selectedBeneficiaryIds]);

  async function handleSubmit() {
    if (!canSubmit) return;

    setSubmitting(true);
    setError(null);

    try {
      const payload: CreateTransactionRequest = {
        name: name.trim(),
        description: description.trim(),
        amount: Number(amount),
        beneficiary_ids: selectedBeneficiaryIds,
      };

      await transactionApi.createTransaction(parsedGroupId, payload);

      navigate(`/groups/${parsedGroupId}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message || "Failed to create transaction");
    } finally {
      setSubmitting(false);
    }
  }

  return (
      <div className="transactionsPage">
        <MobileHeader left={<ArrowWithText label="Tatrashare payment"/>}/>

        <main style={{ padding: 12, display: "flex", flexDirection: "column", gap: 16 }}>
          {loading && <div>Loading...</div>}
          {error && <div style={{ color: "red" }}>{error}</div>}

          {!loading && !error && (
              <>
                <section
                    style={{
                      border: "1px solid #ccc",
                      borderRadius: 8,
                      padding: 12,
                    }}
                >
                  <h3 style={{ marginTop: 0 }}>Payment info</h3>

                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <div style={{ display: "flex", gap: 8 }}>
                      <input
                          type="number"
                          placeholder="Amount"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          style={{ flex: 1 }}
                      />
                      <input value="EURO" disabled style={{ width: 80 }} />
                    </div>

                    <textarea
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                    />
                  </div>
                </section>

                <section
                    style={{
                      border: "1px solid #ccc",
                      borderRadius: 8,
                      padding: 12,
                    }}
                >
                  <h3 style={{ marginTop: 0 }}>Beneficiaries</h3>

                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {members.map((member) => {
                      const checked = selectedBeneficiaryIds.includes(member.id);

                      return (
                          <label
                              key={member.id}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                border: "1px solid #ddd",
                                borderRadius: 8,
                                padding: 10,
                                cursor: "pointer",
                              }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <Avatar name={member.full_name}/>
                              <div>
                                <div style={{ fontWeight: 600 }}>{member.full_name}</div>
                                <div style={{ fontSize: 12, color: "#666" }}>{member.iban}</div>
                              </div>
                            </div>

                            <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => toggleBeneficiary(member.id)}
                            />
                          </label>
                      );
                    })}
                  </div>
                </section>

                <section>
                  <div style={{ marginBottom: 8 }}>
                    <strong>Selected group:</strong> {group?.name ?? "Unknown"}
                  </div>

                  <button
                      onClick={handleSubmit}
                      disabled={!canSubmit || submitting}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        borderRadius: 8,
                      }}
                  >
                    {submitting ? "Creating..." : "Create transaction"}
                  </button>
                </section>
              </>
          )}
        </main>

        <MobileFooter />
      </div>
  );
}