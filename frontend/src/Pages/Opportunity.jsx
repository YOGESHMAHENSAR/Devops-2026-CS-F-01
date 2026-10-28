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

  function resetFilters() {
    setSearch("");
    setJobType("All jobs");
    setLocation("All locations");
    setMode("Any work mode");
    setExperience("Any experience");
    setSavedOnly(false);
  }

  return (
    <main className="min-h-screen w-full bg-slate-50 text-slate-900">
      {/* Hero and search */}
      <section
        id="seniorpro-search"
        className="border-b border-slate-200 bg-white"
      >
        <div className="mx-auto flex w-full max-w-7xl justify-center px-5 py-14 sm:px-8 sm:py-16 lg:py-20">
          <div className="w-full max-w-4xl text-center">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-semibold tracking-wide text-blue-700">
              <Sparkles size={15} />
              YOUR NEXT STEP STARTS HERE
            </div>

            <h1 className="mx-auto mt-6 max-w-3xl text-3xl font-bold leading-tight tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
              Find the right opportunity for your next career move.
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-500 sm:text-lg">
              From your first internship to your next full-time role,
              discover opportunities that fit your skills, interests,
              and ambitions.
            </p>

            <form
              onSubmit={(event) => event.preventDefault()}
              className="mx-auto mt-9 flex w-full max-w-3xl flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm transition focus-within:border-blue-300 focus-within:ring-4 focus-within:ring-blue-50 sm:flex-row sm:items-center"
            >
              <div className="flex min-w-0 flex-1 items-center gap-3 px-3">
                <Search
                  size={21}
                  className="shrink-0 text-slate-400"
                />

                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Job title, company, or skill..."
                  aria-label="Search jobs"
                  className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-slate-400 sm:text-base"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                    className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
              >
                Find jobs
                <ArrowUpRight size={16} />
              </button>
            </form>

            <div className="mx-auto mt-5 flex max-w-3xl flex-wrap items-center justify-center gap-2 text-sm">
              <span className="mr-1 text-slate-500">
                Popular searches
              </span>
              {POPULAR_SEARCHES.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => setSearch(term)}
                  className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-slate-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                >
                  {term}
                </button>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-x-7 gap-y-3 text-sm text-slate-500">
              <span className="inline-flex items-center gap-2">
                <CheckCircle2
                  size={16}
                  className="text-emerald-600"
                />
                Jobs for every career stage
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle2
                  size={16}
                  className="text-emerald-600"
                />
                Remote and on-site roles
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Listings */}
      <section className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="text-sm font-semibold text-blue-600">
              YOUR NEXT OPPORTUNITY
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Explore jobs that fit you
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Find roles where your skills can make a difference and
              your career can keep growing.
            </p>
          </div>

          {/* Job type tabs */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {JOB_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setJobType(type)}
                aria-pressed={jobType === type}
                className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${
                  jobType === type
                    ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                    : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Filters */}
          <div className="mt-7 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-800">
              <SlidersHorizontal size={17} />
              Filter your search
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <label className="text-xs font-medium text-slate-500">
                LOCATION
                <select
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  className="mt-2 block w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
                >
                  {LOCATIONS.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>

              <label className="text-xs font-medium text-slate-500">
                WORK MODE
                <select
                  value={mode}
                  onChange={(event) => setMode(event.target.value)}
                  className="mt-2 block w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
                >
                  {MODES.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>

              <label className="text-xs font-medium text-slate-500">
                EXPERIENCE
                <select
                  value={experience}
                  onChange={(event) => setExperience(event.target.value)}
                  className="mt-2 block w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
                >
                  {EXPERIENCES.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>

              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center justify-center gap-2 self-end rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              >
                <RotateCcw size={15} />
                Reset filters
              </button>
            </div>
          </div>

          {/* Results header */}
          <div className="mb-5 mt-9 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                {savedOnly ? "Your saved jobs" : "Latest opportunities"}
              </h2>
              <p className="mt-2 text-sm text-slate-500" aria-live="polite">
                Showing{" "}
                <strong className="text-slate-800">
                  {filteredJobs.length}
                </strong>{" "}
                {filteredJobs.length === 1 ? "job" : "jobs"}
                {search.trim() ? ` for "${search.trim()}"` : ""}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSavedOnly((current) => !current)}
              aria-pressed={savedOnly}
              className={`inline-flex items-center justify-center gap-2 self-start rounded-xl border px-4 py-2.5 text-sm font-medium transition sm:self-auto ${
                savedOnly
                  ? "border-blue-200 bg-blue-50 text-blue-700"
                  : "border-slate-200 bg-white text-slate-600 hover:border-blue-200"
              }`}
            >
              <Bookmark
                size={16}
                fill={savedOnly ? "currentColor" : "none"}
              />
              Saved jobs ({savedIds.length})
            </button>
          </div>

          {/* ONE WIDE RECTANGULAR CARD PER ROW */}
          {filteredJobs.length > 0 ? (
            <div className="flex flex-col gap-4">
              {filteredJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  saved={savedIds.includes(job.id)}
                  onSave={toggleSaved}
                  onView={setSelectedJob}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-5 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <Search size={25} />
              </div>

              <h3 className="mt-5 text-lg font-semibold text-slate-900">
                {savedOnly ? "No saved jobs yet" : "No matching jobs found"}
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                {savedOnly
                  ? "Save jobs that interest you and revisit them whenever you're ready."
                  : "Try another keyword or adjust your filters to discover more opportunities."}
              </p>

              <button
                type="button"
                onClick={resetFilters}
                className="mt-5 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Show all jobs
              </button>
            </div>
          )}

          {/* Bottom CTA */}
          <div className="mt-12 flex flex-col items-center rounded-3xl border border-blue-100 bg-blue-50/70 px-6 py-10 text-center sm:px-10 sm:py-12">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm ring-1 ring-blue-100">
              <Sparkles size={25} />
            </div>

            <h2 className="mt-5 max-w-xl text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Your next opportunity is out there.
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
              Keep exploring, stay curious, and take the next step
              toward a role that fits your ambitions.
            </p>

            <button
              type="button"
              onClick={() => {
                resetFilters();
                document
                  .getElementById("seniorpro-search")
                  ?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  });
              }}
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Find your next role
              <ArrowUpRight size={17} />
            </button>
          </div>
        </div>
      </section>

      <JobDetails
        job={selectedJob}
        saved={selectedJob ? savedIds.includes(selectedJob.id) : false}
        onSave={toggleSaved}
        onClose={() => setSelectedJob(null)}
      />
    </main>
  );
}
