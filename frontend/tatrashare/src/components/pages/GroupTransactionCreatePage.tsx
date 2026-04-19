import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import MobileHeader from "../MobileHeader";
import { groupApi, groupMemberApi, transactionApi } from "../../axios/api";
import type {
  GroupDto,
  TransactionUserDto,
  CreateTransactionRequest,
} from "../../axios/api";
import ArrowWithText from "../ArrowWithText";
import Avatar from "../Avatar";
import "../../style/GroupTransactionCreatePage.css";

type LocationState = {
  selectedGroup?: GroupDto;
  transactionToShare?: CreateTransactionRequest;
};

export default function GroupTransactionCreatePage() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const state = (location.state ?? {}) as LocationState;
  const selectedGroupFromState = state.selectedGroup;
  const parsedGroupId = Number(groupId);

  const [group, setGroup] = useState<GroupDto | null>(selectedGroupFromState ?? null);
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
            groupsRes.data.find((g) => g.id === parsedGroupId) ??
            selectedGroupFromState ??
            null;

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
      // Defer to avoid synchronous state update directly inside effect body.
      window.setTimeout(() => {
        if (!mounted) return;
        setError("Invalid group id");
        setLoading(false);
      }, 0);
    }

    return () => {
      mounted = false;
    };
  }, [parsedGroupId, selectedGroupFromState]);

  function toggleBeneficiary(userId: number) {
    setSelectedBeneficiaryIds((prev) =>
        prev.includes(userId)
            ? prev.filter((id) => id !== userId)
            : [...prev, userId]
    );
  }

  function handleAmountChange(value: string) {
    // Allow only digits with optional decimal dot and max one fraction digit.
    if (/^\d*(\.\d{0,1})?$/.test(value)) {
      setAmount(value);
    }
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
      <div className="groupTransactionPage">
        <MobileHeader left={<ArrowWithText label="Tatrashare payment" />} />

        <main className="groupTransactionContent">
          {loading && <div className="groupTransactionState">Loading...</div>}
          {error && <div className="groupTransactionError">{error}</div>}

          {!loading && !error && (
              <>
                <section className="transactionSection">
                  <h3 className="transactionSectionTitle">Payment details</h3>

                  <div className="transactionForm">
                    <input
                        className="transactionInput"
                        type="text"
                        placeholder="Payment name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <div className="transactionAmountRow">
                      <input
                          className="transactionInput transactionAmountInput"
                          type="text"
                          inputMode="decimal"
                          placeholder="Amount"
                          value={amount}
                          onChange={(e) => handleAmountChange(e.target.value)}
                      />

                      <div className="transactionCurrencyBox">EUR</div>
                    </div>

                    <textarea
                        className="transactionTextarea"
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                    />
                  </div>
                </section>

                <section className="transactionSection">
                  <h3 className="transactionSectionTitle">
                    PAYING FOR ({members.length})
                  </h3>

                  <div className="beneficiariesList">
                    {members.map((member) => {
                      const checked = selectedBeneficiaryIds.includes(member.id);

                      return (
                          <label
                              key={member.id}
                              className={`beneficiaryCard ${checked ? "isSelected" : ""}`}
                          >
                            <div className="beneficiaryLeft">
                              <Avatar name={member.full_name} />
                              <div className="beneficiaryInfo">
                                <div className="beneficiaryName">{member.full_name}</div>
                                <div className="beneficiaryIban">{member.iban}</div>
                              </div>
                            </div>

                            <input
                                className="beneficiaryCheckbox"
                                type="checkbox"
                                checked={checked}
                                onChange={() => toggleBeneficiary(member.id)}
                            />

                            <span className="beneficiaryFakeCheckbox" />
                          </label>
                      );
                    })}
                  </div>
                </section>

                <div className="transactionGroupInfo">
                  Selected group: <span>{group?.name ?? "Unknown"}</span>
                </div>
              </>
          )}
        </main>

        <div className="transactionBottomBar">
          <button
              className="transactionSubmitButton"
              onClick={handleSubmit}
              disabled={!canSubmit || submitting}
          >
            {submitting ? "Creating..." : "Create transaction"}
          </button>
        </div>

      </div>
  );
}