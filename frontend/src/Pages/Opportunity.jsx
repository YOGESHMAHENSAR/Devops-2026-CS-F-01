
import { useMemo, useState } from "react";
import {
  Search,
  MapPin,
  BriefcaseBusiness,
  Bookmark,
  ArrowUpRight,
  Clock3,
  SlidersHorizontal,
  X,
  RotateCcw,
  Building2,
  CheckCircle2,
  Sparkles,
  GraduationCap,
  Code2,
  Database,
  Palette,
  BarChart3,
  Laptop,
} from "lucide-react";

const JOBS = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "TechNova",
    initials: "T",
    location: "Jaipur, Rajasthan",
    type: "Full-time",
    mode: "Hybrid",
    experience: "Entry-level",
    salary: "₹4–6 LPA",
    posted: "2 days ago",
    description:
      "Help us build fast, accessible, and beautiful web applications. Work with designers and developers to turn ideas into useful products.",
    skills: ["React", "JavaScript", "Tailwind CSS"],
    color: "bg-blue-100 text-blue-700",
    icon: Code2,
  },
  {
    id: 2,
    title: "Software Developer Intern",
    company: "PixelCraft",
    initials: "P",
    location: "Remote, India",
    type: "Internship",
    mode: "Remote",
    experience: "Fresher",
    salary: "₹12k–18k/month",
    posted: "1 day ago",
    description:
      "Start your software development journey with a supportive team. Work on real product features and learn from experienced engineers.",
    skills: ["JavaScript", "React", "Git"],
    color: "bg-violet-100 text-violet-700",
    icon: GraduationCap,
  },
  {
    id: 3,
    title: "Backend Developer",
    company: "CloudBridge",
    initials: "C",
    location: "Remote, India",
    type: "Full-time",
    mode: "Remote",
    experience: "Entry-level",
    salary: "₹5–8 LPA",
    posted: "3 days ago",
    description:
      "Build and maintain APIs, work with databases, and improve application reliability. Ideal for someone who enjoys solving problems behind the scenes.",
    skills: ["Node.js", "Express", "MongoDB"],
    color: "bg-emerald-100 text-emerald-700",
    icon: Database,
  },
  {
    id: 4,
    title: "Data Analyst Intern",
    company: "InsightWorks",
    initials: "I",
    location: "Bengaluru, Karnataka",
    type: "Internship",
    mode: "On-site",
    experience: "Fresher",
    salary: "₹15k–20k/month",
    posted: "4 days ago",
    description:
      "Explore datasets, create meaningful reports, and help teams make informed decisions while developing practical analytics skills.",
    skills: ["Python", "SQL", "Excel"],
    color: "bg-amber-100 text-amber-700",
    icon: BarChart3,
  },
  {
    id: 5,
    title: "UI/UX Designer",
    company: "Mosaic Digital",
    initials: "M",
    location: "Jaipur, Rajasthan",
    type: "Part-time",
    mode: "Hybrid",
    experience: "Entry-level",
    salary: "₹15k–25k/month",
    posted: "5 days ago",
    description:
      "Create intuitive digital experiences through wireframes, prototypes, and thoughtful interface design. Collaborate with product and development teams.",
    skills: ["Figma", "UI Design", "Prototyping"],
    color: "bg-pink-100 text-pink-700",
    icon: Palette,
  },
  {
    id: 6,
    title: "Junior Full Stack Developer",
    company: "LaunchLabs",
    initials: "L",
    location: "Remote, India",
    type: "Full-time",
    mode: "Remote",
    experience: "Entry-level",
    salary: "₹5–7 LPA",
    posted: "1 week ago",
    description:
      "Contribute to frontend features and backend services, integrate APIs, and help deliver product functionality from start to finish.",
    skills: ["React", "Node.js", "PostgreSQL"],
    color: "bg-orange-100 text-orange-700",
    icon: Laptop,
  },
];

const JOB_TYPES = [
  "All jobs",
  "Full-time",
  "Internship",
  "Part-time",
  "Contract",
];

const LOCATIONS = [
  "All locations",
  "Remote",
  "Jaipur, Rajasthan",
  "Bengaluru, Karnataka",
];

const MODES = ["Any work mode", "Remote", "Hybrid", "On-site"];

const EXPERIENCES = [
  "Any experience",
  "Fresher",
  "Entry-level",
  "Experienced",
];

const POPULAR_SEARCHES = ["React", "Python", "Node.js", "Data Analyst"];

