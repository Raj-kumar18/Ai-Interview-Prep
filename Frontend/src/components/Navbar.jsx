import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../features/auth/hook/useAuth';

const Navbar = () => {
    const { user, handleLogout } = useAuth();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false); // Mobile menu toggle

    if (!user) return null;

    const handleReportsClick = (e) => {
        setIsOpen(false); // Close menu on click
        if (location.pathname === '/') {
            e.preventDefault();
            const el = document.getElementById('reports');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-[#2a3348] bg-[#161b22]/95 backdrop-blur-sm">
            <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

                {/* Logo */}
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-[#1c2230] border border-[#2a3348] flex items-center justify-center text-[#ff2d78] font-bold">
                        <i className="ri-cpu-line"></i>
                    </div>
                    <span className="font-bold text-[#e6edf3]">PrepAI</span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-6">
                    <Link to="/" className={`text-sm font-semibold transition ${location.pathname === '/' && !location.hash ? 'text-[#ff2d78]' : 'text-[#7d8590]'}`}>Dashboard</Link>
                    <a href="/#reports" onClick={handleReportsClick} className={`text-sm font-semibold transition ${location.hash === '#reports' ? 'text-[#ff2d78]' : 'text-[#7d8590]'}`}>Reports</a>
                    <Link to="/settings" className={`text-sm font-semibold transition ${location.pathname === '/settings' ? 'text-[#ff2d78]' : 'text-[#7d8590]'}`}>Settings</Link>
                </div>

                {/* Desktop Profile & Logout */}
                <div className="hidden md:flex items-center gap-4">
                    <span className="text-xs text-[#7d8590]">{user.username}</span>
                    <button onClick={handleLogout} className="px-3 py-1.5 rounded-lg bg-[#1c2230] text-red-400 text-sm border border-[#2a3348] hover:border-red-500/30">
                        Logout
                    </button>
                </div>

                {/* Mobile Hamburger Button */}
                <button className="md:hidden text-[#e6edf3] text-2xl" onClick={() => setIsOpen(!isOpen)}>
                    <i className={isOpen ? "ri-close-line" : "ri-menu-3-line"}></i>
                </button>
            </div>

            {/* Mobile Menu Dropdown */}
            {isOpen && (
                <div className="md:hidden bg-[#161b22] border-b border-[#2a3348] px-4 py-4 space-y-4">
                    <Link to="/" onClick={() => setIsOpen(false)} className="block text-[#e6edf3] font-medium">Dashboard</Link>
                    <a href="/#reports" onClick={handleReportsClick} className="block text-[#e6edf3] font-medium">Recent Reports</a>
                    <Link to="/settings" onClick={() => setIsOpen(false)} className="block text-[#e6edf3] font-medium">Settings</Link>
                    <div className="pt-4 border-t border-[#2a3348] flex justify-between items-center">
                        <span className="text-sm text-[#7d8590]">{user.username}</span>
                        <button onClick={handleLogout} className="text-red-400 text-sm font-semibold">Logout</button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;