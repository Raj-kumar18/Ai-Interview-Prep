import React, { useState, useEffect } from 'react';
import { useAuth } from '../hook/useAuth';
import Navbar from '../../../components/Navbar';
import toast from 'react-hot-toast';

const parseUserAgent = (ua) => {
    if (!ua) return "Unknown Device";
    if (ua.includes("PostmanRuntime")) return "Postman API Client";

    let os = "Unknown OS";
    if (ua.includes("Windows")) os = "Windows PC";
    else if (ua.includes("Macintosh") || ua.includes("Mac OS")) os = "macOS Device";
    else if (ua.includes("Linux")) os = "Linux Machine";
    else if (ua.includes("Android")) os = "Android Phone";
    else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS Device";

    let browser = "";
    if (ua.includes("Edg/")) browser = "Microsoft Edge";
    else if (ua.includes("Chrome") && ua.includes("Safari")) browser = "Google Chrome";
    else if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Apple Safari";
    else if (ua.includes("Firefox")) browser = "Mozilla Firefox";

    return browser ? `${browser} on ${os}` : os;
};

const getDeviceIcon = (ua) => {
    if (!ua) return "ri-device-line";
    if (ua.includes("Postman")) return "ri-terminal-box-line";
    if (ua.includes("Windows") || ua.includes("Linux")) return "ri-computer-line";
    if (ua.includes("Macintosh") || ua.includes("Mac OS")) return "ri-macbook-line";
    if (ua.includes("Android") || ua.includes("iPhone")) return "ri-phone-line";
    return "ri-device-line";
};

