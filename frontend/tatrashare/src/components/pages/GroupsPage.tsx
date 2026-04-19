import { CircleQuestionMark } from "lucide-react";
import Button from "../Button";
import MobileFooter from "../MobileFooter";
import MobileHeader from "../MobileHeader";
import SecondaryTitle from "../SecondaryTitle";
import { useCallback, useEffect, useState } from "react";
import { groupApi } from "../../axios/api";
import type { GroupDto } from "../../axios/api";
import { Link, useNavigate } from "react-router-dom";
import GroupContainer from "../GroupContainer";
import axios from "axios";

export default function GroupsPage() {
    const navigate = useNavigate();
    const [groups, setGroups] = useState<GroupDto[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    function extractErrorMessage(err: unknown) {
        if (err instanceof Error) return err.message;
        if (axios.isAxiosError(err)) {
            if (err.response) {
                const status = err.response.status;
                const statusText = err.response.statusText || "";
                return `Server responded with ${status} ${statusText}`;
            }
            if (err.request) {
                return "No response received from server (network or CORS issue)";
            }
            return err.message || String(err);
        }
        return String(err ?? "Unknown error");
    }

    const loadGroups = useCallback(async () => {
        setLoading(true);
        try {
            const res = await groupApi.getGroups();
            setGroups(res.data);
            setError(null);
        } catch (err: unknown) {
            const msg = extractErrorMessage(err);
            setError(msg);
            setGroups([]);
        } finally {
            setLoading(false);
        }
    }, []);

    function addGroup() {
        navigate("/groups/new");
    }

    useEffect(() => {
        // Defer initial load to avoid synchronous state updates directly in the effect body.
        const t = window.setTimeout(() => {
            void loadGroups();
        }, 0);

        return () => {
            window.clearTimeout(t);
        };
    }, [loadGroups]);

    return <>
        <MobileHeader left={<h2 style={{ margin: 0 }}>TatraShare</h2>} right={<Button hasBackground={false} icon={<CircleQuestionMark color="#4da3ff"/>} />} />
        <SecondaryTitle label="Groups" button={<Button hasBackground={false} text="Add group" onClick={addGroup}/>} />

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
