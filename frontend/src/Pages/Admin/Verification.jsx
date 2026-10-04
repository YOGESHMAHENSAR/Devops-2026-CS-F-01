
import { useState } from "react";
import {
    Search,
    Filter,
    ShieldCheck,
    Clock,
    CheckCircle,
    XCircle,
    Building2,
    Eye,
    FileText,
    CalendarDays,
    X,
    ExternalLink,
} from "lucide-react";

const initialRequests = [
    {
        id: 1,
        company: "TechNova Solutions",
        email: "hr@technova.example",
        contact: "Aarav Sharma",
        type: "IT Services",
        submitted: "30 Sep 2026",
        status: "Pending",
        documents: ["Company Registration", "Business License"],
        description: "Technology consulting and software development company.",
    },
    {
        id: 2,
        company: "BrightPath Technologies",
        email: "verify@brightpath.example",
        contact: "Priya Mehta",
        type: "Software Development",
        submitted: "29 Sep 2026",
        status: "Pending",
        documents: ["Company Registration", "Tax Certificate"],
        description: "Software development and digital transformation services.",
    },
    {
        id: 3,
        company: "GlobalEdge Consulting",
        email: "admin@globaledge.example",
        contact: "Rahul Verma",
        type: "Consulting",
        submitted: "28 Sep 2026",
        status: "Approved",
        documents: ["Company Registration", "Business License"],
        description: "Business consulting and professional recruitment services.",
    },
    {
        id: 4,
        company: "NextGen Innovations",
        email: "contact@nextgen.example",
        contact: "Neha Gupta",
        type: "Technology",
        submitted: "27 Sep 2026",
        status: "Rejected",
        documents: ["Company Registration"],
        description: "Emerging technology and innovation company.",
    },
];

const filters = ["All", "Pending", "Approved", "Rejected"];

