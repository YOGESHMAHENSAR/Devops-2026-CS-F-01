import { BriefcaseBusiness, User } from "lucide-react";
import { useLocation,Link } from "react-router-dom";
import React from "react";
import ProfileDropdown from "./ProfileDropdown.jsx";

export default function Header({ user, onLogout }) {
    const location = useLocation();

    if (location.pathname.startsWith("/admin")) {
        return null;
    }

    return (
        <>
            <div className="flex items-center justify-between px-10 py-3 bg-white">
                <Link to="/" className="flex items-center gap-2">
                    <BriefcaseBusiness size={24} className="text-blue-600" />
                    <p className="text-xl font-bold text-black">
                        SeniorPro
                    </p>
                </Link>

                <nav className="flex items-center gap-8">
                    <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">Home</Link>

                    <Link to="/opportunity" className="text-gray-700 hover:text-blue-600 font-medium">
                        Find opportunities
                    </Link>

                    {user?.role === "recruiter" && (
                        <Link to="/employer" className="text-gray-700 hover:text-blue-600 font-medium">
                            For employers
                        </Link>
                    )}

                    <Link to="/working" className="text-gray-700 hover:text-blue-600 font-medium">
                        How it works
                    </Link>

                    {/* {user?.role === "admin" && ( */}
                        <Link to="/admin" className="text-gray-700 hover:text-blue-600 font-medium">
                            Admin Page
                        </Link>
                    {/* )} */}
                </nav>

                <div className="flex items-center gap-2">
                    <ProfileDropdown user={user} onLogout={onLogout} />
                </div>
            </div>

            <hr className="w-full border-gray-200" />
        </>
    );
}