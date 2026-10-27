import { useEffect, useState } from "react";
import { BriefcaseBusiness, MapPin, Search } from "lucide-react";
import { applyToJob, getMyApplications, searchJobs } from "../api/jobs.js";

const JOB_TYPES = ["Consultancy", "Contract", "Advisory", "Part-time", "Full-time", "Internship"];
const WORK_MODES = ["Remote", "Hybrid", "On-site"];
const inputClassName = "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

const EMPTY_FILTERS = { q: "", city: "", jobType: "", workMode: "" };

function formatLocation(location = {}) {
    return [location.city, location.state, location.country].filter(Boolean).join(", ") || "Location not specified";
}

export default function Opportunity() {
    const [filters, setFilters] = useState(EMPTY_FILTERS);
    const [jobs, setJobs] = useState([]);
    const [appliedJobIds, setAppliedJobIds] = useState(() => new Set());
    const [isLoading, setIsLoading] = useState(true);
    const [loadingJobId, setLoadingJobId] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    async function loadJobs(searchFilters) {
        setIsLoading(true);
        setError("");

        try {
            const result = await searchJobs(searchFilters);
            if (!result.ok) {
                throw new Error(result.body.message || "Unable to search job postings.");
            }
            setJobs(Array.isArray(result.body.data) ? result.body.data : []);
        } catch (loadError) {
            setError(loadError.message);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        let isCurrent = true;
        searchJobs(EMPTY_FILTERS).then((result) => {
            if (!result.ok) {
                throw new Error(result.body.message || "Unable to load job postings.");
            }
            if (isCurrent) {
                setJobs(Array.isArray(result.body.data) ? result.body.data : []);
            }
        }).catch((loadError) => {
            if (isCurrent) {
                setError(loadError.message);
            }
        }).finally(() => {
            if (isCurrent) {
                setIsLoading(false);
            }
        });

        getMyApplications().then((result) => {
            if (!result.ok) {
                throw new Error(result.body.message || "Unable to load your applications.");
            }
            if (isCurrent) {
                setAppliedJobIds(new Set((result.body.data || []).map((application) => String(application.jobId))));
            }
        }).catch((loadError) => {
            if (isCurrent) {
                setError(loadError.message);
            }
        });

        return () => {
            isCurrent = false;
        };
    }, []);

    function handleFilterChange(event) {
        const { name, value } = event.target;
        setFilters((current) => ({ ...current, [name]: value }));
    }

    function handleSearch(event) {
        event.preventDefault();
        loadJobs(filters);
    }

    async function handleApply(job) {
        setLoadingJobId(job._id);
        setError("");
        setMessage("");

        try {
            const result = await applyToJob(job._id);
            if (!result.ok) {
                throw new Error(result.body.message || "Unable to submit your application.");
            }
            setAppliedJobIds((current) => new Set(current).add(String(job._id)));
            setMessage(result.body.message || `Applied to ${job.title}.`);
        } catch (applyError) {
            setError(applyError.message);
        } finally {
            setLoadingJobId("");
        }
    }

    return (
        <main className="min-h-[calc(100vh-4rem)] bg-slate-50 px-4 py-10 sm:px-6">
            <div className="mx-auto max-w-6xl">
                <header className="mb-7">
                    <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Opportunities</p>
                    <h1 className="mt-1 text-3xl font-bold text-slate-900">Find a job that fits</h1>
                    <p className="mt-2 text-sm text-slate-600">Search current openings posted by recruiters and apply using your job seeker profile.</p>
                </header>

                <form onSubmit={handleSearch} className="mb-7 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto] md:items-end">
                    <div>
                        <label htmlFor="jobQuery" className="mb-1 block text-sm font-medium text-slate-700">Keyword or skill</label>
                        <input id="jobQuery" name="q" value={filters.q} onChange={handleFilterChange} className={inputClassName} placeholder="e.g. product manager, React" />
                    </div>
                    <div>
                        <label htmlFor="jobCityFilter" className="mb-1 block text-sm font-medium text-slate-700">City</label>
                        <input id="jobCityFilter" name="city" value={filters.city} onChange={handleFilterChange} className={inputClassName} placeholder="Any city" />
                    </div>
                    <div>
                        <label htmlFor="jobTypeFilter" className="mb-1 block text-sm font-medium text-slate-700">Job type</label>
                        <select id="jobTypeFilter" name="jobType" value={filters.jobType} onChange={handleFilterChange} className={inputClassName}>
                            <option value="">All types</option>
                            {JOB_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="workModeFilter" className="mb-1 block text-sm font-medium text-slate-700">Work mode</label>
                        <select id="workModeFilter" name="workMode" value={filters.workMode} onChange={handleFilterChange} className={inputClassName}>
                            <option value="">All modes</option>
                            {WORK_MODES.map((mode) => <option key={mode} value={mode}>{mode}</option>)}
                        </select>
                    </div>
                    <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
                        <Search size={17} /> Search
                    </button>
                </form>

                {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</p>}
                {message && <p className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700" role="status">{message}</p>}
                <h2 className="mb-4 text-lg font-semibold text-slate-900">
                    {isLoading ? "Searching jobs…" : `${jobs.length} ${jobs.length === 1 ? "job" : "jobs"} found`}
                </h2>

                {!isLoading && !jobs.length && !error && (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
                        <BriefcaseBusiness className="mx-auto text-slate-400" size={32} />
                        <p className="mt-3 font-medium text-slate-800">No matching jobs found</p>
                        <p className="mt-1 text-sm text-slate-500">Try another keyword or remove a filter.</p>
                    </div>
                )}

                <div className="space-y-4">
                    {jobs.map((job) => {
                        const applied = appliedJobIds.has(String(job._id));
                        return (
                            <article key={job._id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                    <div className="min-w-0">
                                        <h3 className="text-xl font-semibold text-slate-900">{job.title}</h3>
                                        <p className="mt-1 text-sm font-medium text-blue-700">{job.company}</p>
                                        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-600">
                                            <span className="inline-flex items-center gap-1"><MapPin size={15} />{formatLocation(job.location)}</span>
                                            <span>{job.workMode}</span>
                                            <span>{job.jobType}</span>
                                            <span>{job.openingCount} opening{job.openingCount === 1 ? "" : "s"}</span>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleApply(job)}
                                        disabled={applied || Boolean(loadingJobId)}
                                        className="shrink-0 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                                    >
                                        {applied ? "Applied" : loadingJobId === job._id ? "Applying…" : "Apply"}
                                    </button>
                                </div>
                                <p className="mt-4 whitespace-pre-line text-sm leading-6 text-slate-700">{job.description}</p>
                                <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-700">
                                    <span><strong>Experience:</strong> {job.experienceDeman?.min ?? 0}
                                        {job.experienceDeman?.max !== undefined ? `–${job.experienceDeman.max}` : "+"} years
                                    </span>
                                    <span><strong>Compensation:</strong> {job.amount?.currency} {Number(job.amount?.salary).toLocaleString()} / {job.amount?.period}</span>
                                </div>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {(job.skillDemand || []).map((skill) => (
                                        <span key={skill} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">{skill}</span>
                                    ))}
                                </div>
                                {job.expiresAt && (
                                    <p className="mt-4 text-xs text-slate-500">Apply by {new Date(job.expiresAt).toLocaleDateString()}</p>
                                )}
                            </article>
                        );
                    })}
                </div>
            </div>
        </main>
    );
}
