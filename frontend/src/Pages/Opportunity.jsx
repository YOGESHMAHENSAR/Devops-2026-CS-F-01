import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Briefcase,
    Clock,
    MapPin,
    CheckCircle2,
    Building2,
    X,
    Check,
    Bookmark
} from 'lucide-react';

export default function Opportunity() {
    const navigate = useNavigate();

    // Stored user profile info (with fallback to Rajesh Kumar as shown in mockup)
    const storedUser = (() => {
        try {
            const saved = localStorage.getItem('user');
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    })();

    const userName = storedUser?.name || 'Rajesh';
    const fullName = storedUser?.fullName || storedUser?.name || 'Rajesh Kumar';
    const userRole = storedUser?.domain || 'Operations & strategy';
    const userExperience = storedUser?.experience || '28 yrs';

    // List of opportunities matching mockup
    const allOpportunities = [
        {
            id: 'opp-1',
            title: 'Business advisory — fintech startup',
            company: 'Northbridge Financial',
            location: 'Remote',
            hours: '10 hrs/week',
            type: 'Consultancy',
            match: 92,
            posted: '3 days ago',
            duration: '6 months',
            compensation: '₹40,000 / month',
            description:
                "Northbridge is looking for a senior advisor to guide our leadership team through a Series A fundraise and operational scaling. You'll meet weekly with the founders and review strategic decisions.",
            responsibilities: [
                'Review growth strategy and unit economics monthly',
                'Advise leadership on fundraising narrative and investor pitch decks',
                'Mentor two first-time founders on operational discipline and OKRs'
            ],
            requirements: [
                '15+ years in financial services or fintech leadership',
                'Prior experience advising early-stage seed/Series A startups',
                'Comfortable with remote, asynchronous collaboration and weekly syncs'
            ]
        },
        {
            id: 'opp-2',
            title: 'Mentorship — early-stage founders cohort',
            company: 'NSRCEL Venture Lab',
            location: 'Hybrid, Bengaluru',
            hours: '6 hrs/week',
            type: 'Mentorship',
            match: 87,
            posted: '1 day ago',
            duration: '3 months',
            compensation: '₹30,000 / month',
            description:
                'Lead mentoring sessions for a cohort of 8 high-growth B2B enterprise tech startups. Provide strategic product-market fit direction and go-to-market scaling frameworks.',
            responsibilities: [
                'Conduct bi-weekly 1-on-1 mentorship sessions with cohort founders',
                'Host masterclasses on go-to-market and client acquisition pipelines',
                'Evaluate milestone reviews and readiness for demo day'
            ],
            requirements: [
                '12+ years building, scaling, or advising early-stage enterprises',
                'Deep understanding of B2B sales cycles and enterprise customer acquisition',
                'Available for hybrid sessions in Bengaluru'
            ]
        },
        {
            id: 'opp-3',
            title: 'Operations advisor — manufacturing SME',
            company: 'Apex Precision Engineering',
            location: 'On-site, Pune',
            hours: 'Project-based',
            type: 'Advisory',
            match: 79,
            posted: '5 days ago',
            duration: '4 months',
            compensation: '₹50,000 / month',
            description:
                'Apex Precision seeks a veteran operations head to audit plant floor bottlenecks, implement lean manufacturing principles, and streamline supply chain logistics for export expansion.',
            responsibilities: [
                'Audit current plant workflows and identify lead-time inefficiencies',
                'Design standardized inventory and vendor procurement protocols',
                'Upskill middle plant managers on quality compliance standards'
            ],
            requirements: [
                '20+ years of manufacturing operations and supply chain management',
                'Hands-on expertise in lean manufacturing, Six Sigma, and ISO auditing',
                'Willingness to visit the Pune plant facility'
            ]
        },
        {
            id: 'opp-4',
            title: 'Strategic Growth Consultant — Agritech Platform',
            company: 'KisanSetu Technologies',
            location: 'Remote',
            hours: '8 hrs/week',
            type: 'Consultancy',
            match: 75,
            posted: 'Just now',
            duration: '6 months',
            compensation: '₹45,000 / month',
            description:
                'Help scale supply chain linkages between rural farmer collectives and retail FMCG distribution networks across western India.',
            responsibilities: [
                'Establish supply chain route optimization frameworks',
                'Guide strategic partnerships with state procurement agencies',
                'Advise on unit economics and working capital cycles'
            ],
            requirements: [
                '15+ years in agricultural supply chains or rural logistics',
                'Experience working with corporate FMCG procurement teams'
            ]
        }
    ];

    // State
    const [selectedOpp, setSelectedOpp] = useState(null);
    const [showAll, setShowAll] = useState(false);
    const [appliedOpps, setAppliedOpps] = useState({});
    const [savedOpps, setSavedOpps] = useState({});
    const [toastMessage, setToastMessage] = useState(null);

    // Filter display opportunities
    const displayedOpportunities = showAll ? allOpportunities : allOpportunities.slice(0, 3);

    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3000);
    };

    const handleApply = (opp) => {
        setAppliedOpps((prev) => ({ ...prev, [opp.id]: true }));
        showToast(`Application submitted successfully for ${opp.title}!`);
    };

    const handleSave = (opp) => {
        setSavedOpps((prev) => {
            const next = { ...prev, [opp.id]: !prev[opp.id] };
            showToast(next[opp.id] ? 'Opportunity saved to your bookmarks!' : 'Opportunity removed from bookmarks.');
            return next;
        });
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-[#1F2937] pb-20 font-sans">
            {/* Notification Toast */}
            {toastMessage && (
                <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#0F2A4A] text-white px-5 py-3 rounded-xl shadow-2xl text-sm font-medium animate-bounce">
                    <Check size={18} className="text-[#0F9D6E]" />
                    <span>{toastMessage}</span>
                </div>
            )}

            <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                {/* TOP HEADER SECTION */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-7">
                    <div>
                        <h1 className="text-2xl sm:text-[28px] font-bold text-[#0F2A4A] tracking-tight">
                            Welcome back, {userName}
                        </h1>
                        <p className="text-sm sm:text-[15px] text-[#5B6472] mt-1">
                            Here's what's happening with your profile this week.
                        </p>
                    </div>

                    <div className="self-start sm:self-center">
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-[#E4F5EE] text-[#0B7754]">
                            <CheckCircle2 size={16} className="text-[#0F9D6E]" />
                            Verified profile
                        </span>
                    </div>
                </div>

                {/* STATS ROW (4 CARDS) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
                    {/* Card 1 */}
                    <div className="bg-white border border-[#E4E7EC] rounded-xl p-5 hover:border-slate-300 hover:shadow-xs transition duration-200">
                        <p className="text-xs sm:text-sm text-[#8A93A0] font-medium">Profile views</p>
                        <h2 className="text-2xl sm:text-[26px] font-bold text-[#0F2A4A] my-1.5">184</h2>
                        <p className="text-xs sm:text-[13px] text-[#0F9D6E] font-semibold">+12% this week</p>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-white border border-[#E4E7EC] rounded-xl p-5 hover:border-slate-300 hover:shadow-xs transition duration-200">
                        <p className="text-xs sm:text-sm text-[#8A93A0] font-medium">Matched opportunities</p>
                        <h2 className="text-2xl sm:text-[26px] font-bold text-[#0F2A4A] my-1.5">9</h2>
                        <p className="text-xs sm:text-[13px] text-[#0F9D6E] font-semibold">3 new today</p>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-white border border-[#E4E7EC] rounded-xl p-5 hover:border-slate-300 hover:shadow-xs transition duration-200">
                        <p className="text-xs sm:text-sm text-[#8A93A0] font-medium">Active applications</p>
                        <h2 className="text-2xl sm:text-[26px] font-bold text-[#0F2A4A] my-1.5">4</h2>
                        <p className="text-xs sm:text-[13px] text-[#0F9D6E] font-semibold">1 interview scheduled</p>
                    </div>

                    {/* Card 4 */}
                    <div className="bg-white border border-[#E4E7EC] rounded-xl p-5 hover:border-slate-300 hover:shadow-xs transition duration-200">
                        <p className="text-xs sm:text-sm text-[#8A93A0] font-medium">Profile completeness</p>
                        <h2 className="text-2xl sm:text-[26px] font-bold text-[#0F2A4A] my-1.5">85%</h2>
                        <button
                            onClick={() => navigate('/profile')}
                            className="text-xs sm:text-[13px] text-[#0F9D6E] font-semibold hover:underline cursor-pointer"
                        >
                            Add 2 more skills
                        </button>
                    </div>
                </div>

                {/* MAIN CONTENT SPLIT (Left: Matched for you, Right: Profile Card & Upcoming) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* LEFT COLUMN: MATCHED OPPORTUNITIES */}
                    <div className="lg:col-span-8">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg sm:text-xl font-bold text-[#0F2A4A]">Matched for you</h2>
                            <button
                                onClick={() => setShowAll(!showAll)}
                                className="text-xs sm:text-sm font-semibold text-[#E0642F] hover:text-[#c45322] flex items-center gap-1 transition cursor-pointer"
                            >
                                <span>{showAll ? 'Show less' : 'View all'}</span>
                                <span className="text-base leading-none">→</span>
                            </button>
                        </div>

                        {/* OPPORTUNITY CARDS */}
                        <div className="space-y-3.5">
                            {displayedOpportunities.map((opp) => {
                                const isApplied = appliedOpps[opp.id];
                                return (
                                    <div
                                        key={opp.id}
                                        onClick={() => setSelectedOpp(opp)}
                                        className="bg-white border border-[#E4E7EC] rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 hover:shadow-xs transition duration-150 cursor-pointer group"
                                    >
                                        {/* Card Left: Placeholder Logo + Info */}
                                        <div className="flex items-start sm:items-center gap-4">
                                            {/* Logo Placeholder */}
                                            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#F5F6F8] flex items-center justify-center text-[#16375E] flex-shrink-0 group-hover:bg-[#E7ECF3] transition-colors">
                                                <Building2 size={22} strokeWidth={1.8} className="text-[#0F2A4A]" />
                                            </div>

                                            {/* Details */}
                                            <div>
                                                <h3 className="text-sm sm:text-[15.5px] font-semibold text-[#0F2A4A] group-hover:text-[#E0642F] transition-colors">
                                                    {opp.title}
                                                </h3>
                                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-[#8A93A0] mt-1.5">
                                                    <span className="flex items-center gap-1">
                                                        <MapPin size={13} className="text-[#8A93A0]" />
                                                        {opp.location}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock size={13} className="text-[#8A93A0]" />
                                                        {opp.hours}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Briefcase size={13} className="text-[#8A93A0]" />
                                                        {opp.type}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Card Right: Match percentage badge */}
                                        <div className="flex sm:flex-col items-center justify-between sm:justify-center text-center pl-15 sm:pl-0 sm:border-l sm:border-transparent">
                                            <div className="text-left sm:text-center">
                                                <div className="font-bold text-[#0F9D6E] text-xl sm:text-[22px] leading-tight">
                                                    {opp.match}%
                                                </div>
                                                <div className="text-[11px] text-[#8A93A0] font-medium lowercase">
                                                    match
                                                </div>
                                            </div>

                                            {isApplied && (
                                                <span className="text-[11px] font-semibold text-[#0B7754] bg-[#E4F5EE] px-2 py-0.5 rounded-full sm:mt-1">
                                                    Applied
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: PROFILE CARD & UPCOMING */}
                    <div className="lg:col-span-4 space-y-5">
                        {/* PROFILE CARD */}
                        <div className="bg-white border border-[#E4E7EC] rounded-xl p-6 text-center">
                            {/* Avatar */}
                            <div className="w-16 h-16 rounded-full bg-[#16375E] text-white flex items-center justify-center font-bold text-xl mx-auto mb-3.5 tracking-wide shadow-sm">
                                RK
                            </div>

                            {/* Name & Title */}
                            <h3 className="text-base font-bold text-[#0F2A4A]">{fullName}</h3>
                            <p className="text-xs sm:text-[13px] text-[#5B6472] mt-0.5">
                                {userExperience} · {userRole}
                            </p>

                            {/* Progress Track */}
                            <div className="w-full h-2 bg-[#F1F3F5] rounded-full overflow-hidden mt-4 mb-2">
                                <div
                                    className="h-full bg-[#0F9D6E] rounded-full transition-all duration-700 ease-out"
                                    style={{ width: '85%' }}
                                />
                            </div>

                            {/* Completion Text */}
                            <p className="text-xs text-[#5B6472]">Profile 85% complete</p>

                            {/* Action Button */}
                            <button
                                onClick={() => navigate('/profile')}
                                className="w-full mt-4 py-2 px-4 rounded-lg border border-[#E4E7EC] text-xs sm:text-sm font-semibold text-[#0F2A4A] hover:bg-[#F5F6F8] hover:border-slate-300 transition duration-150 cursor-pointer"
                            >
                                Complete profile
                            </button>
                        </div>

                        {/* UPCOMING WIDGET */}
                        <div className="bg-white border border-[#E4E7EC] rounded-xl p-5 text-left">
                            <h3 className="text-sm font-bold text-[#0F2A4A] mb-3">Upcoming</h3>
                            <p className="text-xs sm:text-[13.5px] font-semibold text-[#0F2A4A] mb-1">
                                Interview — Fintech startup
                            </p>
                            <p className="text-xs text-[#5B6472]">Tomorrow, 4:00 PM</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* DETAIL MODAL (Matching Screen 3 of SeniorPro prototype) */}
            {selectedOpp && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
                    <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
                        {/* Modal Header */}
                        <div className="flex items-start justify-between p-6 border-b border-[#E4E7EC]">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-[#F5F6F8] flex items-center justify-center text-[#0F2A4A] flex-shrink-0">
                                    <Building2 size={24} />
                                </div>
                                <div>
                                    <h2 className="text-lg sm:text-xl font-bold text-[#0F2A4A] leading-snug">
                                        {selectedOpp.title}
                                    </h2>
                                    <p className="text-xs sm:text-sm text-[#5B6472] mt-0.5">
                                        {selectedOpp.company} &nbsp;·&nbsp; Posted {selectedOpp.posted}
                                    </p>
                                    <div className="flex flex-wrap gap-2 mt-2.5">
                                        <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-[#E7ECF3] text-[#0F2A4A]">
                                            {selectedOpp.type}
                                        </span>
                                        <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-[#E4F5EE] text-[#0B7754]">
                                            {selectedOpp.location}
                                        </span>
                                        <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-[#FBF0DC] text-[#8A6412]">
                                            {selectedOpp.hours}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setSelectedOpp(null)}
                                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition cursor-pointer"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto space-y-5 text-sm">
                            {/* Match Card Strip */}
                            <div className="flex items-center justify-between p-4 rounded-xl bg-[#F8FAFC] border border-[#E4E7EC]">
                                <div>
                                    <span className="text-xs text-[#8A93A0] block">Match score</span>
                                    <span className="text-2xl font-bold text-[#0F9D6E]">
                                        {selectedOpp.match}% match
                                    </span>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs text-[#8A93A0] block">Compensation</span>
                                    <span className="text-sm font-bold text-[#0F2A4A]">
                                        {selectedOpp.compensation}
                                    </span>
                                </div>
                            </div>

                            {/* About */}
                            <div>
                                <h3 className="font-bold text-[#0F2A4A] text-sm mb-1.5">About this opportunity</h3>
                                <p className="text-[#5B6472] leading-relaxed text-xs sm:text-sm">
                                    {selectedOpp.description}
                                </p>
                            </div>

                            {/* Responsibilities */}
                            <div>
                                <h3 className="font-bold text-[#0F2A4A] text-sm mb-2">What you'll do</h3>
                                <ul className="list-disc pl-5 space-y-1.5 text-[#5B6472] text-xs sm:text-sm">
                                    {selectedOpp.responsibilities.map((r, i) => (
                                        <li key={i}>{r}</li>
                                    ))}
                                </ul>
                            </div>

                            {/* Requirements */}
                            <div>
                                <h3 className="font-bold text-[#0F2A4A] text-sm mb-2">Required experience</h3>
                                <ul className="list-disc pl-5 space-y-1.5 text-[#5B6472] text-xs sm:text-sm">
                                    {selectedOpp.requirements.map((req, i) => (
                                        <li key={i}>{req}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 sm:p-5 border-t border-[#E4E7EC] bg-[#FAFAFB] flex items-center justify-between gap-3">
                            <button
                                onClick={() => handleSave(selectedOpp)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-xs sm:text-sm font-semibold transition cursor-pointer ${
                                    savedOpps[selectedOpp.id]
                                        ? 'bg-amber-50 border-amber-300 text-amber-800'
                                        : 'border-[#E4E7EC] text-[#0F2A4A] hover:bg-slate-100'
                                }`}
                            >
                                <Bookmark size={15} />
                                {savedOpps[selectedOpp.id] ? 'Saved' : 'Save for later'}
                            </button>

                            <button
                                onClick={() => handleApply(selectedOpp)}
                                disabled={appliedOpps[selectedOpp.id]}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition cursor-pointer ${
                                    appliedOpps[selectedOpp.id]
                                        ? 'bg-[#E4F5EE] text-[#0B7754] cursor-default'
                                        : 'bg-[#E0642F] hover:bg-[#c95321] text-white shadow-sm'
                                }`}
                            >
                                {appliedOpps[selectedOpp.id] ? (
                                    <>
                                        <Check size={16} /> Applied
                                    </>
                                ) : (
                                    'Apply now'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
