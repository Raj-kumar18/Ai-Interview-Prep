import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useInterview } from '../hook/useInterview.js';
import Navbar from '../../../components/Navbar';
import toast from 'react-hot-toast';

const Home = () => {
    const { loading, generateReport, reports } = useInterview();
    const [jobDescription, setJobDescription] = useState('');
    const [selfDescription, setSelfDescription] = useState('');
    const [resumeFile, setResumeFile] = useState(null);
    const [loadingStage, setLoadingStage] = useState(0);

    const navigate = useNavigate();
    const location = useLocation();
    const MAX_JOB_CHARS = 3000;
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type === 'application/pdf') {
                setResumeFile(file);
                toast.success(`Selected file: ${file.name}`);
            } else {
                toast.error("Please upload a PDF file only");
            }
        }
    };

    const isFormValid = (resumeFile || selfDescription.trim()) && jobDescription.trim();

    // Rotate loading text for a clean, natural feel
    useEffect(() => {
        if (!loading) return;
        const stages = [
            "Reading resume details...",
            "Analyzing job requirements...",
            "Matching profile credentials...",
            "Finding potential skill gaps...",
            "Building preparation timeline...",
            "Saving custom report..."
        ];
        const interval = setInterval(() => {
            setLoadingStage((prev) => (prev + 1) % stages.length);
        }, 1500);
        return () => clearInterval(interval);
    }, [loading]);

    // Handle smooth scrolling to #reports anchor on mount/redirect
    useEffect(() => {
        if (location.hash === '#reports') {
            const el = document.getElementById('reports');
            if (el) {
                setTimeout(() => {
                    el.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        }
    }, [location.hash, reports]);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setResumeFile(e.target.files[0]);
        }
    };

    const handleRemoveFile = (e) => {
        e.preventDefault();
        setResumeFile(null);
    };

    if (loading) {
        const stagesText = [
            "Reading resume details...",
            "Analyzing job requirements...",
            "Matching profile credentials...",
            "Finding potential skill gaps...",
            "Building preparation timeline...",
            "Saving custom report..."
        ];

        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#0d1117] text-white p-6">
                <div className="flex flex-col items-center max-w-sm text-center">
                    <div className="w-12 h-12 rounded-full border-2 border-[#2a3348] border-t-white animate-spin mb-4"></div>
                    <h2 className="text-lg font-semibold text-white mb-2">Generating Strategy Plan</h2>
                    <p className="text-sm text-gray-400">{stagesText[loadingStage]}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f1419] to-[#1a1f2e] text-[#e6edf3] font-sans pb-16">
            <Navbar />

            {/* Header/Hero Section */}
            <header className="max-w-6xl mx-auto px-4 md:px-6 pt-12 md:pt-16 pb-8 text-left">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-3">
                    Create Your Custom <span className="text-[#ff2d78] font-extrabold">Interview Plan</span>
                </h1>
                <p className="text-sm md:text-base text-gray-400 max-w-2xl">
                    Let our AI analyze the job requirements and your unique profile to build a winning strategy.
                </p>
            </header>

            {/* Main Form */}
            <main className="max-w-6xl mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                    
                    {/* Left Card: Job Description */}
                    <div className="bg-[#242d3d] border border-[#3a4452] hover:border-[#ff69b4]/40 rounded-2xl p-6 md:p-8 flex flex-col justify-between transition-colors">
                        <div>
                            <div className="flex items-center gap-3.5 mb-6">
                                <div className="w-10 h-10 bg-[#ef0c85] rounded-xl flex items-center justify-center text-white shadow-md">
                                    <i className="ri-file-text-line text-lg"></i>
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-white">Target Job Description</h2>
                                    <p className="text-xs text-gray-400">Paste the job specifications or responsibilities</p>
                                </div>
                            </div>
                            
                            <div className="relative">
                                <textarea
                                    className="w-full min-h-[280px] p-4 bg-[#1a1f2e] border border-[#3a4452] rounded-xl text-white text-base focus:outline-none focus:border-[#ff69b4]/50 transition-colors placeholder-gray-500 resize-y"
                                    placeholder="Paste the job description, roles, requirements, or responsibilities here..."
                                    value={jobDescription}
                                    onChange={(e) => e.target.value.length <= MAX_JOB_CHARS && setJobDescription(e.target.value)}
                                />
                                {jobDescription && (
                                    <button 
                                        onClick={() => setJobDescription('')}
                                        className="absolute top-3 right-3 text-gray-500 hover:text-white transition-colors"
                                    >
                                        <i className="ri-close-circle-fill text-xl"></i>
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="text-xs text-gray-500 text-right mt-3 font-semibold">
                            {jobDescription.length} / {MAX_JOB_CHARS} characters
                        </div>
                    </div>

                    {/* Right Card: Background */}
                    <div className="bg-[#242d3d] border border-[#3a4452] hover:border-[#ff69b4]/40 rounded-2xl p-6 md:p-8 flex flex-col gap-6 justify-between transition-colors">
                        <div>
                            <div className="flex items-center gap-3.5 mb-6">
                                <div className="w-10 h-10 bg-[#ef0c85] rounded-xl flex items-center justify-center text-white shadow-md">
                                    <i className="ri-user-line text-lg"></i>
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-white">Your Profile</h2>
                                    <p className="text-xs text-gray-400">Upload your resume or summarize experience</p>
                                </div>
                            </div>

                            {/* Resume Upload */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-xs font-semibold text-gray-300 uppercase tracking-wider">
                                    <span>Upload Resume (PDF)</span>
                                </div>
                                
                                {!resumeFile ? (
                                    <label 
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                        className={`flex flex-col items-center justify-center gap-2 p-6 bg-[#1a1f2e] border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                                            isDragging 
                                            ? 'border-[#ff69b4] bg-[#ff69b4]/5' 
                                            : 'border-[#3a4452] hover:border-[#ff69b4]'
                                        }`}
                                    >
                                        <i className="ri-upload-cloud-2-line text-3xl text-[#ef0c85]/80"></i>
                                        <span className="text-sm font-medium text-white">Click to upload or drag & drop</span>
                                        <input type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
                                    </label>
                                ) : (
                                    <div className="flex items-center justify-between p-4 bg-[#1a1f2e] border border-[#3a4452] rounded-xl">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="w-10 h-10 rounded bg-[#242d3d] flex items-center justify-center text-white shrink-0">
                                                <i className="ri-file-pdf-2-line text-xl"></i>
                                            </div>
                                            <div className="truncate text-left">
                                                <p className="text-sm font-semibold text-white truncate">{resumeFile.name}</p>
                                                <p className="text-xs text-gray-400">PDF Document</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={handleRemoveFile} 
                                            className="w-8 h-8 rounded flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                                        >
                                            <i className="ri-close-line text-xl"></i>
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Or divider */}
                            <div className="relative text-center text-xs text-gray-500 my-4 uppercase tracking-wider before:absolute before:left-0 before:top-1/2 before:w-[44%] before:h-[1px] before:bg-[#3a4452] after:absolute after:right-0 after:top-1/2 after:w-[44%] after:h-[1px] after:bg-[#3a4452]">
                                or
                            </div>

                            {/* Self Description */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider block text-left">Describe Experience & Skills</label>
                                <textarea
                                    className="w-full min-h-[110px] p-4 bg-[#1a1f2e] border border-[#3a4452] rounded-xl text-white text-base focus:outline-none focus:border-[#ff69b4]/50 transition-colors placeholder-gray-500 resize-y"
                                    placeholder="Briefly describe your experience, highlights, or skills..."
                                    value={selfDescription}
                                    onChange={(e) => setSelfDescription(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Generate Button */}
                <div className="flex justify-start mb-16">
                    <button
                        disabled={!isFormValid}
                        onClick={() => generateReport({ jobDescription, selfDescription, resumeFile }).then(data => navigate(`/interview/${data._id}`))}
                        className={`flex items-center gap-3 px-10 py-4 rounded-xl font-bold text-sm text-white uppercase tracking-wider shadow-lg transition-all duration-300 transform ${
                            isFormValid 
                            ? 'bg-gradient-to-r from-[#ef0c85] to-[#ff69b4] hover:shadow-[#ef0c85]/40 hover:-translate-y-1 active:translate-y-0 cursor-pointer' 
                            : 'opacity-50 cursor-not-allowed bg-gray-600'
                        }`}
                    >
                        <i className="ri-magic-line text-base"></i> Generate My Interview Strategy
                    </button>
                </div>

                {/* Reports Section */}
                {reports?.length > 0 && (
                    <section id="reports" className="mt-16 pt-10 border-t border-[#3a4452]">
                        <div className="flex items-center justify-between mb-8">
                            <div className="text-left">
                                <h2 className="text-2xl font-bold text-white">Recent Strategy Plans</h2>
                                <p className="text-sm text-gray-400 mt-1">Review plans and timelines you have generated before</p>
                            </div>
                            <span className="px-3.5 py-1 rounded-full bg-[#242d3d] border border-[#3a4452] text-xs font-semibold text-gray-300">
                                {reports.length} total
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {reports.map((report) => (
                                <div 
                                    key={report._id} 
                                    onClick={() => navigate(`/interview/${report._id}`)} 
                                    className="bg-[#242d3d] border border-[#3a4452] hover:border-[#ff69b4] p-6 rounded-2xl cursor-pointer flex flex-col justify-between h-[160px] transition-colors"
                                >
                                    <div>
                                        <div className="flex items-start justify-between gap-4 mb-2 text-left">
                                            <h3 className="text-white font-bold text-sm md:text-base line-clamp-2 hover:text-[#ff69b4] transition-colors">
                                                {report.title || "Untitled Position"}
                                            </h3>
                                            <i className="ri-arrow-right-up-line text-gray-500 shrink-0 text-lg"></i>
                                        </div>
                                        <p className="text-gray-400 text-xs text-left">
                                            Generated on {new Date(report.createdAt).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between mt-4">
                                        <span className={`px-3 py-1 rounded text-xs font-bold ${
                                            report.matchScore >= 80 
                                            ? 'text-green-500 bg-green-500/10' 
                                            : report.matchScore >= 60 
                                            ? 'text-amber-500 bg-amber-500/10' 
                                            : 'text-red-500 bg-red-500/10'
                                        }`}>
                                            Match Score: {report.matchScore}%
                                        </span>
                                        <span className="text-xs text-[#ff2d78] font-bold hover:underline">
                                            View Plan &rarr;
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
};

export default Home;