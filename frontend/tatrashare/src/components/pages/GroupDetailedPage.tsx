import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import MobileHeader from "../MobileHeader";
import ArrowWithText from "../ArrowWithText";
import Button from "../Button";
import { QrCode } from "lucide-react";
import { groupApi, groupMemberApi } from "../../axios/api";
import type { GroupDto, TransactionUserDto } from "../../axios/api";

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

    useEffect(() => {
        let mounted = true;
        async function load() {
            setLoading(true);
            try {
                const id = Number(groupId);
                // If we have a preselected group from navigation state, use it and only fetch members
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
                    // Fall back to loading all groups and finding the one by id (existing behavior)
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

    // If navigated here with the intention to open transaction detail after selection, do it once group loads
    useEffect(() => {
        // Only run after group is loaded
        const shouldOpen = !!stateAny?.openTransactionAfterSelect;
        if (shouldOpen && group) {
            // navigate to transaction detail
            navigate('/transactiondetail');
        }
    }, [stateAny, group, navigate]);

    return <>
        <MobileHeader
            left={
                <ArrowWithText label={loading ? 'Loading...' : (group ? group.name : 'Group not found')} />
            }
            right={<Button icon={<QrCode/>} />}
        />

        <div style={{ padding: 12 }}>
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
        </div>

    </>
}