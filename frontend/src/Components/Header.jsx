import { BriefcaseBusiness } from "lucide-react";
import { Link } from "react-router-dom";

export default function Header({ user, onLogout }) {
    return (
        <>
            <div className="flex items-center justify-between px-10 py-3">
                <Link to="/" className="flex items-center gap-2">
                    <BriefcaseBusiness size={24} className="text-blue-600" />
                    <p className="text-xl font-bold text-black">SeniorPro</p>
                </Link>

                <nav className="flex items-center gap-8">
                    <Link to="/">Home</Link>

                    <Link to="/opportunity">
                        Find opportunities
                    </Link>

                    {user?.role === "recruiter" && (
                        <Link to="/employer">
                            For employers
                        </Link>
                    )}

                    <Link to="/working">
                        How it works
                    </Link>

                    {/* {user?.role === "admin" && ( */}
                        <Link to="/admin">
                            Admin Page
                        </Link>
                    {/* )} */}
                </nav>

                <button
                    onClick={onLogout}
                    className="cursor-pointer rounded-lg border border-slate-300/75 bg-white px-3 py-1.5 text-sm text-black"
                >
                    Sign Out
                </button>
            </div>

            <hr className="w-full" />
        </>
    );
}