function JobCard({ job, saved, onSave, onView }) {
  const Icon = job.icon;

  return (
    <article className="group grid grid-cols-1 gap-5 rounded-2xl border border-slate-200 bg-white p-5 transition duration-200 hover:border-blue-200 hover:shadow-lg hover:shadow-slate-200/50 sm:grid-cols-[minmax(0,1fr)_230px] sm:items-center sm:gap-6 sm:p-6 lg:grid-cols-[minmax(0,1fr)_250px]">
      {/* LEFT: Job information */}
      <div className="min-w-0">
        <div className="flex items-start gap-3">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg font-bold ${job.color}`}
          >
            {job.initials}
          </div>

          <div className="min-w-0 flex-1">
            <button
              type="button"
              onClick={() => onView(job)}
              className="text-left text-base font-bold leading-6 text-slate-900 transition hover:text-blue-700 sm:text-lg"
            >
              {job.title}
            </button>

            <p className="mt-1 text-sm text-slate-500">
              {job.company}
            </p>
          </div>

          {/* Bookmark remains accessible on mobile */}
          <button
            type="button"
            onClick={() => onSave(job.id)}
            aria-label={saved ? "Remove saved job" : "Save job"}
            aria-pressed={saved}
            className={`shrink-0 rounded-xl border p-2.5 transition sm:hidden ${
              saved
                ? "border-blue-200 bg-blue-50 text-blue-700"
                : "border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-blue-600"
            }`}
          >
            <Bookmark
              size={18}
              fill={saved ? "currentColor" : "none"}
            />
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
            {job.type}
          </span>
          <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
            {job.mode}
          </span>
          <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
            {job.experience}
          </span>
        </div>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          {job.description}
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          {job.skills.map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* RIGHT: Salary, location, bookmark and action */}
      <div className="flex min-w-0 flex-col justify-center gap-3 border-t border-slate-100 pt-4 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0 lg:pl-6">
        <div className="flex items-center justify-between gap-3">
          <p className="text-lg font-bold text-slate-900">
            {job.salary}
          </p>

          <button
            type="button"
            onClick={() => onSave(job.id)}
            aria-label={saved ? "Remove saved job" : "Save job"}
            aria-pressed={saved}
            className={`hidden shrink-0 rounded-xl border p-2.5 transition sm:inline-flex ${
              saved
                ? "border-blue-200 bg-blue-50 text-blue-700"
                : "border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-blue-600"
            }`}
          >
            <Bookmark
              size={17}
              fill={saved ? "currentColor" : "none"}
            />
          </button>
        </div>

        <p className="flex items-start gap-2 text-sm text-slate-500">
          <MapPin size={16} className="mt-0.5 shrink-0" />
          <span>{job.location}</span>
        </p>

        <p className="flex items-center gap-2 text-sm text-slate-500">
          <Clock3 size={15} className="shrink-0" />
          {job.posted}
        </p>

        <button
          type="button"
          onClick={() => onView(job)}
          className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
        >
          View job details
          <ArrowUpRight size={16} />
        </button>
      </div>
    </article>
  );
}

function JobDetails({ job, saved, onSave, onClose }) {
  if (!job) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/40 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="job-details-title"
        className="my-auto max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg font-bold ${job.color}`}
            >
              {job.initials}
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500">
                {job.company}
              </p>
              <h2
                id="job-details-title"
                className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl"
              >
                {job.title}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close job details"
            className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {[job.type, job.mode, job.experience].map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            ["Salary / stipend", job.salary],
            ["Location", job.location],
            ["Work arrangement", job.mode],
            ["Experience", job.experience],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-medium text-slate-500">
                {label}
              </p>
              <p className="mt-1.5 text-sm font-semibold text-slate-800">
                {value}
              </p>
            </div>
          ))}
        </div>

        <h3 className="mt-7 font-semibold text-slate-900">
          About this role
        </h3>
        <p className="mt-2 text-sm leading-7 text-slate-600">
          {job.description}
        </p>

        <h3 className="mt-6 font-semibold text-slate-900">
          Skills and qualifications
        </h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {job.skills.map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-600"
            >
              {skill}
            </span>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row">
          <button
            type="button"
            onClick={() => onSave(job.id)}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Bookmark
              size={17}
              fill={saved ? "currentColor" : "none"}
            />
            {saved ? "Saved job" : "Save job"}
          </button>

          <button
            type="button"
            onClick={() =>
              window.alert(
                "Connect this job to your backend application endpoint to enable applications."
              )
            }
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Apply for this job
            <ArrowUpRight size={17} />
          </button>
        </div>
      </section>
    </div>
  );
}

export default function Opportunities() {
  const [search, setSearch] = useState("");
  const [jobType, setJobType] = useState("All jobs");
  const [location, setLocation] = useState("All locations");
  const [mode, setMode] = useState("Any work mode");
  const [experience, setExperience] = useState("Any experience");
  const [savedIds, setSavedIds] = useState([]);
  const [savedOnly, setSavedOnly] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const filteredJobs = useMemo(() => {
    const query = search.trim().toLowerCase();

    return JOBS.filter((job) => {
      const searchableText = [
        job.title,
        job.company,
        job.location,
        job.type,
        job.mode,
        job.experience,
        ...job.skills,
      ]
        .join(" ")
        .toLowerCase();

      return (
        (!query || searchableText.includes(query)) &&
        (jobType === "All jobs" || job.type === jobType) &&
        (location === "All locations" ||
          (location === "Remote"
            ? job.mode === "Remote"
            : job.location.includes(location))) &&
        (mode === "Any work mode" || job.mode === mode) &&
        (experience === "Any experience" ||
          job.experience === experience) &&
        (!savedOnly || savedIds.includes(job.id))
      );
    });
  }, [
    search,
    jobType,
    location,
    mode,
    experience,
    savedOnly,
    savedIds,
  ]);

  function toggleSaved(id) {
    setSavedIds((current) =>
      current.includes(id)
        ? current.filter((savedId) => savedId !== id)
        : [...current, id]
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
