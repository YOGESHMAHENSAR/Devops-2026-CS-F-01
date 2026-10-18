import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import Verification from './Verification';
import {
    LayoutDashboard,
    Users,
    ShieldCheck,
    BriefcaseBusiness,
    ChartNoAxesCombined,
    Settings,
    Search,
    Bell,
    Menu,
    X,
    ChevronRight,
    TrendingUp,
    UserCheck,
    Clock,
    FileText,
    MoreHorizontal,
    LogOut,
    Plus,
    Download,
    CheckCircle,
    XCircle,
    ImageOff,
} from 'lucide-react';

const navigation = [
    { name: 'Overview', path: '/admin', icon: LayoutDashboard },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Verification', path: '/admin/verification', icon: ShieldCheck },
    { name: 'Opportunities', path: '/admin/opportunities', icon: BriefcaseBusiness },
    { name: 'Reports', path: '/admin/reports', icon: ChartNoAxesCombined },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
];

const stats = [
    {
        title: 'Total Users',
        value: '2,450',
        change: '+12.5%',
        description: 'Compared to last month',
        icon: Users,
        color: 'bg-blue-50 text-blue-600',
    },
    {
        title: 'Active Jobs',
        value: '328',
        change: '+8.2%',
        description: 'Compared to last month',
        icon: BriefcaseBusiness,
        color: 'bg-violet-50 text-violet-600',
    },
    {
        title: 'Applications',
        value: '1,820',
        change: '+18.4%',
        description: 'Compared to last month',
        icon: FileText,
        color: 'bg-emerald-50 text-emerald-600',
    },
    {
        title: 'Pending Reviews',
        value: '24',
        change: 'Needs attention',
        description: 'Awaiting verification',
        icon: Clock,
        color: 'bg-amber-50 text-amber-600',
    },
];

const recentUsers = [
    {
        name: 'Aarav Sharma',
        email: 'aarav@example.com',
        role: 'Jobseeker',
        status: 'Active',
        date: '30 Sep 2026',
        initials: 'AS',
        color: 'bg-blue-100 text-blue-700',
    },
    {
        name: 'Priya Mehta',
        email: 'priya@example.com',
        role: 'Recruiter',
        status: 'Pending',
        date: '29 Sep 2026',
        initials: 'PM',
        color: 'bg-pink-100 text-pink-700',
    },
    {
        name: 'Rahul Verma',
        email: 'rahul@example.com',
        role: 'Jobseeker',
        status: 'Active',
        date: '28 Sep 2026',
        initials: 'RV',
        color: 'bg-emerald-100 text-emerald-700',
    },
    {
        name: 'Neha Gupta',
        email: 'neha@example.com',
        role: 'Recruiter',
        status: 'Inactive',
        date: '27 Sep 2026',
        initials: 'NG',
        color: 'bg-violet-100 text-violet-700',
    },
];

const recentActivity = [
    {
        title: 'New recruiter registered',
        detail: 'Priya Mehta submitted a recruiter account.',
        time: '10 minutes ago',
        icon: UserCheck,
        color: 'bg-blue-50 text-blue-600',
    },
    {
        title: 'Verification requested',
        detail: 'A company submitted its verification documents.',
        time: '35 minutes ago',
        icon: ShieldCheck,
        color: 'bg-amber-50 text-amber-600',
    },
    {
        title: 'New job posted',
        detail: 'A recruiter published a Software Engineer role.',
        time: '1 hour ago',
        icon: BriefcaseBusiness,
        color: 'bg-violet-50 text-violet-600',
    },
    {
        title: 'New user registered',
        detail: 'A jobseeker created a new account.',
        time: '2 hours ago',
        icon: Users,
        color: 'bg-emerald-50 text-emerald-600',
    },
];

function StatCard({ item }) {
    const Icon = item.icon;

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500">
                        {item.title}
                    </p>
                    <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                        {item.value}
                    </h3>
                </div>

                <div className={`rounded-xl p-3 ${item.color}`}>
                    <Icon size={22} />
                </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
                    {item.title === 'Pending Reviews' ? (
                        <Clock size={13} />
                    ) : (
                        <TrendingUp size={13} />
                    )}
                    {item.change}
                </span>
                <span className="text-slate-400">
                    {item.description}
                </span>
            </div>
        </div>
    );
}