const Settings = () => {
    const { user, handleAllSession, handleLogoutAll, handleRevokeSession } = useAuth();
    const [sessions, setSessions] = useState([]);
    const [loadingSessions, setLoadingSessions] = useState(true);

    const fetchSessions = async () => {
        try {
            const data = await handleAllSession();
            if (data && data.sessions) {
                setSessions(data.sessions);
            }
        } catch (error) {
            toast.error("Failed to load sessions list");
            console.error(error);
        } finally {
            setLoadingSessions(false);
        }
    };

    useEffect(() => {
        fetchSessions();
    }, []);

    const onLogoutAllDevices = async () => {


        try {
            await handleLogoutAll();
            toast.success("Logged out from all devices");
        } catch (error) {
            toast.error("Failed to perform logout on all devices");
            console.error(error);
        }
    };

    const onRevokeSession = async (sessionId, deviceName) => {
        const confirmRevoke = window.confirm(`Terminate session on ${deviceName}?`);
        if (!confirmRevoke) return;

        try {
            await handleRevokeSession(sessionId);
            toast.success(`Session terminated`);
            fetchSessions();
        } catch (error) {
            toast.error("Failed to terminate session");
            console.error(error);
        }
    };

    const activeSessionsCount = sessions.filter(s => !s.revoked).length;

    return (
        <div className="min-h-screen bg-[#0d1117] text-[#e6edf3] font-sans pb-16">
            <Navbar />

            <main className="max-w-5xl mx-auto px-4 md:px-6 pt-10 text-left">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2a3348] pb-6 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white">
                            Security Settings
                        </h1>
                        <p className="text-xs md:text-sm text-gray-400 mt-1">
                            Manage your login credentials, active sessions, and connected devices.
                        </p>
                    </div>

                    <button
                        onClick={onLogoutAllDevices}
                        disabled={sessions.length === 0}
                        className={`h-10 px-5 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors border cursor-pointer ${sessions.length > 0
                                ? 'border-red-900 bg-red-950/20 text-red-400 hover:bg-red-950/30'
                                : 'border-[#2a3348] text-gray-600 cursor-not-allowed opacity-50'
                            }`}
                    >
                        Terminate All Sessions
                    </button>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Left: User Details */}
                    <div className="lg:col-span-1">
                        <div className="bg-[#161b22] border border-[#2a3348] rounded-2xl p-6">
                            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-450 mb-4 font-display">
                                Profile Summary
                            </h2>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-xl bg-[#1c2230] border border-[#2a3348] flex items-center justify-center text-[#ff2d78] text-base font-bold uppercase shadow-sm">
                                    {user?.username?.[0] || 'U'}
                                </div>
                                <div className="overflow-hidden">
                                    <h3 className="text-[#e6edf3] font-bold text-base truncate">{user?.username}</h3>
                                    <p className="text-xs text-gray-450 truncate">{user?.email}</p>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-[#2a3348] text-xs md:text-sm">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">Account Status</span>
                                    <span className="font-bold text-green-400 flex items-center gap-1.5">
                                        <span className="h-1.5 w-1.5 rounded-full bg-green-400"></span> Verified
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">Active Devices</span>
                                    <span className="font-bold text-white">{activeSessionsCount} active</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Sessions */}
                    <div className="lg:col-span-2">
                        <div className="bg-[#161b22] border border-[#2a3348] rounded-2xl p-6 md:p-8">
                            <div className="flex items-center justify-between mb-6">
                                <div className="text-left">
                                    <h2 className="text-base md:text-lg font-bold text-white">
                                        Active & Past Login Sessions
                                    </h2>
                                    <p className="text-xs md:text-sm text-gray-400 mt-1">
                                        Connected platforms and devices associated with your profile.
                                    </p>
                                </div>
                                <span className="px-3 py-1 rounded bg-[#1c2230] border border-[#2a3348] text-[#7d8590] text-xs font-bold shrink-0">
                                    {sessions.length} total
                                </span>
                            </div>

                            {loadingSessions ? (
                                <div className="flex flex-col items-center justify-center py-16">
                                    <div className="w-8 h-8 rounded-full border-2 border-[#2a3348] border-t-white animate-spin mb-3"></div>
                                    <p className="text-xs text-gray-450">Loading sessions list...</p>
                                </div>
                            ) : sessions.length > 0 ? (
                                <div className="space-y-4">
                                    {sessions.map((session) => {
                                        const deviceName = parseUserAgent(session.userAgent);
                                        return (
                                            <div
                                                key={session._id}
                                                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border rounded-xl transition-all ${session.revoked
                                                        ? 'bg-black/10 border-white/5 opacity-50'
                                                        : session.isCurrent
                                                            ? 'bg-[#ff2d78]/5 border-[#ff2d78]/30'
                                                            : 'bg-[#1c2230] border-[#2a3348] hover:border-white/5'
                                                    }`}
                                            >
                                                <div className="flex gap-4 items-start overflow-hidden">
                                                    {/* Device Icon */}
                                                    <div className={`w-10 h-10 rounded flex items-center justify-center border shrink-0 ${session.revoked
                                                            ? 'bg-zinc-900 border-[#2a3348] text-gray-500'
                                                            : session.isCurrent
                                                                ? 'bg-[#ff2d78]/10 border-[#ff2d78]/25 text-[#ff2d78]'
                                                                : 'bg-[#1c2230] border-[#2a3348] text-purple-400'
                                                        }`}>
                                                        <i className={`${getDeviceIcon(session.userAgent)} text-lg`}></i>
                                                    </div>

                                                    {/* Session Metadata */}
                                                    <div className="overflow-hidden">
                                                        <div className="flex items-center gap-2 flex-wrap text-left">
                                                            <p className="text-sm font-semibold text-white truncate">
                                                                {deviceName}
                                                            </p>

                                                            {session.isCurrent && (
                                                                <span className="px-2 py-0.5 rounded bg-[#ff2d78]/10 border border-[#ff2d78]/25 text-[#ff2d78] text-[9px] font-bold uppercase tracking-wider">
                                                                    This Device
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex flex-wrap items-center gap-2.5 mt-1.5 text-xs text-[#7d8590] font-sans">
                                                            <span>IP: {session.ip}</span>
                                                            <span className="h-2.5 w-[1px] bg-[#2a3348] hidden sm:block"></span>
                                                            <span>Login: {new Date(session.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Action / Status */}
                                                <div className="flex items-center justify-end shrink-0 gap-3 border-t sm:border-t-0 pt-2 sm:pt-0 border-[#2a3348]">
                                                    {session.revoked ? (
                                                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                                                            Logged Out
                                                        </span>
                                                    ) : session.isCurrent ? (
                                                        <span className="inline-flex items-center gap-1.5 text-[10px] text-green-400 font-bold uppercase tracking-wider">
                                                            <span className="relative flex h-2 w-2">
                                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                                            </span>
                                                            Active
                                                        </span>
                                                    ) : (
                                                        <button
                                                            onClick={() => onRevokeSession(session._id, deviceName)}
                                                            className="h-8 px-3 rounded-lg border border-red-500/15 hover:border-red-500/30 hover:bg-red-500/10 text-red-400 text-xs font-semibold transition-colors cursor-pointer"
                                                        >
                                                            Terminate
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-gray-500 text-sm">
                                    No active sessions found.
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default Settings;
