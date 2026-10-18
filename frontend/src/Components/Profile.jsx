import React, { useState, useMemo } from 'react';
import {
    MapPin,
    Phone,
    Mail,
    Star,
    MoreHorizontal,
    Copy,
    Check,
    Calendar,
    ShieldCheck,
    Briefcase,
    CheckCircle2,
    UserCheck,
} from 'lucide-react';

export default function Profile({ user }) {
    // Interactive state management
    const [isBioModalOpen, setIsBioModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [copiedText, setCopiedText] = useState(null);
    const [isOptionsOpen, setIsOptionsOpen] = useState(false);

    // Profile Readiness state (Matches exact design screenshot)
    const [readinessSteps, setReadinessSteps] = useState([
        { id: 'email', label: 'Email Verified', completed: true },
        { id: 'bio', label: 'Add Profile Bio', completed: false },
        { id: 'avatar', label: 'Upload Profile Picture', completed: true }
    ]);

    const [bioInput, setBioInput] = useState(
        'Seasoned Fintech & Payments Advisor with over 12 years of executive experience at Stripe Inc. Specializing in cross-border payment infrastructure, debt facility structuring, and Series B readiness.'
    );

    // Calculate completed steps & percentage
    const completedCount = useMemo(
        () => readinessSteps.filter((s) => s.completed).length,
        [readinessSteps]
    );

    const completionPercentage = useMemo(
        () => Math.round((completedCount / readinessSteps.length) * 100),
        [completedCount, readinessSteps.length]
    );

    // Booking state
    const [bookingDate, setBookingDate] = useState('2026-10-20');
    const [bookingSlot, setBookingSlot] = useState('14:00 PM');
    const [bookingType, setBookingType] = useState('30min');
    const [bookingConfirmed, setBookingConfirmed] = useState(false);


    // Copy to clipboard helper
    const handleCopy = (text, label) => {
        navigator.clipboard.writeText(text);
        setCopiedText(label);
        setTimeout(() => setCopiedText(null), 2500);
    };

    const handleCompleteBio = () => {
        setReadinessSteps((prev) =>
            prev.map((s) => (s.id === 'bio' ? { ...s, completed: true } : s))
        );
        setIsBioModalOpen(false);
        handleCopy('Profile Bio updated! Readiness is now 100%', 'Profile');
    };

    return (
        <div className="min-h-screen bg-[#fafbfc] text-[#2c3338] font-sans antialiased selection:bg-teal-100 selection:text-teal-900 pb-16">
            {/* Toast Notification */}
            {copiedText && (
                <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-gray-900 text-white px-4 py-2.5 rounded-full shadow-2xl text-xs font-medium animate-in fade-in slide-in-from-bottom-3 duration-200">
                    <Check size={14} className="text-teal-400" />
                    <span>{copiedText} copied to clipboard!</span>
                </div>
            )}

            {/* MAIN PROFILE CONTAINER */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
                {/* HERO COVER BANNER (Snow-capped mountains matching design image) */}
                <div className="relative w-full h-[300px] sm:h-72 md:h-[300px] rounded-2xl overflow-hidden shadow-sm bg-slate-200">
                    <img
                        src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=85"
                        alt="Snow-capped alpine mountains"
                        className="w-full h-full object-cover object-center transform transition duration-700 hover:scale-[1.01]"
                        loading="eager"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* PROFILE HEADER SECTION (Overlapping Avatar + Info) */}
                <div className="relative bg-white rounded-b-2xl px-6 sm:px-10 pb-8 pt-4 shadow-xs border-x border-b border-gray-100">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                        {/* Avatar & Title Block */}
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 -mt-20 sm:-mt-24 md:-mt-28">
                            {/* Profile Image with White Ring */}
                            <div className="relative group">
                                <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full border-[6px] border-white shadow-xl overflow-hidden bg-gray-100 ring-1 ring-black/5 flex-shrink-0">
                                    <img
                                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=85"
                                        alt="Kevin Smith"
                                        className="w-full h-full object-cover object-top"
                                    />
                                </div>
                                <span className="absolute bottom-3 right-3 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white shadow-sm flex items-center justify-center title='Available for advisory'">
                                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                                </span>
                            </div>

                            {/* Name, Subtitle & Social Handles */}
                            <div className="text-center sm:text-left pt-2 sm:pt-6 mt-18">
                                <div className="flex items-center justify-center sm:justify-start gap-2">
                                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                                        Kevin Smith
                                    </h1>
                                    <ShieldCheck className="text-teal-600 fill-teal-100" size={20} title="Verified Advisor" />
                                </div>

                                <p className="text-sm sm:text-base font-normal text-gray-500 mt-1">
                                    User's Description
                                </p>

                                {/* Meta details with Icons */}
                                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-5 gap-y-2 text-xs text-gray-500 mt-3 font-medium">
                                    {/* Location */}
                                    <div className="flex items-center gap-1.5 text-gray-600">
                                        <MapPin size={14} className="text-gray-400" />
                                        <span>Location</span>
                                    </div>

                                    {/* Facebook */}
                                    <a
                                        href="https://facebook.com"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-1.5 text-gray-500 hover:text-blue-600 transition"
                                    >
                                        <span className="w-4 h-4 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-[10px] font-bold">
                                            f
                                        </span>
                                        <span>Facebook ID</span>
                                    </a>

                                    {/* LinkedIn */}
                                    <a
                                        href="https://linkedin.com"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-1.5 text-gray-500 hover:text-blue-700 transition"
                                    >
                                        <span className="w-4 h-4 rounded bg-gray-100 text-gray-600 flex items-center justify-center text-[10px] font-bold">
                                            in
                                        </span>
                                        <span>LinkedIn ID</span>
                                    </a>

                                    {/* Twitter */}
                                    <a
                                        href="https://twitter.com"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-1.5 text-gray-500 hover:text-sky-500 transition"
                                    >
                                        <svg className="w-3.5 h-3.5 fill-gray-400" viewBox="0 0 24 24">
                                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.936 9.936 0 0024 4.59z" />
                                        </svg>
                                        <span>Twitter ID</span>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Top Right Options Action Button */}
                        <div className="relative self-center sm:self-auto sm:pt-4">
                            <button
                                onClick={() => setIsOptionsOpen(!isOptionsOpen)}
                                className="w-9 h-9 rounded-full border border-gray-200 text-gray-400 hover:text-gray-700 hover:border-gray-300 flex items-center justify-center transition shadow-2xs hover:bg-gray-50 focus:outline-none"
                                title="More options"
                            >
                                <MoreHorizontal size={18} />
                            </button>

                            {isOptionsOpen && (
                                <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                                    <button
                                        onClick={() => {
                                            handleCopy(window.location.href, 'Profile link');
                                            setIsOptionsOpen(false);
                                        }}
                                        className="w-full px-4 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2.5"
                                    >
                                        <Copy size={14} className="text-gray-400" /> Copy Profile URL
                                    </button>
                                    <button
                                        onClick={() => {
                                            handleCopy('kevin.smith@stripe.com', 'Email');
                                            setIsOptionsOpen(false);
                                        }}
                                        className="w-full px-4 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2.5"
                                    >
                                        <Mail size={14} className="text-gray-400" /> Copy Email Address
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* MAIN CONTENT 2-COLUMN HERO SECTION (Matches Screenshot Exactly) */}
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                    {/* COLUMN 1: Contact Details & Rating (lg:col-span-3) */}
                    <div className="lg:col-span-4 space-y-6 lg:space-y-16">
                        <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-gray-100 flex flex-col justify-between">
                            <div className="space-y-3.5 text-xs">
                                {/* Office Phone */}
                                <label className="font-bold">Contact Details</label>
                                <div
                                    onClick={() => handleCopy('+79110018830', 'Office phone')}
                                    className="flex items-center gap-2.5 text-gray-600 hover:text-teal-600 cursor-pointer group transition mt-3"
                                    title="Click to copy"
                                >
                                    <Phone size={14} className="text-gray-400 group-hover:text-teal-500 flex-shrink-0" />
                                    <span className="font-medium">+7911 0018830</span>
                                    <span className="text-gray-400">(Office)</span>
                                </div>

                                {/* Email */}
                                <div
                                    onClick={() => handleCopy('kevin.smith@stripe.com', 'Email')}
                                    className="flex items-center gap-2.5 text-gray-600 hover:text-teal-600 cursor-pointer group transition truncate"
                                    title="Click to copy"
                                >
                                    <Mail size={14} className="text-gray-400 group-hover:text-teal-500 flex-shrink-0" />
                                    <span className="font-medium truncate">kevin.smith@stripe.com</span>
                                </div>
                            </div>
                            {/* Profile Readiness Card - Light Theme Matching The Page */}
                        </div>
                        <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-gray-100 flex flex-col justify-between">
                            {/* Card Header: Concentric circles icon, Title, Subtitle, and Circular Progress Ring */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {/* Concentric Circles / Target Icon in Squircle */}
                                    <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100/80 flex items-center justify-center flex-shrink-0">
                                        <svg
                                            className="w-5 h-5 text-teal-600"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2.2"
                                        >
                                            <circle cx="12" cy="12" r="9" />
                                            <circle cx="12" cy="12" r="5" />
                                            <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight leading-tight">
                                            Profile Readiness
                                        </h3>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            {completedCount} of {readinessSteps.length} steps completed
                                        </p>
                                    </div>
                                </div>

                                {/* Circular Progress Ring (80% / dynamic) */}
                                <div className="relative w-11 h-11 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-11 h-11 transform -rotate-90" viewBox="0 0 36 36">
                                        {/* Background Track Circle */}
                                        <path
                                            className="text-gray-100"
                                            strokeWidth="3.2"
                                            stroke="currentColor"
                                            fill="none"
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        />
                                        {/* Progress Arc */}
                                        <path
                                            className="text-[#6366f1] transition-all duration-700 ease-out"
                                            strokeDasharray="100, 100"
                                            strokeDashoffset={100 - completionPercentage}
                                            strokeWidth="3.2"
                                            strokeLinecap="round"
                                            stroke="currentColor"
                                            fill="none"
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        />
                                    </svg>
                                    <span className="absolute text-[11px] font-bold text-gray-900 tracking-tight">
                                    {completionPercentage}%
                                </span>
                                </div>
                            </div>

                            {/* Horizontal Progress Bar */}
                            <div className="my-4 sm:my-5 w-full h-1.5 sm:h-2 rounded-full bg-gray-100 overflow-hidden">
                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-[#6366f1] via-[#7c66f5] to-[#a855f7] transition-all duration-700 ease-out"
                                    style={{ width: `${completionPercentage}%` }}
                                />
                            </div>

                            {/* Step Items List (5 items) */}
                            <div className="space-y-2">
                                {readinessSteps.map((step) => (
                                    <div
                                        key={step.id}
                                        className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-gray-50/80 border border-gray-100 hover:bg-gray-50 hover:border-gray-200 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            {step.completed ? (
                                                <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 shadow-2xs">
                                                    <Check size={12} strokeWidth={3} className="text-white" />
                                                </div>
                                            ) : (
                                                <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
                                                </div>
                                            )}
                                            <span
                                                className={`text-xs sm:text-sm font-medium ${
                                                    step.completed ? 'text-gray-900' : 'text-gray-600'
                                                }`}
                                            >
                                            {step.label}
                                        </span>
                                        </div>

                                        {step.completed ? (
                                            <span className="text-xs sm:text-sm font-semibold text-emerald-600">
                                            Done
                                        </span>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => setIsBioModalOpen(true)}
                                                className="text-xs sm:text-sm font-bold text-[#6366f1] hover:text-[#4f46e5] flex items-center gap-1 transition cursor-pointer"
                                            >
                                                <span>Complete</span>
                                                <span className="text-sm">→</span>
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* COLUMN 2: TABS (Overview, Reviews, Credentials, Consultation) */}
                    <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-gray-100 flex flex-col justify-between">
                        {/* Navigation Tabs */}
                        <div className="flex flex-wrap items-center gap-2 border-b border-gray-100 pb-4">
                            {[
                                { id: 'overview', label: 'Overview & Bio', icon: UserCheck },
                                { id: 'reviews', label: 'Past Jobs Applied', icon: Star },
                                { id: 'experience', label: 'Experience & Credentials', icon: Briefcase },
                                { id: 'booking', label: 'Schedule Interview', icon: Calendar }
                            ].map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition cursor-pointer ${
                                            isActive
                                                ? 'bg-teal-500 text-white shadow-sm shadow-teal-500/20'
                                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                        }`}
                                    >
                                        <Icon size={16} />
                                        <span>{tab.label}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* TAB CONTENT 1: OVERVIEW */}
                        {activeTab === 'overview' && (
                            <div className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="md:col-span-3 space-y-6">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">About Kevin Smith</h3>
                                        <p className="text-sm text-gray-600 leading-relaxed mt-2">
                                            Kevin Smith is a seasoned fintech strategist and financial consultant with over
                                            12 years of executive advisory experience. Currently serving as Advisor and
                                            Consultant at Stripe Inc., he helps emerging enterprises, fintech startups, and
                                            scale-ups architect compliant, scalable global payment infrastructure.
                                        </p>
                                        <p className="text-sm text-gray-600 leading-relaxed mt-2">
                                            His advisory practice focuses on debt structuring, mortgage origination
                                            technologies, payment optimization, cross-border settlement, and venture capital
                                            readiness. Kevin has guided over 45 startups through successful financing rounds
                                            and international market launches.
                                        </p>
                                    </div>

                                    {/* Core Competencies */}
                                    <div>
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                                            Core Skills
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {[
                                                'Fintech Architecture',
                                                'Stripe Connect & Payouts',
                                                'Loan Structuring & Debt',
                                                'Global Payment Compliance',
                                                'Series A & B Preparation',
                                                'SaaS Unit Economics',
                                                'Treasury Management'
                                            ].map((skill) => (
                                                <span
                                                    key={skill}
                                                    className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-teal-50 text-teal-800 border border-teal-100"
                                                >
                                                {skill}
                                            </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB CONTENT 2: REVIEWS */}
                        {activeTab === 'reviews' && (
                            <div className="pt-6 space-y-6">
                                {/* Reviews list */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        {
                                            name: 'Job 1',
                                            role: 'VP of Product, FinScale Tech',
                                            rating: 5,
                                            date: 'Oct 8, 2026',
                                            comment:
                                                "Kevin's advisory on our Stripe Connect billing integration saved our team at least 3 months of costly development. His depth of knowledge is unparalleled."
                                        },
                                        {
                                            name: 'Job 2',
                                            role: 'Managing Partner, NorthBridge Ventures',
                                            rating: 5,
                                            date: 'Sep 24, 2026',
                                            comment:
                                                'Kevin advised two of our portfolio companies through complex debt facilities and mortgage underwriting pipelines. Invaluable guidance and effortless communication.'
                                        },
                                        {
                                            name: 'Job 3',
                                            role: 'Head of Treasury, PayFlow Global',
                                            rating: 4,
                                            date: 'Sep 11, 2026',
                                            comment:
                                                'Very thorough loan structure analysis and interest amortization breakdown. Helped us identify 1.2% in annual savings on facility terms.'
                                        },
                                        {
                                            name: 'Job 4',
                                            role: 'Founder & CEO, Apex Marketplace',
                                            rating: 5,
                                            date: 'Aug 29, 2026',
                                            comment:
                                                'Prompt, extremely sharp, and deeply grounded in current market reality. Booking a monthly retainer with Kevin was one of our best executive decisions.'
                                        }
                                    ].map((review, idx) => (
                                        <div
                                            key={idx}
                                            className="p-5 rounded-2xl bg-gray-50/60 border border-gray-100 flex flex-col justify-between"
                                        >
                                            <div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="text-sm font-bold text-gray-900">{review.name}</h4>
                                                    <span className="text-[11px] text-gray-400">{review.date}</span>
                                                </div>
                                                <p className="text-xs text-teal-700 font-medium mb-3">{review.role}</p>
                                                <p className="text-xs text-gray-600 leading-relaxed">
                                                    "{review.comment}"
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-1 text-amber-400 mt-4">
                                                {[...Array(review.rating)].map((_, i) => (
                                                    <Star key={i} size={12} className="fill-amber-400" />
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* TAB CONTENT 3: EXPERIENCE */}
                        {activeTab === 'experience' && (
                            <div className="pt-6 space-y-6">
                                <h3 className="text-lg font-bold text-gray-900">Career & Credentials</h3>

                                <div className="relative pl-6 border-l-2 border-teal-200 space-y-8">
                                    <div className="relative">
                                        <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-teal-500 border-2 border-white shadow-xs" />
                                        <div className="flex items-baseline justify-between flex-wrap gap-2">
                                            <h4 className="text-sm font-bold text-gray-900">
                                                Advisor & Principal Consultant — Stripe Inc.
                                            </h4>
                                            <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full">
                                            2020 – Present
                                        </span>
                                        </div>
                                        <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                                            Advising key strategic accounts and enterprise fintech clients on international
                                            expansion, customized billing models, regulatory compliance, and multi-entity
                                            merchant infrastructure.
                                        </p>
                                    </div>

                                    <div className="relative">
                                        <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-gray-300 border-2 border-white" />
                                        <div className="flex items-baseline justify-between flex-wrap gap-2">
                                            <h4 className="text-sm font-bold text-gray-900">
                                                Head of Financial Architecture — NordFintech
                                            </h4>
                                            <span className="text-xs text-gray-500">2015 – 2020</span>
                                        </div>
                                        <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                                            Led cross-functional teams in automated underwriting algorithms, loan
                                            calculator services, and credit facility risk modeling.
                                        </p>
                                    </div>

                                    <div className="relative">
                                        <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-gray-300 border-2 border-white" />
                                        <div className="flex items-baseline justify-between flex-wrap gap-2">
                                            <h4 className="text-sm font-bold text-gray-900">
                                                Chartered Financial Analyst (CFA)
                                            </h4>
                                            <span className="text-xs text-gray-500">CFA Institute</span>
                                        </div>
                                        <p className="text-xs text-gray-600 mt-1">
                                            Charterholder in high standing with focus on portfolio valuation, capital
                                            markets, and algorithmic finance.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB CONTENT 4: SCHEDULE CONSULTATION */}
                        {activeTab === 'booking' && (
                            <div className="pt-6 max-w-xl mx-auto text-center space-y-6">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Book an Interview Session</h3>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Choose your preferred time slot for interview
                                    </p>
                                </div>

                                {bookingConfirmed ? (
                                    <div className="p-8 rounded-2xl bg-teal-50 border border-teal-200 text-center animate-in fade-in zoom-in-95">
                                        <CheckCircle2 size={44} className="text-teal-600 mx-auto mb-3" />
                                        <h4 className="text-base font-bold text-teal-900">Consultation Confirmed!</h4>
                                        <p className="text-xs text-teal-700 mt-1">
                                            A calendar invite with Google Meet link has been prepared for{' '}
                                            <strong>{bookingDate}</strong> at <strong>{bookingSlot}</strong>.
                                        </p>
                                        <button
                                            onClick={() => setBookingConfirmed(false)}
                                            className="mt-5 px-5 py-2 rounded-full bg-teal-600 text-white text-xs font-semibold hover:bg-teal-700 transition"
                                        >
                                            Book Another Session
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-4 text-left">
                                        {/* Session Type */}
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 mb-1.5">
                                                Select Session Type
                                            </label>
                                            <div className="grid grid-cols-2 gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => setBookingType('30min')}
                                                    className={`p-3.5 rounded-xl border text-left transition ${
                                                        bookingType === '30min'
                                                            ? 'border-teal-500 bg-teal-50/50 text-teal-900 ring-2 ring-teal-200'
                                                            : 'border-gray-200 bg-white hover:bg-gray-50'
                                                    }`}
                                                >
                                                    <p className="text-xs font-bold">30-Min Online Interview</p>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setBookingType('60min')}
                                                    className={`p-3.5 rounded-xl border text-left transition ${
                                                        bookingType === '60min'
                                                            ? 'border-teal-500 bg-teal-50/50 text-teal-900 ring-2 ring-teal-200'
                                                            : 'border-gray-200 bg-white hover:bg-gray-50'
                                                    }`}
                                                >
                                                    <p className="text-xs font-bold">Offline Interview on campus</p>
                                                    <p className="text-[11px] text-gray-500 mt-0.5">Contact for details</p>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Date & Time Select */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                                                    Select Date
                                                </label>
                                                <input
                                                    type="date"
                                                    value={bookingDate}
                                                    onChange={(e) => setBookingDate(e.target.value)}
                                                    className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-teal-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                                                    Select Time Slot
                                                </label>
                                                <select
                                                    value={bookingSlot}
                                                    onChange={(e) => setBookingSlot(e.target.value)}
                                                    className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-teal-500 bg-white"
                                                >
                                                    <option>10:00 AM (MSK)</option>
                                                    <option>11:30 AM (MSK)</option>
                                                    <option>14:00 PM (MSK)</option>
                                                    <option>16:30 PM (MSK)</option>
                                                    <option>19:00 PM (MSK)</option>
                                                </select>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => setBookingConfirmed(true)}
                                            className="w-full mt-4 py-3 rounded-full bg-[#56c6c2] hover:bg-[#47b9b5] text-white text-xs font-bold shadow-md shadow-teal-500/20 transition cursor-pointer"
                                        >
                                            Confirm & Request Booking
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* INTERACTIVE MODAL 2: ADD PROFILE BIO MODAL (For Profile Readiness) */}
            {isBioModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
                    <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 sm:p-7 animate-in zoom-in-95 duration-150 relative text-gray-900">
                        <button
                            onClick={() => setIsBioModalOpen(false)}
                            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition cursor-pointer"
                        >
                            <X size={16} />
                        </button>

                        <div className="flex items-center gap-2.5 text-emerald-600">
                            <UserCheck size={22} />
                            <h3 className="text-lg font-bold text-gray-900">Complete Profile Bio</h3>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Add a summary of your professional background and advisory focus to reach 100% profile readiness.
                        </p>

                        {/* Bio Text Area */}
                        <div className="mt-5">
                            <label className="block text-xs font-semibold text-gray-700 mb-2">
                                Professional Biography
                            </label>
                            <textarea
                                rows={4}
                                value={bioInput}
                                onChange={(e) => setBioInput(e.target.value)}
                                placeholder="Describe your advisory background, key accomplishments, and industry specializations..."
                                className="w-full p-3.5 text-xs rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] transition"
                            />
                        </div>

                        {/* Quick Suggestion Chips */}
                        <div className="mt-3 flex flex-wrap gap-1.5">
                            <span className="text-[11px] text-gray-500 self-center mr-1">Suggestions:</span>
                            {[
                                'Fintech Architecture & Scale',
                                'Stripe Billing & Global Payments',
                                'Venture Debt & Fundraising'
                            ].map((tag) => (
                                <button
                                    key={tag}
                                    type="button"
                                    onClick={() => setBioInput((prev) => `${prev} Specializing in ${tag}.`)}
                                    className="text-[10px] px-2.5 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 transition cursor-pointer"
                                >
                                    + {tag}
                                </button>
                            ))}
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                            <button
                                onClick={() => setIsBioModalOpen(false)}
                                className="px-5 py-2.5 rounded-full border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCompleteBio}
                                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#6366f1] to-[#8d82fb] hover:from-[#5254e0] hover:to-[#7c66f5] text-white text-xs font-bold shadow-md shadow-indigo-500/20 flex items-center gap-1.5 transition cursor-pointer"
                            >
                                <Check size={14} />
                                <span>Save Bio & Complete</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}