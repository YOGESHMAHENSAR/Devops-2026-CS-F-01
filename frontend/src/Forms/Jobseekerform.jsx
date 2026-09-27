import React, { useState, useEffect } from 'react';
import {
    User, Briefcase, Phone, Award, Link as LinkIcon, Building,
    MapPin, Globe, Compass, DollarSign, Clock, CheckCircle,
    Eye, EyeOff, Sparkles, RefreshCw, Moon, Sun,
    X, FileText, ChevronDown
} from 'lucide-react';

const JOB_TYPES = [
    'Consultancy',
    'Full-Time',
    'Part-Time',
    'Contract',
    'Freelance',
    'Internship'
];

const WORK_MODES = [
    'Remote',
    'On-site',
    'Hybrid'
];

const DURATIONS = [
    'Yearly',
    'Monthly',
    'Hourly',
    'Per Project'
];

// const SAMPLE_PROFILE = {
//     headline: 'Senior Full Stack Software Architect',
//     phoneNumber: '+91 98765 43210',
//     experience: '8',
//     skills: ['React', 'Node.js', 'TypeScript', 'Tailwind CSS', 'Material UI', 'PostgreSQL', 'AWS'],
//     resumeUrl: 'https://linkedin.com/in/alex-developer-resume',
//     industry: 'Information Technology & Services',
//     jobType: 'Consultancy',
//     mode: 'Remote',
//     country: 'INDIA',
//     state: 'Karnataka',
//     city: 'Bengaluru',
//     amount: '2400000',
//     currency: 'INR',
//     duration: 'Yearly'
// };

