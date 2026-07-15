import React, { useState, useEffect } from 'react';
import { useInterview } from '../hook/useInterview';
import { useNavigate, useParams } from 'react-router';
import Navbar from '../../../components/Navbar';

const NAV_ITEMS = [
    { id: 'technical', label: 'Technical Questions', icon: <i className="ri-code-s-slash-line text-base"></i> },
    { id: 'behavioral', label: 'Behavioral Questions', icon: <i className="ri-chat-voice-line text-base"></i> },
    { id: 'roadmap', label: 'Road Map', icon: <i className="ri-treasure-map-line text-base"></i> },
];

const Interview = () => {
    const [activeNav, setActiveNav] = useState('technical');
    const [expandedQuestions, setExpandedQuestions] = useState({});
    const { report, getReportById, loading, getResumePdf } = useInterview();
    const { interviewId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (interviewId) getReportById(interviewId);
    }, [interviewId]);

    const toggleQuestion = (index) => {
        setExpandedQuestions(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    if (loading || !report) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#0d1117] text-white p-6">
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full border-2 border-[#2a3348] border-t-white animate-spin mb-4"></div>
                    <p className="text-sm font-semibold text-gray-400">Loading your interview plan...</p>
                </div>
            </div>
        );
    }

    const { technicalQuestions = [], behavioralQuestions = [], skillGap = [], preprationPlan = [], matchScore = 0 } = report;

    return (
        <div className="min-h-screen bg-[#0d1117] text-[#e6edf3] font-sans pb-16">
            <Navbar />

            {/* Header Area */}
            <header className="max-w-6xl mx-auto px-4 md:px-6 pt-10 pb-6 relative z-10 text-left">
                <button
                    onClick={() => navigate('/')}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7d8590] hover:text-[#e6edf3] transition-colors mb-4 group"
                >
                    <i className="ri-arrow-left-line"></i> Back to Dashboard
                </button>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2a3348] pb-6">
                    <div className="text-left">
                        <span className="text-xs bg-[#ff2d78]/10 border border-[#ff2d78]/20 px-3 py-1 rounded-full text-[#ff2d78] font-bold uppercase tracking-wider">
                            Plan Generated
                        </span>
                        <h1 className="text-3xl font-bold text-white mt-3">
                            {report.title || "Job Interview Plan"}
                        </h1>
                        <p className="text-xs md:text-sm text-gray-400 mt-1 max-w-xl">
                            Practice question structures, study reference guidelines, and fill key skill gaps.
                        </p>
                    </div>
                    <button
                        onClick={() => getResumePdf(interviewId)}
                        className="bg-[#ff2d78] text-white cursor-pointer px-6 py-3 rounded-xl text-sm font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2"
                    >
                        <i className="ri-download-2-line text-base"></i> Generate Resume
                    </button>
                </div>
            </header>

            {/* Main Content Layout Grid */}
            <main className="max-w-6xl mx-auto px-4 md:px-6 relative z-10">
                <div className="flex flex-col lg:flex-row gap-6">

                    {/* Navigation Sidebar */}
                    <div className="w-full lg:w-[220px] shrink-0">
                        {/* Desktop vertical navigation */}
                        <div className="hidden lg:flex flex-col gap-2">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#7d8590] px-3.5 mb-1 text-left">Sections</p>
                            {NAV_ITEMS.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveNav(item.id)}
                                    className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-semibold text-left transition-colors ${activeNav === item.id
                                        ? 'bg-[#ff2d78]/10 text-[#ff2d78]'
                                        : 'text-[#7d8590] hover:bg-[#1c2230] hover:text-[#e6edf3]'
                                        }`}
                                >
                                    {item.icon} {item.label}
                                </button>
                            ))}
                        </div>

                        {/* Mobile horizontal navigation tabs */}
                        <div className="lg:hidden flex items-center gap-2 overflow-x-auto pb-3 -mx-4 px-4 scrollbar-none">
                            {NAV_ITEMS.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveNav(item.id)}
                                    className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${activeNav === item.id
                                        ? 'bg-[#ff2d78]/10 text-[#ff2d78]'
                                        : 'bg-[#1c2230] text-[#7d8590] hover:text-[#e6edf3]'
                                        }`}
                                >
                                    {item.icon} {item.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Center Core Content Section */}
                    <div className="flex-1 bg-[#161b22] border border-[#2a3348] rounded-2xl p-6 md:p-8">

                        {/* Section Header */}
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#2a3348]">
                            <h2 className="text-base md:text-lg font-bold text-white text-left">
                                {activeNav === 'roadmap' ? 'Preparation Road Map' : `${activeNav === 'technical' ? 'Technical' : 'Behavioral'} Questions`}
                            </h2>
                            <span className="text-xs bg-[#1c2230] border border-[#2a3348] px-3.5 py-1 rounded-full text-[#7d8590] font-bold">
                                {activeNav === 'roadmap'
                                    ? `${preprationPlan.length}-day timeline`
                                    : `${activeNav === 'technical' ? technicalQuestions.length : behavioralQuestions.length} Questions`
                                }
                            </span>
                        </div>

                        {/* Questions/Roadmap Content */}
                        <div className="flex flex-col gap-4">
                            {activeNav !== 'roadmap' ? (
                                (activeNav === 'technical' ? technicalQuestions : behavioralQuestions).map((q, i) => (
                                    <div
                                        key={i}
                                        className="bg-[#1c2230] border border-[#2a3348] rounded-xl overflow-hidden transition-colors"
                                    >
                                        {/* Toggle Accordion Header */}
                                        <button
                                            onClick={() => toggleQuestion(i)}
                                            className="w-full flex items-start justify-between gap-3 p-4 text-left font-semibold hover:bg-white/5 transition-colors"
                                        >
                                            <div className="flex items-start gap-3">
                                                <span className="text-[10px] font-bold text-[#ff2d78] bg-[#ff2d78]/10 px-2.5 py-1 rounded border border-[#ff2d78]/25 uppercase shrink-0 mt-0.5">
                                                    Q{i + 1}
                                                </span>
                                                <p className="text-sm md:text-base font-bold text-[#e6edf3] leading-relaxed">
                                                    {q.questions || q.question}
                                                </p>
                                            </div>
                                            <i className={`ri-arrow-down-s-line text-xl text-[#7d8590] transition-transform duration-250 ${expandedQuestions[i] ? 'rotate-180 text-[#ff2d78]' : ''}`}></i>
                                        </button>

                                        {/* Toggle Accordion Content */}
                                        <div className={`transition-all duration-250 ease-in-out ${expandedQuestions[i] ? 'max-h-[1000px] border-t border-[#2a3348]' : 'max-h-0 overflow-hidden'}`}>
                                            <div className="p-5 space-y-4 text-left bg-black/10">
                                                <div className="space-y-1.5">
                                                    <span className="text-xs font-bold uppercase tracking-wider text-purple-400 bg-purple-450/10 px-2 py-0.5 rounded">
                                                        Evaluation Intention
                                                    </span>
                                                    <p className="text-sm text-gray-300 leading-relaxed font-sans mt-2">
                                                        {q.intention}
                                                    </p>
                                                </div>
                                                <div className="space-y-1.5 pt-3 border-t border-[#2a3348]/40">
                                                    <span className="text-xs font-bold uppercase tracking-wider text-green-400 bg-green-450/10 px-2 py-0.5 rounded">
                                                        Model Answer Guidance
                                                    </span>
                                                    <div className="text-sm text-gray-200 leading-relaxed font-sans bg-[#1c2230] border border-[#2a3348] rounded-xl p-4 mt-2 whitespace-pre-line">
                                                        {q.answer}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                /* Vertical Timeline roadmap */
                                <div className="relative border-l-2 border-[#ff2d78]/20 ml-6 pl-1 space-y-8 py-3 text-left">
                                    {preprationPlan.map((day, index) => (
                                        <div key={day.day || index} className="pl-6 relative">
                                            {/* dot node */}
                                            <div className="absolute -left-[10px] top-1.5 w-4 h-4 rounded-full bg-[#161b22] border-2 border-[#ff2d78]"></div>

                                            <span className="text-[10px] font-bold text-[#ff2d78] bg-[#ff2d78]/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
                                                Day {day.day}
                                            </span>
                                            <h3 className="font-bold text-sm md:text-base text-[#e6edf3] mt-2 mb-3">
                                                {day.focusArea || day.focus}
                                            </h3>
                                            <ul className="space-y-3">
                                                {day.tasks.map((task, idx) => (
                                                    <li key={idx} className="text-sm text-gray-300 flex items-start gap-2.5 leading-relaxed">
                                                        <i className="ri-checkbox-circle-line text-base text-[#ff2d78] shrink-0 mt-0.5"></i>
                                                        <span>{task}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Details Sidebar */}
                    <div className="w-full lg:w-[240px] shrink-0 flex flex-col gap-6">

                        {/* Match Score Card */}
                        <div className="bg-[#161b22] border border-[#2a3348] rounded-2xl p-6 flex flex-col items-center text-center">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#7d8590] mb-4 w-full text-left font-display">Match Score</p>

                            {/* Score Border Meter */}
                            <div className={`w-24 h-24 rounded-full border-4 flex flex-col items-center justify-center mb-3 ${matchScore >= 80 ? 'border-green-500' : matchScore >= 60 ? 'border-amber-500' : 'border-red-500'
                                }`}>
                                <span className="text-2xl font-extrabold text-white">
                                    {matchScore}<span className="text-sm text-gray-400 font-semibold">%</span>
                                </span>
                            </div>

                            <p className={`text-sm font-bold ${matchScore >= 80 ? 'text-green-500' : matchScore >= 60 ? 'text-amber-500' : 'text-red-500'
                                }`}>
                                {matchScore >= 80 ? 'Strong Match' : matchScore >= 60 ? 'Moderate Match' : 'High Skill Gap'}
                            </p>
                        </div>

                        {/* Skill Gaps Card */}
                        <div className="bg-[#161b22] border border-[#2a3348] rounded-2xl p-6 text-left">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#7d8590] mb-4">Skill Gaps</p>
                            {skillGap.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {skillGap.map((gap, i) => (
                                        <span
                                            key={i}
                                            className={`text-xs px-2.5 py-1.5 rounded border font-semibold ${gap.severity === 'high'
                                                ? 'bg-red-500/10 border-red-500/25 text-red-400'
                                                : gap.severity === 'medium'
                                                    ? 'bg-amber-500/10 border-amber-500/25 text-amber-400'
                                                    : 'bg-green-500/10 border-green-500/25 text-green-400'
                                                }`}
                                        >
                                            {gap.skill}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 text-center py-2">No key gaps identified.</p>
                            )}
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
};

export default Interview;