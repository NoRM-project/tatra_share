import { useMemo, useState } from "react";
import { CircleQuestionMark, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MobileHeader from "../MobileHeader";
import Button from "../Button";
import MemberContainer from "../MemberContainer";
import "../../style/GroupTransactionCreatePage.css";
import "../../style/AddNewGroupScreen.css";

type TabKey = "create";

type MemberItem = {
  id: string;
  fullName: string;
  iban: string;
};

const initialMembers: MemberItem[] = [
  {
    id: "1",
    fullName: "Janko Hraska",
    iban: "SK88 8888 8888 8888 8888 8888",
  },
  {
    id: "2",
    fullName: "Jon Doe",
    iban: "SK88 8888 8888 8888 8888 8888",
  },
  {
    id: "3",
    fullName: "Lala Lulu",
    iban: "SK88 8888 8888 8888 8888 8888",
  },
  {
    id: "4",
    fullName: "Miro Placeholder",
    iban: "SK88 8888 8888 8888 8888 8888",
  },
];

export default function AddNewGroupScreen() {
  const navigate = useNavigate();

  const [activeTab] = useState<TabKey>("create");

  const [groupName, setGroupName] = useState("");
  const [memberIban, setMemberIban] = useState("");
  const [memberName, setMemberName] = useState("");
  const [members, setMembers] = useState<MemberItem[]>(initialMembers);

  const canAddMember = useMemo(() => {
    return memberIban.trim().length > 0 && memberName.trim().length > 0;
  }, [memberIban, memberName]);

  function handleJoinExists() {
    // TODO: implement join-existing screen when backend flow is ready
    navigate("/groups/join");
  }

  function handleAddMember() {
    if (!canAddMember) return;

    setMembers((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        fullName: memberName.trim(),
        iban: memberIban.trim(),
      },
    ]);

    setMemberIban("");
    setMemberName("");
  }

  function handleCreateGroup() {
    // TODO: wire create-group API call
    // Keeping this stub so the screen can be connected later without refactor.
    void groupName;
  }

  return (
    <div className="addGroupPage">
      <MobileHeader
        left={
          <Button
            hasBackground={false}
            icon={<ChevronLeft size={22} strokeWidth={2} />}
            onClick={() => navigate(-1)}
          />
        }
        center={<span className="addGroupHeaderTitle">Add new group</span>}
        right={<Button hasBackground={false} icon={<CircleQuestionMark color="#4da3ff" />} />}
      />

      <div className="addGroupTabs">
        <button
          type="button"
          className={`addGroupTab ${activeTab === "create" ? "isActive" : ""}`}
        >
          Create new
        </button>

        <button type="button" className="addGroupTab" onClick={handleJoinExists}>
          Join exist
        </button>
      </div>

      <main className="addGroupContent">
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

        <section className="transactionSection">
          <div className="addGroupSectionHeader">
            <h3 className="transactionSectionTitle">Member details</h3>
            <button type="button" className="addGroupInlineAction">
              Scan IBAN/QR code
            </button>
          </div>

          <div className="transactionForm">
            <input
              className="transactionInput"
              type="text"
              placeholder="IBAN/Foreign account number"
              value={memberIban}
              onChange={(e) => setMemberIban(e.target.value)}
            />

            <input
              className="transactionInput"
              type="text"
              placeholder="Member name"
              value={memberName}
              onChange={(e) => setMemberName(e.target.value)}
            />

            <div className="addGroupCenteredAction">
              <Button
                hasBackground={false}
                text="Add member"
                onClick={handleAddMember}
                disabled={!canAddMember}
              />
            </div>
          </div>
        </section>

        <section className="addGroupMembersSection">
          <h3 className="addGroupMembersTitle">MEMBERS({members.length})</h3>

          <div className="addGroupMembersList">
            {members.map((m) => (
              <MemberContainer key={m.id} fullName={m.fullName} iban={m.iban} isReport={false} />
            ))}
          </div>
        </section>
      </main>

      <div className="addGroupBottomBar">
        <Button text="Create group" className="buttonFullWidth" onClick={handleCreateGroup} />
      </div>
    </div>
  );
}