// MUI Outlined Input component clone
const MuiTextField = ({
                          label,
                          name,
                          value,
                          onChange,
                          placeholder,
                          type = 'text',
                          error,
                          helperText,
                          icon: Icon,
                          endAdornment,
                          required = false,
                          isDark = false
                      }) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = value !== undefined && value !== null && value.toString().trim() !== '';
    const isFloated = isFocused || hasValue;

    return (
        <div className="w-full mb-4">
            <div
                className={`relative flex items-center rounded transition-all duration-200 border ${
                    error
                        ? 'border-red-500 focus-within:ring-1 focus-within:ring-red-500'
                        : isFocused
                            ? 'border-[#1976d2] ring-1 ring-[#1976d2]'
                            : isDark
                                ? 'border-gray-700 hover:border-gray-500 bg-[#1e1e1e]'
                                : 'border-gray-300 hover:border-gray-900 bg-white'
                }`}
            >
                {/* Floating Label */}
                <label
                    className={`absolute left-3 transition-all duration-200 pointer-events-none px-1 rounded z-10 ${
                        isFloated
                            ? `-top-2.5 text-xs font-medium ${
                                error
                                    ? `text-red-500 ${isDark ? 'dark:bg-[#1e1e1e]' : 'bg-white'}`
                                    : isFocused
                                        ? `text-[#1976d2] ${isDark ? 'dark:bg-[#1e1e1e]' : 'bg-white'}`
                                        : isDark ? 'text-gray-400 bg-white dark:bg-[#1e1e1e]' : 'text-gray-600 bg-white'
                            }`
                            : `top-3 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`
                    } ${Icon && !isFloated ? 'pl-7' : ''}`}
                >
                    {label} {required && <span className="text-red-500">*</span>}
                </label>

                {/* Start Icon */}
                {Icon && (
                    <div className={`pl-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        <Icon size={18} />
                    </div>
                )}

                {/* Native Input */}
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={isFocused ? placeholder : ''}
                    className={`w-full py-2.5 px-3 rounded text-sm outline-none bg-transparent ${
                        isDark ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'
                    }`}
                />

                {/* End Adornment */}
                {endAdornment && <div className="pr-3">{endAdornment}</div>}
            </div>

            {/* Helper text or error message */}
            {(helperText || error) && (
                <p className={`text-xs mt-1 ml-3 ${error ? 'text-red-500 font-medium' : isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {error || helperText}
                </p>
            )}
        </div>
    );
};

const MuiSelect = ({
                       label,
                       name,
                       value,
                       onChange,
                       options = [],
                       icon: Icon,
                       required = false,
                       isDark = false
                   }) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = value !== undefined && value !== null && value !== '';

    return (
        <div className="w-full mb-4 relative">
            <div
                className={`relative flex items-center rounded border transition-all duration-200 ${
                    isFocused
                        ? `border-[#1976d2] ring-1 ring-[#1976d2] ${isDark ? 'dark:bg-[#1e1e1e]' : 'bg-white'}`
                        : isDark
                            ? 'border-gray-700 hover:border-gray-500 bg-[#1e1e1e]'
                            : 'border-gray-300 hover:border-gray-900 bg-white'
                }`}
            >
                <label
                    className={`absolute left-3 -top-2.5 text-xs font-medium px-1 rounded z-10 pointer-events-none ${
                        isFocused
                            ? `text-[#1976d2] ${isDark ? 'dark:bg-[#1e1e1e]' : 'bg-white'}`
                            : isDark ? 'text-gray-400 bg-[#1e1e1e]' : 'text-gray-600 bg-white'
                    }`}
                >
                    {label} {required && <span className="text-red-500">*</span>}
                </label>

                {Icon && (
                    <div className={`pl-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        <Icon size={18} />
                    </div>
                )}

                <select
                    name={name}
                    value={value}
                    onChange={onChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className={`w-full py-2.5 px-3 pr-8 rounded text-sm outline-none bg-transparent appearance-none cursor-pointer ${
                        isDark ? 'text-white bg-[#1e1e1e]' : 'text-gray-900 bg-white'
                    }`}
                >
                    {!hasValue && <option value="" disabled hidden>Select {label}</option>}
                    {options.map((opt, idx) => (
                        typeof opt === 'string' ? (
                            <option key={idx} value={opt} className={isDark ? 'bg-[#1e1e1e] text-white' : 'bg-white text-gray-900'}>
                                {opt}
                            </option>
                        ) : (
                            <option key={opt.code || idx} value={opt.code} className={isDark ? 'bg-[#1e1e1e] text-white' : 'bg-white text-gray-900'}>
                                {opt.flag ? `${opt.flag}  ` : ''}{opt.name} {opt.symbol ? `(${opt.symbol})` : ''}
                            </option>
                        )
                    ))}
                </select>

                <div className="absolute right-3 pointer-events-none text-gray-500">
                    <ChevronDown size={18} />
                </div>
            </div>
        </div>
    );
};

const MuiChipInput = ({ label, skills, onAddSkill, onDeleteSkill, required= false, isDark= false }) => {
    const [inputValue, setInputValue] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            if (inputValue.trim()) {
                onAddSkill(inputValue.trim());
                setInputValue('');
            }
        }
    };

    const handleAddBtn = () => {
        if (inputValue.trim()) {
            onAddSkill(inputValue.trim());
            setInputValue('');
        }
    };

    return (
        <div className="w-full mb-4">
            <div
                className={`relative flex flex-wrap items-center gap-1.5 p-2.5 pt-3 rounded border transition-all duration-200 min-h-11 ${
                    isFocused
                        ? 'border-[#1976d2] ring-1 ring-[#1976d2]'
                        : isDark
                            ? 'border-gray-700 hover:border-gray-500 bg-[#1e1e1e]'
                            : 'border-gray-300 hover:border-gray-900 bg-white'
                }`}
            >
                <label
                    className={`absolute left-3 -top-2.5 text-xs font-medium px-1 rounded z-10 pointer-events-none ${
                        isFocused
                            ? `text-[#1976d2] ${isDark ? 'dark:bg-[#1e1e1e]' : 'bg-white'}`
                            : isDark ? 'text-gray-400 bg-[#1e1e1e]' : 'text-gray-600 bg-white'
                    }`}
                >
                    {label} {required && <span className="text-red-500">*</span>}
                </label>

                {skills.map((skill, index) => (
                    <span
                        key={index}
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#e3f2fd] text-[#1976d2] dark:bg-[#0d47a1]/40 border border-[#90caf9]/50 animate-fadeIn"
                    >
            {skill}
                        <button
                            type="button"
                            onClick={() => onDeleteSkill(skill)}
                            className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5 transition-colors"
                        >
              <X size={12} />
            </button>
          </span>
                ))}

                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={skills.length === 0 ? "Type skill & press Enter (e.g. React, Node)" : "Add skill..."}
                    className={`flex-1 min-w-30 text-sm outline-none bg-transparent ${
                        isDark ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'
                    }`}
                />

                {inputValue && (
                    <button
                        type="button"
                        onClick={handleAddBtn}
                        className="text-xs bg-[#1976d2] text-white px-2 py-1 rounded hover:bg-[#1565c0] transition"
                    >
                        Add
                    </button>
                )}
            </div>
            <p className={`text-[11px] mt-1 ml-3 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                Press Enter or comma to create skill tags
            </p>
        </div>
    );
};

