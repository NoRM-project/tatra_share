import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, CircleQuestionMark } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MobileHeader from "../MobileHeader";
import Button from "../Button";
import Avatar from "../Avatar";
import { groupApi, userApi } from "../../axios/api";
import type { User } from "../../axios/api";
import "../../style/GroupTransactionCreatePage.css";
import "../../style/AddNewGroupScreen.css";

export default function AddNewGroupScreen() {
  const navigate = useNavigate();

  // ── data ──────────────────────────────────────────────────────────────────
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // ── group form ─────────────────────────────────────────────────────────────
  const [groupName, setGroupName] = useState("");

  // ── friends selection ─────────────────────────────────────────────────────
  const [friendSearch, setFriendSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  // ── manual add by name + IBAN ─────────────────────────────────────────────
  const [manualName, setManualName] = useState("");
  const [manualIban, setManualIban] = useState("");
  const [manualError, setManualError] = useState<string | null>(null);
  const [manualSuccess, setManualSuccess] = useState<string | null>(null);

  // ── submit ─────────────────────────────────────────────────────────────────
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // ── load users (simulated friends list) ───────────────────────────────────
  useEffect(() => {
    let mounted = true;

    async function loadUsers() {
      try {
        const res = await userApi.getAllUsers();
        if (!mounted) return;
        setAllUsers(res.data);
      } catch (err: unknown) {
        if (!mounted) return;
        const msg = err instanceof Error ? err.message : String(err);
        setLoadError(msg || "Failed to load users");
      } finally {
        if (mounted) setLoadingUsers(false);
      }
    }

    loadUsers();
    return () => { mounted = false; };
  }, []);

  // ── filtered friends (search) ─────────────────────────────────────────────
  const filteredUsers = useMemo(() => {
    const q = friendSearch.trim().toLowerCase();
    if (!q) return allUsers;
    return allUsers.filter(
      (u) =>
        u.full_name.toLowerCase().includes(q) ||
        u.iban.toLowerCase().includes(q)
    );
  }, [allUsers, friendSearch]);

  function toggleUser(id: number) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  // ── manual add ────────────────────────────────────────────────────────────
  const canManualAdd = manualName.trim().length > 0 && manualIban.trim().length > 0;

  function handleManualAdd() {
    if (!canManualAdd) return;

    setManualError(null);
    setManualSuccess(null);

    const name = manualName.trim();
    const iban = manualIban.trim();

    const match = allUsers.find(
      (u) =>
        u.full_name.toLowerCase() === name.toLowerCase() &&
        u.iban.replace(/\s+/g, "").toLowerCase() ===
          iban.replace(/\s+/g, "").toLowerCase()
    );

    if (!match) {
      setManualError("User not found. Make sure the name and IBAN match exactly.");
      return;
    }

    if (selectedIds.has(match.id)) {
      setManualError("This user is already added.");
      return;
    }

    setSelectedIds((prev) => new Set([...prev, match.id]));
    setManualSuccess(`${match.full_name} added successfully.`);
    setManualName("");
    setManualIban("");
  }

  // ── selected users list (for summary) ────────────────────────────────────
  const selectedUsers = useMemo(
    () => allUsers.filter((u) => selectedIds.has(u.id)),
    [allUsers, selectedIds]
  );

  const canCreate = groupName.trim().length > 0 && selectedIds.size > 0;

  // ── create group ──────────────────────────────────────────────────────────
  async function handleCreateGroup() {
    if (!canCreate) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      await groupApi.createGroup({
        name: groupName.trim(),
        member_ids: [...selectedIds],
      });
      navigate("/groups");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setSubmitError(msg || "Failed to create group");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="addGroupPage">
      <MobileHeader
        left={
          <Button
            hasBackground={false}
            icon={<ChevronLeft size={22} strokeWidth={2} />}
            onClick={() => navigate("/groups")}
          />
        }
        center={<span className="addGroupHeaderTitle">Add new group</span>}
        right={
          <Button
            hasBackground={false}
            icon={<CircleQuestionMark color="#4da3ff" />}
          />
        }
      />

      <main className="addGroupContent">
        {/* ── submit error ── */}
        {submitError && (
          <div className="groupTransactionError">{submitError}</div>
        )}

        {/* ── group name ── */}
        <section className="transactionSection">
          <h3 className="transactionSectionTitle">Group details</h3>
          <div className="transactionForm">
            <input
              className="transactionInput"
              type="text"
              placeholder="Group name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </div>
        </section>

        {/* ── friends selection ── */}
        <section className="transactionSection">
          <h3 className="transactionSectionTitle">
            ADD MEMBERS ({selectedIds.size} selected)
          </h3>

          <div className="transactionForm">
            <input
              className="transactionInput"
              type="text"
              placeholder="Search by name or IBAN…"
              value={friendSearch}
              onChange={(e) => setFriendSearch(e.target.value)}
            />
          </div>

          <div className="addGroupFriendsListWrap">
            {loadingUsers && (
              <p className="addGroupStateText">Loading users…</p>
            )}

            {loadError && (
              <p className="addGroupErrorText">{loadError}</p>
            )}

            {!loadingUsers && !loadError && filteredUsers.length === 0 && (
              <p className="addGroupStateText">No users found.</p>
            )}

            {!loadingUsers && !loadError && (
              <div className="beneficiariesList">
                {filteredUsers.map((user) => {
                  const checked = selectedIds.has(user.id);
                  return (
                    <label
                      key={user.id}
                      className={`beneficiaryCard ${checked ? "isSelected" : ""}`}
                    >
                      <div className="beneficiaryLeft">
                        <Avatar name={user.full_name} />
                        <div className="beneficiaryInfo">
                          <div className="beneficiaryName">{user.full_name}</div>
                          <div className="beneficiaryIban">{user.iban}</div>
                        </div>
                      </div>

                      <input
                        className="beneficiaryCheckbox"
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleUser(user.id)}
                      />
                      <span className="beneficiaryFakeCheckbox" />
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* ── manual add by name + IBAN ── */}
        <section className="transactionSection">
          <h3 className="transactionSectionTitle">Add by name &amp; IBAN</h3>
          <p className="addGroupSectionNote">
            Enter the exact full name and IBAN of an existing user to add them.
          </p>

          <div className="transactionForm">
            <input
              className="transactionInput"
              type="text"
              placeholder="Full name"
              value={manualName}
              onChange={(e) => {
                setManualName(e.target.value);
                setManualError(null);
                setManualSuccess(null);
              }}
            />

            <input
              className="transactionInput"
              type="text"
              placeholder="IBAN (e.g. SK88 8888 8888 8888 8888 8888)"
              value={manualIban}
              onChange={(e) => {
                setManualIban(e.target.value);
                setManualError(null);
                setManualSuccess(null);
              }}
            />

            {manualError && (
              <p className="addGroupErrorText">{manualError}</p>
            )}
            {manualSuccess && (
              <p className="addGroupSuccessText">{manualSuccess}</p>
            )}

            <div className="addGroupCenteredAction">
              <Button
                hasBackground={false}
                text="Add member"
                onClick={handleManualAdd}
                disabled={!canManualAdd}
              />
            </div>
          </div>
        </section>

        {/* ── selected summary ── */}
        {selectedUsers.length > 0 && (
          <section className="addGroupMembersSection">
            <h3 className="addGroupMembersTitle">
              MEMBERS ({selectedUsers.length})
            </h3>

            <div className="addGroupMembersList">
              {selectedUsers.map((u) => (
                <div key={u.id} className="addGroupSelectedMember">
                  <div className="beneficiaryLeft">
                    <Avatar name={u.full_name} />
                    <div className="beneficiaryInfo">
                      <div className="beneficiaryName">{u.full_name}</div>
                      <div className="beneficiaryIban">{u.iban}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="addGroupRemoveBtn"
                    onClick={() => toggleUser(u.id)}
                    aria-label={`Remove ${u.full_name}`}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <div className="addGroupBottomBar">
        <button
          className="transactionSubmitButton"
          onClick={handleCreateGroup}
          disabled={!canCreate || submitting}
        >
          {submitting ? "Creating…" : "Create group"}
        </button>
      </div>
    </div>
  );
}
