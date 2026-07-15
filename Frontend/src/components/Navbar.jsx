import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../features/auth/hook/useAuth';

const Navbar = () => {
    const { user, handleLogout } = useAuth();
    const location = useLocation();

    if (!user) return null;

    const handleReportsClick = (e) => {
        if (location.pathname === '/') {
            e.preventDefault();
            const el = document.getElementById('reports');
            if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-[#2a3348] bg-[#161b22]/95 backdrop-blur-sm">
            <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">

                {/* Logo & Brand */}
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="w-8 h-8 rounded bg-[#1c2230] border border-[#2a3348] flex items-center justify-center text-[#ff2d78] text-sm font-bold shadow-sm">
                        <i className="ri-cpu-line"></i>
                    </div>
                    <span className="font-bold tracking-wider text-[#e6edf3] font-display text-base">
                        PrepAI
                    </span>
                </Link>

                {/* Nav Links & Logout */}
                <div className="flex items-center gap-4 md:gap-6">
                    <div className="flex items-center gap-2 md:gap-3">
                        <Link
                            to="/"
                            className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${location.pathname === '/' && !location.hash
                                ? 'bg-[#1c2230] text-[#ff2d78] font-bold'
                                : 'text-[#7d8590] hover:text-[#e6edf3]'
                                }`}
                        >
                            Dashboard
                        </Link>

                        <a
                            href="/#reports"
                            onClick={handleReportsClick}
                            className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${location.hash === '#reports'
                                ? 'bg-[#1c2230] text-[#ff2d78] font-bold'
                                : 'text-[#7d8590] hover:text-[#e6edf3]'
                                }`}
                        >
                            Recent Reports
                        </a>

                        <Link
                            to="/settings"
                            className={`px-3 py-2 cursor-pointer rounded-lg text-sm font-semibold transition-colors ${location.pathname === '/settings'
                                ? 'bg-[#1c2230] text-[#ff2d78] font-bold'
                                : 'text-[#7d8590] hover:text-[#e6edf3]'
                                }`}
                        >
                            Settings
                        </Link>
                    </div>

                    {/* Vertical Divider */}
                    <div className="h-5 w-[1px] bg-[#2a3348] hidden sm:block"></div>

                    {/* User Profile & Actions */}
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex flex-col text-left">
                            <span className="text-sm font-bold text-[#e6edf3]">
                                {user.username}
                            </span>
                            <span className="text-xs text-[#7d8590]">
                                {user.email}
                            </span>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="h-9 px-4 cursor-pointer rounded-xl border border-[#2a3348] hover:border-red-500/30 bg-[#1c2230] text-red-400 hover:text-red-300 text-sm font-semibold transition-colors flex items-center justify-center gap-1.5"
                        >
                            <i className="ri-logout-box-r-line"></i>
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                </div>

            </div>
        </nav>
    );
};

export default Navbar;
