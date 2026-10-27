import { useEffect, useState } from "react";
import {
    createJobPosting,
    getJobApplicants,
    getRecruiterJobs,
    getRecruiterProfile,
    saveRecruiterProfile
} from "../api/recruiter.js";

const COMPANY_SIZES = ["1-10", "11-50", "50-200", "201-500", "500+"];
const JOB_TYPES = ["Consultancy", "Contract", "Advisory", "Part-time", "Full-time", "Internship"];
const WORK_MODES = ["Remote", "Hybrid", "On-site"];
const SALARY_PERIODS = ["Hourly", "Monthly", "Yearly", "Project-based"];
const JOB_STATUSES = ["Active", "Draft"];

const EMPTY_PROFILE = {
    orgName: "",
    designation: "",
    phone: "",
    website: "",
    companySize: "",
    industry: "",
    headquarters: "",
    country: "India"
};

const EMPTY_JOB = {
    title: "",
    description: "",
    openingCount: "1",
    minExperience: "0",
    maxExperience: "",
    skillDemand: "",
    jobType: "Full-time",
    workMode: "Remote",
    city: "",
    state: "",
    country: "India",
    salary: "",
    currency: "INR",
    salaryPeriod: "Monthly",
    status: "Active",
    expiresAt: ""
};

const inputClassName = "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