function StatusBadge({ status }) {
    const styles = {
        Pending: "bg-amber-50 text-amber-700",
        Approved: "bg-emerald-50 text-emerald-700",
        Rejected: "bg-red-50 text-red-700",
    };

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${styles[status]}`}
        >
            {status === "Pending" && <Clock size={13} />}
            {status === "Approved" && <CheckCircle size={13} />}
            {status === "Rejected" && <XCircle size={13} />}
            {status}
        </span>
    );
}

export default function Verification() {
    const [requests, setRequests] = useState(initialRequests);
    const [activeFilter, setActiveFilter] = useState("All");
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState(null);
    const [rejectReason, setRejectReason] = useState("");
    const [showReject, setShowReject] = useState(false);

    const counts = {
        All: requests.length,
        Pending: requests.filter((r) => r.status === "Pending").length,
        Approved: requests.filter((r) => r.status === "Approved").length,
        Rejected: requests.filter((r) => r.status === "Rejected").length,
    };

    const filteredRequests = requests.filter((request) => {
        const matchesStatus =
            activeFilter === "All" || request.status === activeFilter;

        const matchesSearch =
            `${request.company} ${request.email} ${request.contact}`
                .toLowerCase()
                .includes(search.toLowerCase());

        return matchesStatus && matchesSearch;
    });

    function updateStatus(id, status) {
        setRequests((previous) =>
            previous.map((request) =>
                request.id === id ? { ...request, status } : request
            )
        );

        setSelected((previous) =>
            previous?.id === id ? { ...previous, status } : previous
        );

        setShowReject(false);
        setRejectReason("");
    }

    function handleReject() {
        if (!rejectReason.trim()) return;

        updateStatus(selected.id, "Rejected");
    }

    return (
        <div className="space-y-6">
            {/* Page heading */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">
                        Company Verification
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Review and manage recruiter company verification requests.
                    </p>
                </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[
                    {
                        label: "Total Requests",
                        value: counts.All,
                        icon: ShieldCheck,
                        color: "bg-blue-50 text-blue-600",
                    },
                    {
                        label: "Pending",
                        value: counts.Pending,
                        icon: Clock,
                        color: "bg-amber-50 text-amber-600",
                    },
                    {
                        label: "Approved",
                        value: counts.Approved,
                        icon: CheckCircle,
                        color: "bg-emerald-50 text-emerald-600",
                    },
                    {
                        label: "Rejected",
                        value: counts.Rejected,
                        icon: XCircle,
                        color: "bg-red-50 text-red-600",
                    },
                ].map((item) => {
                    const Icon = item.icon;

                    return (
                        <div
                            key={item.label}
                            className="rounded-2xl border border-slate-200 bg-white p-5"
                        >
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-slate-500">
                                    {item.label}
                                </p>
                                <div className={`rounded-xl p-3 ${item.color}`}>
                                    <Icon size={21} />
                                </div>
                            </div>
                            <p className="mt-3 text-3xl font-bold text-slate-900">
                                {item.value}
                            </p>
                        </div>
                    );
                })}
            </div>

            {/* Requests table */}
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 p-5">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">
                            Verification Requests
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                            Review company information and submitted documents.
                        </p>
                    </div>

                    <div className="relative w-full sm:w-72">
                        <Search
                            size={17}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                        <input
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search companies..."
                            className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>
                </div>

                {/* Filter tabs */}
                <div className="flex flex-wrap gap-2 border-b border-slate-100 px-5 py-4">
                    {filters.map((filter) => (
                        <button
                            key={filter}
                            type="button"
                            onClick={() => setActiveFilter(filter)}
                            className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                                activeFilter === filter
                                    ? "bg-blue-600 text-white"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                        >
                            {filter}
                            <span className="ml-2 opacity-75">
                                {counts[filter]}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[750px] text-left">
                        <thead className="bg-slate-50">
                            <tr className="text-xs uppercase tracking-wide text-slate-500">
                                <th className="px-5 py-4 font-semibold">
                                    Company
                                </th>
                                <th className="px-5 py-4 font-semibold">
                                    Contact
                                </th>
                                <th className="px-5 py-4 font-semibold">
                                    Submitted
                                </th>
                                <th className="px-5 py-4 font-semibold">
                                    Status
                                </th>
                                <th className="px-5 py-4 text-right font-semibold">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                            {filteredRequests.map((request) => (
                                <tr
                                    key={request.id}
                                    className="transition hover:bg-slate-50/70"
                                >
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                                <Building2 size={21} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-800">
                                                    {request.company}
                                                </p>
                                                <p className="mt-1 text-xs text-slate-500">
                                                    {request.type}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-5 py-4">
                                        <p className="text-sm font-medium text-slate-700">
                                            {request.contact}
                                        </p>
                                        <p className="mt-1 text-xs text-slate-500">
                                            {request.email}
                                        </p>
                                    </td>

                                    <td className="px-5 py-4">
                                        <span className="inline-flex items-center gap-2 text-sm text-slate-600">
                                            <CalendarDays
                                                size={15}
                                                className="text-slate-400"
                                            />
                                            {request.submitted}
                                        </span>
                                    </td>

                                    <td className="px-5 py-4">
                                        <StatusBadge status={request.status} />
                                    </td>

                                    <td className="px-5 py-4 text-right">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSelected(request);
                                                setShowReject(false);
                                                setRejectReason("");
                                            }}
                                            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                                        >
                                            <Eye size={15} />
                                            Review
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {filteredRequests.length === 0 && (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="px-5 py-16 text-center"
                                    >
                                        <ShieldCheck
                                            size={32}
                                            className="mx-auto text-slate-300"
                                        />
                                        <p className="mt-3 text-sm font-semibold text-slate-700">
                                            No verification requests found
                                        </p>
                                        <p className="mt-1 text-xs text-slate-500">
                                            Try another search or filter.
                                        </p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="border-t border-slate-100 px-5 py-4 text-xs text-slate-500">
                    Showing {filteredRequests.length} of {requests.length} requests
                </div>
            </section>

            {/* Review modal */}
            {selected && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4">
                    <div className="my-auto w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-100 p-5">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">
                                    Review Company
                                </h3>
                                <p className="mt-1 text-sm text-slate-500">
                                    Verify the submitted company information.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setSelected(null)}
                                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                                aria-label="Close review"
                            >
                                <X size={21} />
                            </button>
                        </div>

                        <div className="max-h-[65vh] space-y-5 overflow-y-auto p-5">
                            <div className="flex flex-wrap items-center gap-4">
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                                    <Building2 size={27} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h4 className="text-lg font-bold text-slate-900">
                                        {selected.company}
                                    </h4>
                                    <p className="mt-1 text-sm text-slate-500">
                                        {selected.type}
                                    </p>
                                </div>
                                <StatusBadge status={selected.status} />
                            </div>

                            <div className="grid gap-4 rounded-xl bg-slate-50 p-4 sm:grid-cols-2">
                                <div>
                                    <p className="text-xs font-medium text-slate-400">
                                        Contact Person
                                    </p>
                                    <p className="mt-1 text-sm font-semibold text-slate-800">
                                        {selected.contact}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-slate-400">
                                        Email Address
                                    </p>
                                    <p className="mt-1 break-all text-sm font-semibold text-slate-800">
                                        {selected.email}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-slate-400">
                                        Submission Date
                                    </p>
                                    <p className="mt-1 text-sm font-semibold text-slate-800">
                                        {selected.submitted}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-slate-400">
                                        Business Type
                                    </p>
                                    <p className="mt-1 text-sm font-semibold text-slate-800">
                                        {selected.type}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-bold text-slate-800">
                                    Company Description
                                </h4>
                                <p className="mt-2 text-sm leading-6 text-slate-600">
                                    {selected.description}
                                </p>
                            </div>

                            <div>
                                <h4 className="mb-3 text-sm font-bold text-slate-800">
                                    Submitted Documents
                                </h4>
                                <div className="space-y-2">
                                    {selected.documents.map((document) => (
                                        <div
                                            key={document}
                                            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 p-3"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                                                    <FileText size={19} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-700">
                                                        {document}
                                                    </p>
                                                    <p className="mt-1 text-xs text-slate-400">
                                                        Sample document entry
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="text-xs text-slate-400">
                                                <ExternalLink size={15} />
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {showReject && (
                                <div>
                                    <label
                                        htmlFor="rejectReason"
                                        className="mb-2 block text-sm font-semibold text-slate-700"
                                    >
                                        Reason for rejection
                                    </label>
                                    <textarea
                                        id="rejectReason"
                                        value={rejectReason}
                                        onChange={(e) =>
                                            setRejectReason(e.target.value)
                                        }
                                        rows={3}
                                        placeholder="Enter the reason..."
                                        className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 p-5">
                            <button
                                type="button"
                                onClick={() => setSelected(null)}
                                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                            >
                                Close
                            </button>

                            {selected.status === "Pending" && (
                                <>
                                    {showReject ? (
                                        <button
                                            type="button"
                                            onClick={handleReject}
                                            disabled={!rejectReason.trim()}
                                            className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            Confirm rejection
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => setShowReject(true)}
                                            className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
                                        >
                                            <XCircle size={16} />
                                            Reject
                                        </button>
                                    )}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            updateStatus(selected.id, "Approved")
                                        }
                                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                                    >
                                        <CheckCircle size={16} />
                                        Approve
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}