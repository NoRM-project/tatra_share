import { CircleQuestionMark } from "lucide-react";
import Button from "../Button";
import MobileFooter from "../MobileFooter";
import MobileHeader from "../MobileHeader";
import SecondaryTitle from "../SecondaryTitle";
import { useEffect, useState } from "react";
import { groupApi } from "../../axios/api";
import type { GroupDto } from "../../axios/api";
import { Link } from "react-router-dom";

export default function GroupsPage() {
    const [groups, setGroups] = useState<GroupDto[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Helper to extract a friendly message from various error shapes (Axios, Error, string)
    function extractErrorMessage(err: unknown) {
        if (err instanceof Error) return err.message;
        const anyErr = err as any;
        // Axios-like error
        if (anyErr?.isAxiosError) {
            if (anyErr.response) {
                // Server responded with a status
                const status = anyErr.response.status;
                const statusText = anyErr.response.statusText || '';
                return `Server responded with ${status} ${statusText}`;
            }
            if (anyErr.request) {
                // Request sent but no response — likely network/CORS issue
                return 'No response received from server (network or CORS issue)';
            }
            return anyErr.message || String(anyErr);
        }
        return String(anyErr ?? 'Unknown error');
    }

    // Load groups (exposed so we can retry)
    async function loadGroups() {
        const mounted = true;
        setLoading(true);
        try {
            const res = await groupApi.getGroups();
            if (!mounted) return;
            setGroups(res.data);
            setError(null);
        } catch (err: unknown) {
            if (!mounted) return;
            const msg = extractErrorMessage(err);
            setError(msg);
            setGroups([]);
        } finally {
            if (mounted) setLoading(false);
        }
    }

    useEffect(() => {
        // call loadGroups on mount
        loadGroups();
        // no mounted cleanup needed here since loadGroups manages state and React unmount will ignore setState after unmount
        // but for safety we won't return a cleanup that cancels in-flight axios - this could be improved with AbortController.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <>
        <MobileHeader left={<h2>TatraShare</h2>} right={<Button hasBackground={false} icon={<CircleQuestionMark color="#4da3ff"/>} />} />
        <SecondaryTitle label="Groups" button={<Button hasBackground={false} text="Add group" />} />

        {loading && <div style={{ padding: 16 }}>Loading groups...</div>}
        {error && (
            <div style={{ padding: 16 }}>
                <div style={{ color: 'red', marginBottom: 8 }}>Error: {error}</div>
                {/* Provide helpful hint when network/CORS issues are likely */}
                {error.toLowerCase().includes('cors') || error.toLowerCase().includes('no response') || error.toLowerCase().includes('network') ? (
                    <div style={{ fontSize: 13, color: '#666', marginBottom: 8 }}>
                        This looks like a network or CORS issue. Make sure the backend at <code>http://localhost:8080</code> allows requests from <code>http://localhost:5175</code> (add Access-Control-Allow-Origin header or enable CORS on the server).
                    </div>
                ) : null}
                <Button hasBackground={true} text="Retry" onClick={() => loadGroups()} />
            </div>
        )}

        {!loading && !error && (
            <div style={{ padding: 12 }}>
                {(!groups || groups.length === 0) && <div>No groups yet.</div>}
                {groups && groups.map(g => (
                    <Link key={g.id} to={`/groups/${g.id}`} style={{ display: 'block', padding: 12, borderBottom: '1px solid #eee', color: 'inherit', textDecoration: 'none' }}>
                        <div style={{ fontWeight: 600 }}>{g.name}</div>
                        <div style={{ fontSize: 12, color: '#666' }}>{g.members_count} members • Balance: {g.user_balance}</div>
                    </Link>
                ))}
            </div>
        )}

        <MobileFooter/>
    </>
}