export default function App() {
    const [isDark, setIsDark] = useState(false);
    const [showPreview, setShowPreview] = useState(true);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    // Form State initialized with defaults matching user screenshot
    const [formData, setFormData] = useState({
        headline: '',
        phoneNumber: '',
        experience: '',
        skills: ['React', 'TypeScript', 'Tailwind CSS'],
        resumeUrl: '',
        industry: '',
        jobType: 'Consultancy',
        mode: 'Remote',
        country: 'INDIA',
        state: '',
        city: '',
        amount: '',
        currency: 'INR',
        duration: 'Yearly'
    });

    const [errors, setErrors] = useState({});

    // Auto hide toast
    useEffect(() => {
        if (toastMessage) {
            const timer = setTimeout(() => setToastMessage(''), 3500);
            return () => clearTimeout(timer);
        }
    }, [toastMessage]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Clear error on change
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    const handleAddSkill = (newSkill) => {
        if (!formData.skills.includes(newSkill)) {
            setFormData((prev) => ({ ...prev, skills: [...prev.skills, newSkill] }));
        }
    };

    const handleDeleteSkill = (skillToRemove) => {
        setFormData((prev) => ({
            ...prev,
            skills: prev.skills.filter((s) => s !== skillToRemove)
        }));
    };

    // const handleAutofill = () => {
    //     setFormData(SAMPLE_PROFILE);
    //     setErrors({});
    //     setToastMessage('✨ Populated sample profile details!');
    // };

    const handleReset = () => {
        setFormData({
            headline: '',
            phoneNumber: '',
            experience: '',
            skills: [],
            resumeUrl: '',
            industry: '',
            jobType: 'Consultancy',
            mode: 'Remote',
            country: 'INDIA',
            state: '',
            city: '',
            amount: '',
            currency: 'INR',
            duration: 'Yearly'
        });
        setErrors({});
        setToastMessage('Cleared all form fields');
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.headline.trim()) newErrors.headline = 'Headline title is required';
        if (!formData.phoneNumber || !/^\+?[0-9\s-]{8,15}$/.test(formData.phoneNumber)) {
            newErrors.phoneNumber = 'Enter a valid phone number';
        }
        if (!formData.experience || (isNaN(formData.experience) || Number(formData.experience) < 0)) {
            newErrors.experience = 'Experience must be a positive number';
        }
        if (!formData.resumeUrl || !/^https?:\/\/.+/.test(formData.resumeUrl)) {
            newErrors.resumeUrl = 'URL must start with http:// or https://';
        }
        if (!formData.industry) {
            newErrors.industry = 'Please provide your respective industry';
        }
        if (!formData.city) {
            newErrors.city = 'Please provide your city';
        }
        if (!formData.amount || isNaN(formData.amount)) {
            newErrors.amount = 'Amount must be numeric';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            setIsSubmitted(true);
            setToastMessage('🎉 Profile details saved successfully!');
        } else {
            setToastMessage('⚠️ Please fix the highlighted errors in the form.');
        }
    };

    // Form completion progress percentage calculation
    const completedFieldsCount = Object.entries(formData).filter(([key, val]) => {
        if (Array.isArray(val)) return val.length > 0;
        return val !== undefined && val !== null && val.toString().trim() !== '';
    }).length;
    const totalFields = Object.keys(formData).length;
    const progressPercent = Math.round((completedFieldsCount / totalFields) * 100);

    return (
        <div className={`min-h-screen font-sans transition-colors duration-300 ${isDark ? 'bg-[#121212] text-gray-100' : 'bg-[#f4f6f8] text-gray-800'}`}>

            {/* MUI Top Navigation Bar */}
            <header className={`sticky top-0 z-30 shadow-md transition-colors ${isDark ? 'bg-[#1e1e1e] border-b border-gray-800' : 'bg-[#1976d2] text-white'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                            <User className="text-white" size={24} />
                        </div>
                        <div>
                            <h3 className={`text-lg font-bold tracking-tight flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                Manage Profile Details
                            </h3>
                            <p className="text-xs text-blue-100 opacity-90 hidden sm:block">Update your professional background & job preferences</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/*<button
                            onClick={handleAutofill}
                            className="px-3 py-1.5 text-xs font-medium rounded-md bg-white/10 hover:bg-white/20 text-white transition flex items-center gap-1.5 border border-white/20"
                            title="Fill form with sample data"
                        >
                            <Sparkles size={14} />
                            <span className="hidden md:inline">Auto Fill</span>
                        </button>*/}

                        <button
                            onClick={() => setShowPreview(!showPreview)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition flex items-center gap-1.5 ${
                                showPreview
                                    ? 'bg-white text-[#1976d2] shadow-sm'
                                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                            }`}
                        >
                            {showPreview ? <EyeOff size={14} /> : <Eye size={14} />}
                            <span className="hidden sm:inline">{showPreview ? 'Hide Preview' : 'Live Card'}</span>
                        </button>

                        <button
                            onClick={() => setIsDark(!isDark)}
                            className="p-2 rounded-full hover:bg-white/10 text-white transition"
                            title="Toggle Light/Dark Theme"
                        >
                            {isDark ? <Sun size={18} className="text-amber-300" /> : <Moon size={18} />}
                        </button>
                    </div>
                </div>

                {/* Form completion progress bar */}
                <div className="w-full bg-black/10 h-1">
                    <div
                        className="bg-emerald-400 h-1 transition-all duration-500 ease-out"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
            </header>

            {/* Main Container */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Toast Notification */}
                {toastMessage && (
                    <div className="fixed bottom-6 right-6 z-50 animate-bounce transition-all">
                        <div className="bg-gray-900 text-white text-sm px-4 py-3 rounded-lg shadow-xl flex items-center gap-2 border border-gray-700">
                            <span>{toastMessage}</span>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Main MUI Form Card (8 Cols or 12 Cols depending on preview) */}
                    <div className={`transition-all duration-300 ${showPreview ? 'lg:col-span-7 xl:col-span-8' : 'lg:col-span-12'}`}>

                        <div className={`rounded-xl shadow-lg transition-colors border ${
                            isDark ? 'bg-[#1e1e1e] border-gray-800' : 'bg-white border-gray-200/80'
                        }`}>

                            {/* MUI Card Header */}
                            <div className={`p-6 border-b flex flex-wrap items-center justify-between gap-4 ${isDark ? 'border-gray-800' : 'border-gray-100'}`}>
                                <div>
                                    <h3 className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        Manage Your Profile Details
                                    </h3>
                                    <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                        Please complete your basic profile, location and expected salary details.
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={handleReset}
                                        className={`text-xs px-3 py-1.5 rounded transition flex items-center gap-1 border ${
                                            isDark
                                                ? 'border-gray-700 text-gray-300 hover:bg-gray-800'
                                                : 'border-gray-300 text-gray-600 hover:bg-gray-100'
                                        }`}
                                    >
                                        <RefreshCw size={12} /> Clear
                                    </button>
                                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                                        progressPercent === 100
                                            ? `${!isDark ? 'bg-emerald-100 text-emerald-800' : 'bg-emerald-700/30 text-emerald-100'}`
                                            : 'bg-blue-50 text-blue-700 dark:bg-blue-900/30'
                                    }`}>
                    {progressPercent}% Completed
                  </span>
                                </div>
                            </div>

                            {/* Form Content */}
                            <form onSubmit={handleSubmit} className="p-6">

                                {/* SECTION 1: GENERAL PROFILE INFORMATION */}
                                {/* Row 1: Headline */}
                                <div className="grid grid-cols-1 gap-4">
                                    <MuiTextField
                                        label="Headline"
                                        name="headline"
                                        value={formData.headline}
                                        onChange={handleChange}
                                        placeholder="Your professional title (e.g. Senior Full Stack Engineer)"
                                        icon={Briefcase}
                                        error={errors.headline}
                                        required
                                        isDark={isDark}
                                    />
                                </div>

                                {/* Row 2: Phone Number & Experience */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <MuiTextField
                                        label="Phone Number"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        placeholder="+91 98765 43210"
                                        icon={Phone}
                                        error={errors.phoneNumber}
                                        isDark={isDark}
                                    />

                                    <MuiTextField
                                        label="Experience"
                                        name="experience"
                                        value={formData.experience}
                                        onChange={handleChange}
                                        placeholder="Enter years of experience(i.e. 5, 10, 15)"
                                        icon={Award}
                                        error={errors.experience}
                                        type="number"
                                        required
                                        isDark={isDark}
                                    />
                                </div>

                                {/* Row 3: Skills & Resume URL */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <MuiChipInput
                                        label="Skills"
                                        skills={formData.skills}
                                        onAddSkill={handleAddSkill}
                                        onDeleteSkill={handleDeleteSkill}
                                        required
                                        isDark={isDark}
                                    />

                                    <MuiTextField
                                        label="Resume URL"
                                        name="resumeUrl"
                                        value={formData.resumeUrl}
                                        onChange={handleChange}
                                        placeholder="https://drive.google.com/your-resume.pdf"
                                        icon={LinkIcon}
                                        error={errors.resumeUrl}
                                        isDark={isDark}
                                    />
                                </div>

                                {/* Row 4: Industry */}
                                <div className="grid grid-cols-1 gap-4">
                                    <MuiTextField
                                        label="Industry"
                                        name="industry"
                                        value={formData.industry}
                                        onChange={handleChange}
                                        placeholder="e.g. Information Technology, Healthcare, Finance"
                                        icon={Building}
                                        error={errors.industry}
                                        required
                                        isDark={isDark}
                                    />
                                </div>

                                {/* Row 5: Job Type & Mode */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <MuiSelect
                                        label="Job Type"
                                        name="jobType"
                                        value={formData.jobType}
                                        onChange={handleChange}
                                        options={JOB_TYPES}
                                        icon={Briefcase}
                                        isDark={isDark}
                                    />

                                    <MuiSelect
                                        label="Mode"
                                        name="mode"
                                        value={formData.mode}
                                        onChange={handleChange}
                                        options={WORK_MODES}
                                        icon={Compass}
                                        isDark={isDark}
                                    />
                                </div>

                                {/* SECTION 2: LOCATION */}
                                <div className="mt-6 mb-4 pt-4 border-t border-dashed border-gray-300 dark:border-gray-800">
                                    <h3 className={`text-base font-bold flex items-center gap-2 mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        <MapPin size={18} className="text-[#1976d2]" />
                                        Location:
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <MuiTextField
                                            label="Country"
                                            name="country"
                                            value={formData.country}
                                            onChange={handleChange}
                                            icon={Globe}
                                            isDark={isDark}
                                        />

                                        <MuiTextField
                                            label="State"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleChange}
                                            placeholder="e.g. Karnataka"
                                            isDark={isDark}
                                        />

                                        <MuiTextField
                                            label="City"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            placeholder="e.g. Bengaluru"
                                            error={errors.city}
                                            required
                                            isDark={isDark}
                                        />
                                    </div>
                                </div>

                                {/* SECTION 3: EXPECTED SALARY */}
                                <div className="mt-6 mb-6 pt-4 border-t border-dashed border-gray-300 dark:border-gray-800">
                                    <h3 className={`text-base font-bold flex items-center gap-2 mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        <DollarSign size={18} className="text-[#1976d2]" />
                                        Expected Salary:
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <MuiTextField
                                            label="Amount"
                                            name="amount"
                                            value={formData.amount}
                                            onChange={handleChange}
                                            placeholder="e.g. 1500000"
                                            icon={DollarSign}
                                            error={errors.amount}
                                            type="number"
                                            required
                                            isDark={isDark}
                                        />

                                        <MuiTextField
                                            label="Currency"
                                            name="currency"
                                            value={formData.currency}
                                            onChange={handleChange}
                                            isDark={isDark}
                                        />

                                        <MuiSelect
                                            label="Duration"
                                            name="duration"
                                            value={formData.duration}
                                            onChange={handleChange}
                                            options={DURATIONS}
                                            icon={Clock}
                                            isDark={isDark}
                                        />
                                    </div>
                                </div>

                                {/* SUBMIT BUTTON - Styled identically to MUI Contained Primary Button */}
                                <div className="flex flex-col items-center justify-center pt-4">
                                    <button
                                        type="submit"
                                        className="w-full sm:w-auto min-w-[180px] bg-[#1976d2] hover:bg-[#1565c0] active:bg-[#0d47a1] text-white font-medium text-sm py-2.5 px-8 rounded shadow-md hover:shadow-lg uppercase tracking-wider transition-all duration-200 transform active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        <CheckCircle size={18} />
                                        Submit
                                    </button>
                                </div>

                            </form>
                        </div>
                    </div>

                    {}
                    {showPreview && (
                        <div className="lg:col-span-5 xl:col-span-4 sticky top-24">
                            <div className={`rounded-xl shadow-lg border p-6 transition-colors ${
                                isDark ? 'bg-[#1e1e1e] border-gray-800' : 'bg-white border-gray-200/80'
                            }`}>

                                {/* Header Badge */}
                                <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-800">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#1976d2] flex items-center gap-1.5">
                    <Sparkles size={14} /> Live Profile Card
                  </span>
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${!isDark ? 'bg-emerald-100 text-emerald-800' : 'bg-emerald-700/30 text-emerald-100'}`}>
                    Active Preview
                  </span>
                                </div>

                                {/* Card Main Info */}
                                <div className="mt-4 text-center pb-5 border-b border-gray-200 dark:border-gray-800">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#1976d2] to-indigo-500 text-white text-xl font-bold flex items-center justify-center mx-auto shadow-md mb-3">
                                        {formData.headline ? formData.headline.charAt(0).toUpperCase() : 'P'}
                                    </div>

                                    <h3 className={`font-bold text-lg leading-snug ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        {formData.headline || 'Your Headline Title'}
                                    </h3>

                                    <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
                                        {formData.jobType && (
                                            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/30 font-medium">
                        {formData.jobType}
                      </span>
                                        )}
                                        {formData.mode && (
                                            <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 dark:bg-purple-900/30 font-medium">
                        {formData.mode}
                      </span>
                                        )}
                                    </div>
                                </div>

                                {/* Details Breakdown */}
                                <div className="py-4 space-y-3 text-xs">

                                    {/* Experience */}
                                    <div className="flex items-center justify-between">
                    <span className={`flex items-center gap-1.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      <Award size={14} /> Experience:
                    </span>
                                        <span className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                      {formData.experience ? `${formData.experience} Years` : 'Not specified'}
                    </span>
                                    </div>

                                    {/* Industry */}
                                    <div className="flex items-center justify-between">
                    <span className={`flex items-center gap-1.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      <Building size={14} /> Industry:
                    </span>
                                        <span className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                      {formData.industry || 'Not specified'}
                    </span>
                                    </div>

                                    {/* Location */}
                                    <div className="flex items-center justify-between">
                    <span className={`flex items-center gap-1.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      <MapPin size={14} /> Location:
                    </span>
                                        <span className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                      {[formData.city, formData.state, formData.country].filter(Boolean).join(', ') || 'INDIA'}
                    </span>
                                    </div>

                                    {/* Expected Salary */}
                                    <div className="flex items-center justify-between">
                    <span className={`flex items-center gap-1.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      <DollarSign size={14} /> Expected Salary:
                    </span>
                                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {formData.amount
                          ? `${formData.currency} ${Number(formData.amount).toLocaleString()} / ${formData.duration}`
                          : 'Not set'}
                    </span>
                                    </div>

                                    {/* Phone */}
                                    {formData.phoneNumber && (
                                        <div className="flex items-center justify-between">
                      <span className={`flex items-center gap-1.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        <Phone size={14} /> Phone:
                      </span>
                                            <span className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                        {formData.phoneNumber}
                      </span>
                                        </div>
                                    )}

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

                                {/* Skills Chips */}
                                <div className="pt-3 border-t border-gray-200 dark:border-gray-800">
                                    <p className={`text-xs font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Key Skills:
                                    </p>
                                    <div className="flex flex-wrap gap-1.5 mt-3">
                                        {formData.skills.length > 0 ? (
                                            formData.skills.map((s, i) => (
                                                <span key={i} className="text-[11px] px-2 py-0.5 rounded bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                          {s}
                        </span>
                                            ))
                                        ) : (
                                            <span className="text-xs text-gray-400 italic">No skills added yet</span>
                                        )}
                                    </div>
                                </div>

                            </div>
                        </div>
                    )}

                </div>
            </main>

            {/* {}
            {isSubmitted && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
                    <div className={`w-full max-w-lg rounded-xl shadow-2xl p-6 border ${
                        isDark ? 'bg-[#1e1e1e] border-gray-800 text-white' : 'bg-white border-gray-100 text-gray-900'
                    }`}>
                        <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-800">
                            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                                <CheckCircle size={22} />
                                <h3 className="font-bold text-lg">Profile Submitted Successfully</h3>
                            </div>
                            <button
                                onClick={() => setIsSubmitted(false)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-white p-1"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="mt-4">
                            <p className={`text-xs mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                Here is the JSON payload structure generated from your profile details:
                            </p>

                            <pre className="p-3 rounded-lg text-xs font-mono bg-gray-950 text-emerald-400 overflow-x-auto max-h-60 border border-gray-800">
                {JSON.stringify(formData, null, 2)}
              </pre>
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(JSON.stringify(formData, null, 2));
                                    setToastMessage('Copied JSON to clipboard!');
                                }}
                                className={`px-4 py-2 text-xs font-medium rounded border transition flex items-center gap-1.5 ${
                                    isDark
                                        ? 'border-gray-700 text-gray-300 hover:bg-gray-800'
                                        : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                <Copy size={14} /> Copy JSON
                            </button>

                            <button
                                onClick={() => setIsSubmitted(false)}
                                className="px-5 py-2 text-xs font-medium rounded bg-[#1976d2] text-white hover:bg-[#1565c0] transition"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )} */}

        </div>
    );
}