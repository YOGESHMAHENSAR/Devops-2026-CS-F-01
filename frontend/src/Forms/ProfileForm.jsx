import React, { useState, useEffect } from 'react';
import {
    User, Briefcase, Phone, Award, Link as LinkIcon, Building,
    MapPin, Globe, Compass, Banknote, Clock, CheckCircle,
    Eye, EyeOff, Sparkles, RefreshCw, Moon, Sun,
    X, FileText, ChevronDown
} from 'lucide-react';

export default function App() {
    const [isDark, setIsDark] = useState(false);

    // Form State initialized with defaults matching user screenshot
    const [formData, setFormData] = useState({
        email: 'abc@gmail.com',
        name: 'Anoynomus',
        role: 'Software Engineer',
        resumeUrl: 'https://www.xyz.com'
    });

    return (
        <div className={`min-h-screen font-sans transition-colors duration-300 ${isDark ? 'bg-[#121212] text-gray-100' : 'bg-[#f4f6f8] text-gray-800'}`}>

            {/* MUI Top Navigation Bar */}
            <header className={`static top-0 z-30 shadow-md transition-colors ${isDark ? 'bg-[#1e1e1e] border-b border-gray-800' : 'bg-[#1976d2] text-white'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                            <User className="text-white" size={24} />
                        </div>
                        <div>
                            <h3 className={`text-lg font-bold tracking-tight flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                Your Profile Details
                            </h3>
                            <p className="text-xs text-blue-100 opacity-90 hidden sm:block">Have a look at your professional background & credentials!</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsDark(!isDark)}
                            className="p-2 rounded-full hover:bg-white/10 text-white transition"
                            title="Toggle Light/Dark Theme"
                        >
                            {isDark ? <Sun size={18} className="text-amber-300" /> : <Moon size={18} />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Container */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" style={{width: '680px'}}>
                <div className="lg:col-span-5 xl:col-span-4 static top-24" style={{margin: '0 auto'}}>
                    <div className={`rounded-xl shadow-lg border p-6 transition-colors ${
                        isDark ? 'bg-[#1e1e1e] border-gray-800' : 'bg-white border-gray-200/80'
                    }`}>

                        {/* Header Badge */}
                        <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-800">
                            <span className="text-xs font-semibold uppercase tracking-wider text-[#1976d2] flex items-center gap-1.5">
                                <Sparkles size={14} /> Profile Card
                            </span>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${!isDark ? 'bg-emerald-100 text-emerald-800' : 'bg-emerald-700/30 text-emerald-100'}`}>
                                Active Preview
                            </span>
                        </div>
                        {/* Card Main Info */}
                        <div className="mt-4 text-center pb-5 border-b border-gray-200 dark:border-gray-800">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#1976d2] to-indigo-500 text-white text-xl font-bold flex items-center justify-center mx-auto shadow-md mb-3">
                                {formData.name ? formData.name.charAt(0).toUpperCase() : 'P'}
                            </div>

                            <h3 className={`font-bold text-lg leading-snug ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {formData.email || 'Your Email'}
                            </h3>

                            <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
                                {formData.role && (
                                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/30 font-medium">
                                        {formData.role}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Resume link */}
                        {formData.resumeUrl && (
                            <div className="flex items-center justify-between">
                                <span className={`flex items-center gap-1.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                    <FileText size={14} /> Resume:
                                </span>
                                <a
                                    href={formData.resumeUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[#1976d2] hover:underline flex items-center gap-1"
                                >
                                    View Link <LinkIcon size={10} />
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}