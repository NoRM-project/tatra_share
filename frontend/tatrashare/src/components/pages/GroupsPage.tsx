import { CircleQuestionMark } from "lucide-react";
import Button from "../Button";
import MobileFooter from "../MobileFooter";
import MobileHeader from "../MobileHeader";
import SecondaryTitle from "../SecondaryTitle";
import { useEffect, useState } from "react";
import { groupApi } from "../../axios/api";
import type { GroupDto } from "../../axios/api";
import { Link } from "react-router-dom";
import GroupContainer from "../GroupContainer";

export default function GroupsPage() {
    const [groups, setGroups] = useState<GroupDto[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    function extractErrorMessage(err: unknown) {
        if (err instanceof Error) return err.message;
        const anyErr = err as any;
        if (anyErr?.isAxiosError) {
            if (anyErr.response) {
                const status = anyErr.response.status;
                const statusText = anyErr.response.statusText || '';
                return `Server responded with ${status} ${statusText}`;
            }
            if (anyErr.request) {
                return 'No response received from server (network or CORS issue)';
            }
            return anyErr.message || String(anyErr);
        }
        return String(anyErr ?? 'Unknown error');
    }

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
        loadGroups();
    }, []);

    return <>
        <MobileHeader left={<h2 style={{ margin: 0 }}>TatraShare</h2>} right={<Button hasBackground={false} icon={<CircleQuestionMark color="#4da3ff"/>} />} />
        <SecondaryTitle label="Groups" button={<Button hasBackground={false} text="Add group" />} />

        {loading && <div style={{ padding: 16 }}>Loading groups...</div>}
        {error && (
            <div style={{ padding: 16 }}>
                <div style={{ color: 'red', marginBottom: 8 }}>Error: {error}</div>
                {error.toLowerCase().includes('cors') || error.toLowerCase().includes('no response') || error.toLowerCase().includes('network') ? (
                    <div style={{ fontSize: 13, color: '#666', marginBottom: 8 }}>
                        This looks like a network or CORS issue. Make sure the backend at <code>http://localhost:8080</code> allows requests from <code>http://localhost:5175</code> (add Access-Control-Allow-Origin header or enable CORS on the server).
                    </div>
                ) : null}
                <Button hasBackground={true} text="Retry" onClick={() => loadGroups()} />
            </div>
        )}

        {!loading && !error && (
            <div className="groupsList">
                {(!groups || groups.length === 0) && <div>No groups yet.</div>}

                {groups &&
                groups.map((g) => (
                    <Link
                    key={g.id}
                    to={`/groups/${g.id}`}
                    className="groupLink"
                    >
                    <GroupContainer
                        header={g.name}
                        members={g.members_count}
                        amount={g.user_balance}
                    />
                    </Link>
                ))}
            </div>
        )}

        <MobileFooter/>
    </>
}
