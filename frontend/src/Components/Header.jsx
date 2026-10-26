import { BriefcaseBusiness, User } from "lucide-react";
import { useLocation, NavLink } from "react-router-dom";
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
                <NavLink to="/" className="flex items-center gap-2">
                    <BriefcaseBusiness size={24} className="text-blue-600" />
                    <p className="text-xl font-bold text-black">SeniorPro</p>
                </NavLink>

                <nav className="flex items-center gap-8">
                    <NavLink to="/" className={({ isActive }) =>`text-sm font-medium transition-colors ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-900'}`}>
                        Home
                    </NavLink>

                    <NavLink to="/opportunity" className={({ isActive }) =>`text-sm font-medium transition-colors ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-900'}`}>
                        Find opportunities
                    </NavLink>

                    {user?.role === "recruiter" && (
                        <NavLink to="/employer" className={({ isActive }) =>`text-sm font-medium transition-colors ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-900'}`}>
                            For employers
                        </NavLink>
                    )}

                    <NavLink to="/working" className={({ isActive }) =>`text-sm font-medium transition-colors ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-900'}`}>
                        How it works
                    </NavLink>

                    {/* {user?.role === "admin" && ( */}
                    <NavLink to="/admin" className={({ isActive }) =>`text-sm font-medium transition-colors ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-900'}`}>
                        Admin Page
                    </NavLink>
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