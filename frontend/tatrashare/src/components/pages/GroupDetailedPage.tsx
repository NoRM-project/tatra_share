import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import MobileHeader from "../MobileHeader";
import ArrowWithText from "../ArrowWithText";
import Button from "../Button";
import { QrCode } from "lucide-react";
import { reportApi, groupApi, transactionApi, groupMemberApi } from "../../axios/api";
import type { GroupDto, GroupReportDto, TransactionDto, TransactionUserDto } from "../../axios/api";
import Tabs from "../Tabs";
import MemberContainer from "../MemberContainer";

export default function GroupDetailedPage() {
    const { groupId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const stateAny = (location.state || {}) as any;
    const preselected: GroupDto | null = stateAny?.selectedGroup ?? null;
    const [group, setGroup] = useState<GroupDto | null>(preselected);
    const [members, setMembers] = useState<TransactionUserDto[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<"report" | "members" | "transactions">("report");
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
                    } catch (_ ) {
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
                        } catch (_ ) {
                            setMembers([]);
                        }
                    }
                }
                try {
                    const reportRes = await reportApi.getReport(id);
                    if (!mounted) return;
                        setReport(reportRes.data);
                } catch (_) {
                    setReport(null);
                }

                try {
                    const txRes = await transactionApi.getTransactions(id);
                    if (!mounted) return;
                    setTransactions(txRes.data);
                } catch (_) {
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
    }, [groupId]);

    useEffect(() => {
        const shouldOpen = !!stateAny?.openTransactionAfterSelect;
        if (shouldOpen && group) {
            navigate('/transactiondetail');
        }
    }, [stateAny, group, navigate]);

    return <>
        <MobileHeader
            left={<ArrowWithText label={loading ? 'Loading...' : (group ? group.name : 'Group not found')} />} right={<Button icon={<QrCode/>} />}
        />

        {/* <div style={{ padding: 12 }}>
            {loading && <div>Loading group...</div>}
            {error && <div style={{ color: 'red' }}>Error: {error}</div>}
            {!loading && !error && !group && <div>Group not found.</div>}

            {!loading && group && (
                <>
                    <div style={{ marginTop: 12 }}>
                        <strong>Members</strong>
                        <div style={{ marginTop: 8 }}>
                            {members === null && <div>Loading members...</div>}
                            {members && members.length === 0 && <div>No members found.</div>}
                            {members && members.map(m => (
                                <div key={m.id} style={{ padding: 8, borderBottom: '1px solid #eee' }}>{m.full_name} • {m.iban}</div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div> */}

        <Tabs active={activeTab} setActive={setActiveTab} />

    {activeTab === "report" && (
    <div className="tabContent">
        {!report && <div>Loading report...</div>}

        {report && report.balances.map((b) => (
        <MemberContainer
            key={b.member.id}
            fullName={b.member.full_name}
            isReport
            amount={b.amount}
        />
        ))}
    </div>
    )}
    {activeTab === "members" && (
    <div className="tabContent">
        {members === null && <div>Loading members...</div>}
        {members && members.length === 0 && <div>No members</div>}

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

        {transactions && transactions.map((t) => (
        <div key={t.id} className="transactionItem">
            <div>
            <strong>{t.name}</strong>
            <p className="transactionSub">
                Paid by {t.paid_by.full_name}
            </p>
            </div>

            <div className="transactionAmount">
            {t.amount.toFixed(2)} EUR
            </div>
        </div>
        ))}
    </div>
    )}

    </>
}