export default function Employer() {
    const [form, setForm] = useState(EMPTY_PROFILE);
    const [jobForm, setJobForm] = useState(EMPTY_JOB);
    const [jobs, setJobs] = useState([]);
    const [applicantsByJob, setApplicantsByJob] = useState({});
    const [loadingApplicants, setLoadingApplicants] = useState({});
    const [applicantErrors, setApplicantErrors] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isPosting, setIsPosting] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [jobMessage, setJobMessage] = useState("");
    const [jobError, setJobError] = useState("");

    useEffect(() => {
        let isCurrent = true;

        async function loadProfile() {
            try {
                const result = await getRecruiterProfile();
                if (!result.ok) {
                    throw new Error(result.body.message || "Unable to load recruiter profile.");
                }

                if (isCurrent && result.body.data) {
                    const profile = result.body.data;
                    setForm({
                        orgName: profile.orgName || "",
                        designation: profile.contactPerson?.designation || "",
                        phone: profile.contactPerson?.phone || "",
                        website: profile.website || "",
                        companySize: profile.companySize || "",
                        industry: Array.isArray(profile.industry) ? profile.industry.join(", ") : "",
                        headquarters: profile.location?.headquarters || "",
                        country: profile.location?.country || "India"
                    });
                    setIsVerified(Boolean(profile.isVerified));
                }
            } catch (loadError) {
                if (isCurrent) {
                    setError(loadError.message);
                }
            } finally {
                if (isCurrent) {
                    setIsLoading(false);
                }
            }
        }

        loadProfile();
        return () => {
            isCurrent = false;
        };
    }, []);

    useEffect(() => {
        let isCurrent = true;

        async function loadJobs() {
            try {
                const result = await getRecruiterJobs();
                if (!result.ok) {
                    throw new Error(result.body.message || "Unable to load your job postings.");
                }

                if (isCurrent) {
                    setJobs(Array.isArray(result.body.data) ? result.body.data : []);
                }
            } catch (loadError) {
                if (isCurrent) {
                    setJobError(loadError.message);
                }
            }
        }

        loadJobs();
        return () => {
            isCurrent = false;
        };
    }, []);

    function handleChange(event) {
        const { name, value } = event.target;
        setForm((current) => ({ ...current, [name]: value }));
    }

    function handleJobChange(event) {
        const { name, value } = event.target;
        setJobForm((current) => ({ ...current, [name]: value }));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");
        setMessage("");
        setIsSaving(true);

        try {
            const result = await saveRecruiterProfile({
                orgName: form.orgName,
                contactPerson: {
                    designation: form.designation,
                    phone: form.phone
                },
                website: form.website,
                companySize: form.companySize,
                industry: form.industry.split(",").map((item) => item.trim()).filter(Boolean),
                location: {
                    headquarters: form.headquarters,
                    country: form.country
                }
            });

            if (!result.ok) {
                throw new Error(result.body.message || "Unable to save recruiter profile.");
            }

            setIsVerified(Boolean(result.body.data?.isVerified));
            setMessage(result.body.message || "Recruiter profile saved successfully.");
        } catch (saveError) {
            setError(saveError.message);
        } finally {
            setIsSaving(false);
        }
    }

    async function handleJobSubmit(event) {
        event.preventDefault();
        setJobError("");
        setJobMessage("");

        if (
            jobForm.maxExperience !== "" &&
            Number(jobForm.maxExperience) < Number(jobForm.minExperience)
        ) {
            setJobError("Maximum experience must be greater than or equal to minimum experience.");
            return;
        }

        setIsPosting(true);
        try {
            const result = await createJobPosting({
                title: jobForm.title,
                description: jobForm.description,
                openingCount: Number(jobForm.openingCount),
                experienceDeman: {
                    min: Number(jobForm.minExperience),
                    ...(jobForm.maxExperience !== "" ? { max: Number(jobForm.maxExperience) } : {})
                },
                skillDemand: jobForm.skillDemand.split(",").map((skill) => skill.trim()).filter(Boolean),
                jobType: jobForm.jobType,
                workMode: jobForm.workMode,
                location: {
                    city: jobForm.city,
                    state: jobForm.state,
                    country: jobForm.country
                },
                amount: {
                    salary: Number(jobForm.salary),
                    currency: jobForm.currency,
                    period: jobForm.salaryPeriod
                },
                status: jobForm.status,
                ...(jobForm.expiresAt ? { expiresAt: new Date(`${jobForm.expiresAt}T23:59:59`).toISOString() } : {})
            });

            if (!result.ok) {
                throw new Error(result.body.message || "Unable to create job posting.");
            }

            setJobs((current) => [result.body.data, ...current]);
            setJobForm(EMPTY_JOB);
            setJobMessage(result.body.message || "Job posting created successfully.");
        } catch (postError) {
            setJobError(postError.message);
        } finally {
            setIsPosting(false);
        }
    }

    async function handleApplicantsToggle(jobId) {
        if (Object.hasOwn(applicantsByJob, jobId)) {
            setApplicantsByJob((current) => {
                const next = { ...current };
                delete next[jobId];
                return next;
            });
            return;
        }

        setLoadingApplicants((current) => ({ ...current, [jobId]: true }));
        setApplicantErrors((current) => ({ ...current, [jobId]: "" }));
        try {
            const result = await getJobApplicants(jobId);
            if (!result.ok) {
                throw new Error(result.body.message || "Unable to load applicants.");
            }
            setApplicantsByJob((current) => ({ ...current, [jobId]: result.body.data || [] }));
        } catch (applicantError) {
            setApplicantErrors((current) => ({ ...current, [jobId]: applicantError.message }));
        } finally {
            setLoadingApplicants((current) => ({ ...current, [jobId]: false }));
        }
    }

    return (
        <main className="min-h-[calc(100vh-4rem)] bg-slate-50 px-4 py-10 sm:px-6">
            <section className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="mb-7">
                    <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Recruiter profile</p>
                    <h1 className="mt-1 text-2xl font-bold text-slate-900">Organization details</h1>
                    <p className="mt-2 text-sm text-slate-600">
                        Add your organization and contact details so professionals can learn about your company.
                    </p>
                </div>

                {isLoading ? (
                    <p className="py-8 text-center text-sm text-slate-600" role="status">Loading recruiter profile…</p>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="orgName" className="text-sm font-medium text-slate-700">Organization name *</label>
                            <input id="orgName" name="orgName" value={form.orgName} onChange={handleChange} className={inputClassName} required maxLength={150} />
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <label htmlFor="designation" className="text-sm font-medium text-slate-700">Your designation *</label>
                                <input id="designation" name="designation" value={form.designation} onChange={handleChange} className={inputClassName} required maxLength={100} />
                            </div>
                            <div>
                                <label htmlFor="phone" className="text-sm font-medium text-slate-700">Contact phone</label>
                                <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} className={inputClassName} autoComplete="tel" />
                            </div>
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <label htmlFor="website" className="text-sm font-medium text-slate-700">Website</label>
                                <input id="website" name="website" type="url" value={form.website} onChange={handleChange} className={inputClassName} placeholder="https://example.com" />
                            </div>
                            <div>
                                <label htmlFor="companySize" className="text-sm font-medium text-slate-700">Company size</label>
                                <select id="companySize" name="companySize" value={form.companySize} onChange={handleChange} className={inputClassName}>
                                    <option value="">Select company size</option>
                                    {COMPANY_SIZES.map((size) => <option key={size} value={size}>{size} employees</option>)}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="industry" className="text-sm font-medium text-slate-700">Industry / industries *</label>
                            <input id="industry" name="industry" value={form.industry} onChange={handleChange} className={inputClassName} placeholder="Technology, Healthcare" required />
                            <p className="mt-1 text-xs text-slate-500">Enter one or more industries separated by commas.</p>
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <label htmlFor="headquarters" className="text-sm font-medium text-slate-700">Headquarters</label>
                                <input id="headquarters" name="headquarters" value={form.headquarters} onChange={handleChange} className={inputClassName} autoComplete="address-level2" />
                            </div>
                            <div>
                                <label htmlFor="country" className="text-sm font-medium text-slate-700">Country</label>
                                <input id="country" name="country" value={form.country} onChange={handleChange} className={inputClassName} autoComplete="country-name" />
                            </div>
                        </div>

                        {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</p>}
                        {message && <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700" role="status">{message}</p>}
                        <p className="text-xs text-slate-500">
                            Verification status: {isVerified ? "Verified" : "Not verified"} (managed by SeniorPro)
                        </p>

                        <button type="submit" disabled={isSaving} className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
                            {isSaving ? "Saving…" : "Save recruiter profile"}
                        </button>
                    </form>
                )}
            </section>

            <section className="mx-auto mt-8 max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="mb-7">
                    <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Hiring</p>
                    <h2 className="mt-1 text-2xl font-bold text-slate-900">Post a new job</h2>
                    <p className="mt-2 text-sm text-slate-600">
                        Share the role requirements and compensation with professionals on SeniorPro.
                    </p>
                </div>

                <form onSubmit={handleJobSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="jobTitle" className="text-sm font-medium text-slate-700">Job title *</label>
                        <input id="jobTitle" name="title" value={jobForm.title} onChange={handleJobChange} className={inputClassName} required maxLength={150} />
                    </div>

                    <div>
                        <label htmlFor="jobDescription" className="text-sm font-medium text-slate-700">Description *</label>
                        <textarea id="jobDescription" name="description" value={jobForm.description} onChange={handleJobChange} className={`${inputClassName} min-h-32`} required rows={5} />
                    </div>

                    <div className="grid gap-5 sm:grid-cols-3">
                        <div>
                            <label htmlFor="openingCount" className="text-sm font-medium text-slate-700">Number of openings *</label>
                            <input id="openingCount" name="openingCount" type="number" min="1" step="1" value={jobForm.openingCount} onChange={handleJobChange} className={inputClassName} required />
                        </div>
                        <div>
                            <label htmlFor="minExperience" className="text-sm font-medium text-slate-700">Minimum experience (years) *</label>
                            <input id="minExperience" name="minExperience" type="number" min="0" step="0.5" value={jobForm.minExperience} onChange={handleJobChange} className={inputClassName} required />
                        </div>
                        <div>
                            <label htmlFor="maxExperience" className="text-sm font-medium text-slate-700">Maximum experience (years)</label>
                            <input id="maxExperience" name="maxExperience" type="number" min={jobForm.minExperience} step="0.5" value={jobForm.maxExperience} onChange={handleJobChange} className={inputClassName} />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="skillDemand" className="text-sm font-medium text-slate-700">Required skills *</label>
                        <input id="skillDemand" name="skillDemand" value={jobForm.skillDemand} onChange={handleJobChange} className={inputClassName} placeholder="React, Node.js, MongoDB" required />
                        <p className="mt-1 text-xs text-slate-500">Separate skills with commas.</p>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-3">
                        <div>
                            <label htmlFor="jobType" className="text-sm font-medium text-slate-700">Job type</label>
                            <select id="jobType" name="jobType" value={jobForm.jobType} onChange={handleJobChange} className={inputClassName}>
                                {JOB_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="workMode" className="text-sm font-medium text-slate-700">Work mode *</label>
                            <select id="workMode" name="workMode" value={jobForm.workMode} onChange={handleJobChange} className={inputClassName} required>
                                {WORK_MODES.map((mode) => <option key={mode} value={mode}>{mode}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="jobStatus" className="text-sm font-medium text-slate-700">Posting status</label>
                            <select id="jobStatus" name="status" value={jobForm.status} onChange={handleJobChange} className={inputClassName}>
                                {JOB_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-3">
                        <div>
                            <label htmlFor="jobCity" className="text-sm font-medium text-slate-700">City</label>
                            <input id="jobCity" name="city" value={jobForm.city} onChange={handleJobChange} className={inputClassName} autoComplete="address-level2" />
                        </div>
                        <div>
                            <label htmlFor="jobState" className="text-sm font-medium text-slate-700">State / region</label>
                            <input id="jobState" name="state" value={jobForm.state} onChange={handleJobChange} className={inputClassName} autoComplete="address-level1" />
                        </div>
                        <div>
                            <label htmlFor="jobCountry" className="text-sm font-medium text-slate-700">Country</label>
                            <input id="jobCountry" name="country" value={jobForm.country} onChange={handleJobChange} className={inputClassName} autoComplete="country-name" />
                        </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-3">
                        <div>
                            <label htmlFor="salary" className="text-sm font-medium text-slate-700">Salary *</label>
                            <input id="salary" name="salary" type="number" min="0" step="any" value={jobForm.salary} onChange={handleJobChange} className={inputClassName} required />
                        </div>
                        <div>
                            <label htmlFor="currency" className="text-sm font-medium text-slate-700">Currency</label>
                            <input id="currency" name="currency" value={jobForm.currency} onChange={handleJobChange} className={inputClassName} maxLength={8} required />
                        </div>
                        <div>
                            <label htmlFor="salaryPeriod" className="text-sm font-medium text-slate-700">Salary period</label>
                            <select id="salaryPeriod" name="salaryPeriod" value={jobForm.salaryPeriod} onChange={handleJobChange} className={inputClassName}>
                                {SALARY_PERIODS.map((period) => <option key={period} value={period}>{period}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="max-w-sm">
                        <label htmlFor="expiresAt" className="text-sm font-medium text-slate-700">Posting expiry date</label>
                        <input id="expiresAt" name="expiresAt" type="date" min={new Date().toISOString().slice(0, 10)} value={jobForm.expiresAt} onChange={handleJobChange} className={inputClassName} />
                    </div>

                    {jobError && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">{jobError}</p>}
                    {jobMessage && <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700" role="status">{jobMessage}</p>}

                    <button type="submit" disabled={isPosting} className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
                        {isPosting ? "Posting…" : "Post job"}
                    </button>
                </form>

                <div className="mt-10 border-t border-slate-200 pt-7">
                    <h3 className="text-lg font-semibold text-slate-900">Your job postings</h3>
                    {jobError && !jobs.length && <p className="mt-3 text-sm text-red-700" role="alert">{jobError}</p>}
                    {!jobs.length && !jobError ? (
                        <p className="mt-3 text-sm text-slate-600">No jobs posted yet.</p>
                    ) : (
                        <ul className="mt-4 space-y-3">
                            {jobs.map((job) => (
                                <li key={job._id} className="rounded-lg border border-slate-200 p-4">
                                    <div className="flex flex-wrap items-start justify-between gap-2">
                                        <h4 className="font-semibold text-slate-900">{job.title}</h4>
                                        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">{job.status}</span>
                                    </div>
                                    <p className="mt-1 text-sm text-slate-600">
                                        {job.jobType} · {job.workMode}
                                        {job.location?.city ? ` · ${job.location.city}` : ""}
                                    </p>
                                    <p className="mt-2 text-sm text-slate-700">
                                        {job.amount?.currency} {job.amount?.salary} / {job.amount?.period}
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => handleApplicantsToggle(job._id)}
                                        disabled={loadingApplicants[job._id]}
                                        className="mt-3 rounded-lg border border-blue-200 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-50 disabled:opacity-60"
                                    >
                                        {loadingApplicants[job._id]
                                            ? "Loading applicants…"
                                            : Object.hasOwn(applicantsByJob, job._id)
                                                ? "Hide applicants"
                                                : "View applicants"}
                                    </button>
                                    {applicantErrors[job._id] && (
                                        <p className="mt-3 text-sm text-red-700" role="alert">{applicantErrors[job._id]}</p>
                                    )}
                                    {Object.hasOwn(applicantsByJob, job._id) && (
                                        <div className="mt-4 border-t border-slate-200 pt-4">
                                            <h5 className="font-medium text-slate-900">
                                                Applicants ({applicantsByJob[job._id].length})
                                            </h5>
                                            {!applicantsByJob[job._id].length ? (
                                                <p className="mt-2 text-sm text-slate-500">No one has applied yet.</p>
                                            ) : (
                                                <ul className="mt-3 space-y-3">
                                                    {applicantsByJob[job._id].map((application) => {
                                                        const applicant = application.applicant;
                                                        return (
                                                            <li key={application._id} className="rounded-lg bg-slate-50 p-4">
                                                                <div className="flex flex-wrap items-start justify-between gap-2">
                                                                    <div>
                                                                        <p className="font-medium text-slate-900">{applicant.name || "Job seeker"}</p>
                                                                        <a className="text-sm text-blue-700 hover:underline" href={`mailto:${applicant.email}`}>{applicant.email}</a>
                                                                    </div>
                                                                    <span className="text-xs text-slate-500">
                                                                        {new Date(application.createdAt).toLocaleDateString()} · {application.status}
                                                                    </span>
                                                                </div>
                                                                {applicant.headline && <p className="mt-2 text-sm text-slate-700">{applicant.headline}</p>}
                                                                <p className="mt-1 text-sm text-slate-600">
                                                                    {applicant.experience ?? 0} years experience
                                                                    {applicant.location?.city ? ` · ${applicant.location.city}` : ""}
                                                                </p>
                                                                {applicant.skills?.length > 0 && (
                                                                    <p className="mt-2 text-xs text-slate-600">Skills: {applicant.skills.join(", ")}</p>
                                                                )}
                                                                {applicant.phone && <p className="mt-2 text-sm text-slate-600">Phone: {applicant.phone}</p>}
                                                                {applicant.resumeUrl && (
                                                                    <a href={applicant.resumeUrl} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm font-medium text-blue-700 hover:underline">
                                                                        View resume
                                                                    </a>
                                                                )}
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            )}
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </section>
        </main>
    );
}
