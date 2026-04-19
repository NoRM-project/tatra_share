import { useEffect, useMemo, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import MobileHeader from "../MobileHeader";
import ArrowWithText from "../ArrowWithText";
import Button from "../Button";
import { QrCode } from "lucide-react";
import { reportApi, groupApi, transactionApi, groupMemberApi } from "../../axios/api";
import type { GroupDto, GroupReportDto, TransactionDto, TransactionUserDto } from "../../axios/api";
import Tabs from "../Tabs";
import MemberContainer from "../MemberContainer";
import SecondaryTitle from "../SecondaryTitle";
import { groupTransactionsByDate } from "../../utils";
import "../../style/GroupDetailedPage.css"
import SendIcon from "../../assets/icons/SendIcon";

export default function GroupDetailedPage() {
    const { groupId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    type GroupDetailedLocationState = {
        selectedGroup?: GroupDto;
        openTransactionAfterSelect?: boolean;
        activeTab?: "report" | "members" | "transactions";
    };

    const locationState = useMemo(() => {
        return (location.state ?? {}) as GroupDetailedLocationState;
    }, [location.state]);

    const preselected: GroupDto | null = locationState.selectedGroup ?? null;
    const openTransactionAfterSelect = !!locationState.openTransactionAfterSelect;
    const [group, setGroup] = useState<GroupDto | null>(preselected);
    const [members, setMembers] = useState<TransactionUserDto[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<"report" | "members" | "transactions">(
        locationState.activeTab ?? "report"
    );
    const [report, setReport] = useState<GroupReportDto | null>(null);
    const [transactions, setTransactions] = useState<TransactionDto[] | null>(null);

    useEffect(() => {
        let mounted = true;
        async function load() {
            setLoading(true);
            try {
                const id = Number(groupId);
                if (preselected && preselected.id === id) {
                    setGroup(preselected);
                    try {
                        const membersRes = await groupMemberApi.getMembers(id);
                        if (!mounted) return;
                        setMembers(membersRes.data);
                    } catch {
                        setMembers([]);
                    }
                } else {
                    const groupsRes = await groupApi.getGroups();
                    if (!mounted) return;
                    const found = groupsRes.data.find(g => g.id === id) || null;
                    setGroup(found);
                    if (found) {
                        try {
                            const membersRes = await groupMemberApi.getMembers(id);
                            if (!mounted) return;
                            setMembers(membersRes.data);
                        } catch {
                            setMembers([]);
                        }
                    }
                }
                try {
                    const reportRes = await reportApi.getReport(id);
                    if (!mounted) return;
                        setReport(reportRes.data);
                } catch {
                    setReport(null);
                }

                try {
                    const txRes = await transactionApi.getTransactions(id);
                    if (!mounted) return;
                    setTransactions(txRes.data);
                } catch {
                    setTransactions([]);
                }
                setError(null);
            } catch (e: unknown) {
                const message = e instanceof Error ? e.message : String(e);
                setError(message || 'Failed to load group');
            } finally {
                if (mounted) setLoading(false);
            }
        }
        load();
        return () => { mounted = false };
    }, [groupId, preselected]);

    useEffect(() => {
        if (openTransactionAfterSelect && group) {
            navigate('/transactiondetail');
        }
    }, [openTransactionAfterSelect, group, navigate]);

    return <>
        <MobileHeader
            left={<ArrowWithText label={loading ? 'Loading...' : (group ? group.name : 'Group not found')} />}
            right={<Button hasBackground={false} icon={<QrCode/>} />}
        />

        {error && (
            <div style={{ padding: 16, color: "#ff7f7f", textAlign: "left" }}>
                {error}
            </div>
        )}

        <Tabs active={activeTab} setActive={setActiveTab} />


    {activeTab === "report" && (
    <div className="tabContent">
        {!report && <div>Loading report...</div>}

        {report && (() => {
            const debts    = report.balances.filter(b => b.amount < 0);
            const owed     = report.balances.filter(b => b.amount > 0);
            const settled  = report.balances.filter(b => b.amount === 0);

            const diffClass =
                report.difference < 0 ? "sharingReportDiffNegative" :
                report.difference > 0 ? "sharingReportDiffPositive" :
                "sharingReportDiffNeutral";

            return (
                <>
                    {/* ── summary card ── */}
                    <div className="sharingReportCard">
                        <div className="sharingReportHeader">
                            <span className="sharingReportTitle">Sharing report</span>
                            <button type="button" className="sharingReportDetails">Details</button>
                        </div>

                        <div className="sharingReportDiffLabel">Difference</div>
                        <div className={`sharingReportDiffValue ${diffClass}`}>
                            {report.difference > 0 ? "+" : ""}{report.difference.toFixed(2)} EUR
                        </div>

                        <div className="sharingReportRow">
                            <div className="sharingReportCol">
                                <span className="sharingReportColLabel">Debt</span>
                                <span className="sharingReportColValueNeg">
                                    {report.liability.toFixed(2)} EUR
                                </span>
                            </div>
                            <div className="sharingReportDivider" />
                            <div className="sharingReportCol">
                                <span className="sharingReportColLabel">Receivable</span>
                                <span className="sharingReportColValuePos">
                                    {report.receivable.toFixed(2)} EUR
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* ── my debts ── */}
                    {debts.length > 0 && (
                        <>
                            <p className="reportSectionLabel">MY DEBTS({debts.length})</p>
                            {debts.map(b => (
                                <MemberContainer
                                    key={b.member.id}
                                    fullName={b.member.full_name}
                                    isReport
                                    amount={b.amount}
                                />
                            ))}
                        </>
                    )}

                    {/* ── owed to me ── */}
                    {owed.length > 0 && (
                        <>
                            <p className="reportSectionLabel">OWED TO ME({owed.length})</p>
                            {owed.map(b => (
                                <MemberContainer
                                    key={b.member.id}
                                    fullName={b.member.full_name}
                                    isReport
                                    amount={b.amount}
                                />
                            ))}
                        </>
                    )}

                    {/* ── settled ── */}
                    {settled.length > 0 && (
                        <>
                            <p className="reportSectionLabel">SETTLED({settled.length})</p>
                            {settled.map(b => (
                                <MemberContainer
                                    key={b.member.id}
                                    fullName={b.member.full_name}
                                    isReport
                                    amount={b.amount}
                                />
                            ))}
                        </>
                    )}
                </>
            );
        })()}
    </div>
    )}
    {activeTab === "members" && (
    <div className="tabContent">
        {members === null && <div>Loading members...</div>}
        {members && members.length === 0 && <div>No members</div>}

        <SecondaryTitle label="Items" button={<Button hasBackground={false} text="Share link"/>}/>
        {members && members.map((m) => (
        <MemberContainer
            key={m.id}
            fullName={m.full_name}
            iban={m.iban}
            isReport={false}
        />
        ))}
    </div>
    )}
    {activeTab === "transactions" && (
  <div className="tabContent">
    {transactions === null && <div>Loading transactions...</div>}
    {transactions && transactions.length === 0 && <div>No transactions</div>}

    {transactions && Object.entries(groupTransactionsByDate(transactions)).map(
      ([date, items]) => (
        <div key={date} className="transactionGroup">
          <h3 className="transactionDate">{date}</h3>

          {items.map((t) => (
            <div
              key={t.id}
              className="transactionItem"
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/groups/${groupId}/transactions/${t.id}`)}
            >
              <div className="transactionLeft">
                <SendIcon className="transaction-icon"/>

                <div>
                  <div className="transactionTitle">{t.name}</div>
                  <div className="transactionSub">
                    Paid by {t.paid_by.full_name}
                  </div>
                </div>
              </div>

              <div className="transactionAmount">
                {t.amount.toFixed(2)} EUR
              </div>
            </div>
          ))}
        </div>
      )
    )}
  </div>
)}

    </>
}