function StatusBadge({ status }) {
    const styles = {
        Active: 'bg-emerald-50 text-emerald-700',
        Pending: 'bg-amber-50 text-amber-700',
        Inactive: 'bg-slate-100 text-slate-600',
        Approved: 'bg-emerald-50 text-emerald-700',
        Rejected: 'bg-red-50 text-red-700',
    };

    return (
        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${styles[status] || 'bg-slate-100 text-slate-600'}`}>
            {status}
        </span>
    );
}

function Overview() {
    const [search, setSearch] = useState('');

    const filteredUsers = recentUsers.filter((user) =>
        `${user.name} ${user.email} ${user.role}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((item) => (
                    <StatCard key={item.title} item={item} />
                ))}
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                <section className="rounded-2xl border border-slate-200 bg-white p-5 xl:col-span-2">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">
                                Recent Users
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Recently registered accounts
                            </p>
                        </div>

                        <NavLink
                            to="/admin/users"
                            className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
                        >
                            View all <ChevronRight size={16} />
                        </NavLink>
                    </div>

                    <div className="relative mt-5">
                        <Search
                            size={17}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                        <input
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search users..."
                            className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    <div className="mt-4 overflow-x-auto">
                        <table className="w-full min-w-[600px] text-left">
                            <thead>
                                <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                                    <th className="pb-3 font-semibold">User</th>
                                    <th className="pb-3 font-semibold">Role</th>
                                    <th className="pb-3 font-semibold">Status</th>
                                    <th className="pb-3 font-semibold">Joined</th>
                                    <th className="pb-3 text-right font-semibold">Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredUsers.map((user) => (
                                    <tr
                                        key={user.email}
                                        className="border-b border-slate-50 last:border-0"
                                    >
                                        <td className="py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold ${user.color}`}>
                                                    {user.initials}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-800">
                                                        {user.name}
                                                    </p>
                                                    <p className="mt-0.5 text-xs text-slate-400">
                                                        {user.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="py-4 text-sm text-slate-600">
                                            {user.role}
                                        </td>

                                        <td className="py-4">
                                            <StatusBadge status={user.status} />
                                        </td>

                                        <td className="py-4 text-sm text-slate-500">
                                            {user.date}
                                        </td>

                                        <td className="py-4 text-right">
                                            <button
                                                type="button"
                                                title={`More options for ${user.name}`}
                                                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                                            >
                                                <MoreHorizontal size={19} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}

                                {filteredUsers.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="py-8 text-center text-sm text-slate-500">
                                            No users found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-5">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">
                            Recent Activity
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Latest platform updates
                        </p>
                    </div>

                    <div className="mt-6 space-y-6">
                        {recentActivity.map((activity, index) => {
                            const Icon = activity.icon;

                            return (
                                <div key={index} className="flex gap-3">
                                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${activity.color}`}>
                                        <Icon size={18} />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-semibold text-slate-800">
                                            {activity.title}
                                        </p>
                                        <p className="mt-1 text-xs leading-5 text-slate-500">
                                            {activity.detail}
                                        </p>
                                        <p className="mt-1.5 text-xs text-slate-400">
                                            {activity.time}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-6 border-t border-slate-100 pt-4">
                        <p className="text-xs text-slate-400">
                            Sample activity for dashboard preview
                        </p>
                    </div>
                </section>
            </div>

            <section className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">
                            Verification Overview
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Keep track of company verification requests.
                        </p>
                    </div>

                    <NavLink
                        to="/admin/verification"
                        className="inline-flex items-center gap-1 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                        Review requests <ChevronRight size={16} />
                    </NavLink>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-xl bg-amber-50 p-4">
                        <p className="text-sm text-amber-700">Pending</p>
                        <p className="mt-2 text-2xl font-bold text-amber-800">24</p>
                    </div>
                    <div className="rounded-xl bg-emerald-50 p-4">
                        <p className="text-sm text-emerald-700">Approved</p>
                        <p className="mt-2 text-2xl font-bold text-emerald-800">186</p>
                    </div>
                    <div className="rounded-xl bg-red-50 p-4">
                        <p className="text-sm text-red-700">Rejected</p>
                        <p className="mt-2 text-2xl font-bold text-red-800">8</p>
                    </div>
                </div>
            </section>
        </div>
    );
}

function SectionPlaceholder({ title, description, icon: Icon }) {
    return (
        <div className="flex min-h-[350px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 text-center">
            <div className="mb-4 rounded-2xl bg-blue-50 p-4 text-blue-600">
                <Icon size={30} />
            </div>
            <h2 className="text-xl font-bold text-slate-900">{title}</h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                {description}
            </p>
            <p className="mt-4 rounded-full bg-amber-50 px-4 py-2 text-xs font-medium text-amber-700">
                Section UI and database integration coming next
            </p>
        </div>
    );
}

export default function AdminPage() {
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const currentPage = navigation.find((item) =>
        item.path === '/admin'
            ? location.pathname === '/admin' || location.pathname === '/admin/'
            : location.pathname.startsWith(item.path)
    ) || navigation[0];

    const CurrentIcon = currentPage.icon;

    function renderPage() {
        switch (currentPage.name) {
            case 'Users':
                return (
                    <SectionPlaceholder
                        title="User Management"
                        description="Manage jobseekers and recruiters, review account status, search users and manage access."
                        icon={Users}
                    />
                );

            case 'Verification':
                return <Verification/>;

            case 'Opportunities':
                return (
                    <SectionPlaceholder
                        title="Opportunity Management"
                        description="Review job postings, moderate listings and manage opportunities published by recruiters."
                        icon={BriefcaseBusiness}
                    />
                );

            case 'Reports':
                return (
                    <SectionPlaceholder
                        title="Reports & Analytics"
                        description="View platform activity, user registration trends, job postings and application statistics."
                        icon={ChartNoAxesCombined}
                    />
                );

            case 'Settings':
                return (
                    <SectionPlaceholder
                        title="Admin Settings"
                        description="Manage administrator preferences, account settings and platform configuration."
                        icon={Settings}
                    />
                );

            default:
                return <Overview />;
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">
            {sidebarOpen && (
                <button
                    type="button"
                    aria-label="Close sidebar"
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
                />
            )}

            <aside className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-slate-950 text-white transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
                    <NavLink to="/admin" className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
                            <BriefcaseBusiness size={22} />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold tracking-tight">
                                SeniorPro
                            </h1>
                            <p className="text-xs text-slate-400">
                                Admin Panel
                            </p>
                        </div>
                    </NavLink>

                    <button
                        type="button"
                        onClick={() => setSidebarOpen(false)}
                        className="rounded-lg p-2 text-slate-400 hover:bg-white/10 lg:hidden"
                        aria-label="Close navigation"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="px-4 pt-7">
                    <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                        Workspace
                    </p>

                    <nav className="space-y-1">
                        {navigation.map((item) => {
                            const Icon = item.icon;

                            return (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    end={item.path === '/admin'}
                                    onClick={() => setSidebarOpen(false)}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                                            isActive
                                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-950/30'
                                                : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                        }`
                                    }
                                >
                                    <Icon size={19} />
                                    <span>{item.name}</span>
                                    {item.name === 'Verification' && (
                                        <span className="ml-auto rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-bold text-slate-950">
                                          24
                                        </span>
                                    )}
                                </NavLink>
                            );
                        })}
                    </nav>
                </div>

                <div className="mt-auto p-4">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold">
                                A
                            </div>
                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold">
                                    Administrator
                                </p>
                                <p className="text-xs text-slate-400">
                                    Admin account
                                </p>
                            </div>
                        </div>
                        <p className="mt-3 text-xs leading-5 text-slate-400">
                            Manage your platform from one place.
                        </p>
                    </div>

                    <NavLink
                        to="/"
                        className="mt-3 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
                    >
                        <LogOut size={18} />
                        Back to website
                    </NavLink>
                </div>
            </aside>

            <div className="min-h-screen lg:pl-64">
                <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
                    <div className="flex min-w-0 items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setSidebarOpen(true)}
                            className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 lg:hidden"
                            aria-label="Open navigation"
                        >
                            <Menu size={21} />
                        </button>

                        <div className="min-w-0">
                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                <span>Admin</span>
                                <ChevronRight size={13} />
                                <span className="truncate text-slate-600">
                                    {currentPage.name}
                                </span>
                            </div>
                            <h2 className="mt-1 truncate text-lg font-bold text-slate-900 sm:text-xl">
                                {currentPage.name}
                            </h2>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4">
                        <div className="hidden items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 md:flex">
                            <Search size={16} className="text-slate-400" />
                            <input
                                type="search"
                                placeholder="Search..."
                                className="w-32 bg-transparent text-sm outline-none placeholder:text-slate-400 lg:w-44"
                            />
                            <span className="rounded border border-slate-200 px-1.5 py-0.5 text-[10px] text-slate-400">
                                /
                            </span>
                        </div>

                        <button
                            type="button"
                            aria-label="Notifications"
                            className="relative rounded-xl border border-slate-200 p-2.5 text-slate-500 transition hover:bg-slate-50"
                        >
                            <Bell size={19} />
                            <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-red-500" />
                        </button>

                        <div className="hidden h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700 sm:flex">
                            A
                        </div>
                    </div>
                </header>

                <main className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">
                    <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                                {currentPage.name === 'Overview'
                                    ? 'Welcome back, Admin'
                                    : currentPage.name}
                            </h1>
                            <p className="mt-1 text-sm text-slate-500">
                                {currentPage.name === 'Overview'
                                    ? 'Here is what is happening on your platform today.'
                                    : `Manage and monitor ${currentPage.name.toLowerCase()} on SeniorPro.`}
                            </p>
                        </div>

                        {currentPage.name === 'Overview' && (
                            <button
                                type="button"
                                onClick={() => window.print()}
                                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                            >
                                <Download size={16} />
                                <span className="hidden sm:inline">Export / Print</span>
                                <span className="sm:hidden">Export</span>
                            </button>
                        )}
                    </div>

                    {renderPage()}

                    <footer className="mt-10 border-t border-slate-200 py-5 text-center text-xs text-slate-400">
                        © {new Date().getFullYear()} SeniorPro Admin Panel
                    </footer>
                </main>
            </div>
        </div>
    );
}