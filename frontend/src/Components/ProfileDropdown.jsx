import { useEffect, useRef, useState } from "react";
import { User, CircleUser, BriefcaseBusiness, LogOut } from "lucide-react";
import { Link } from 'react-router-dom';

export default function ProfileDropdown({ onLogout, user }) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropDown = () => setIsOpen(!isOpen);

    // Reference tied to the main container div
    const dropdownRef = useRef(null);

    // Event listener to catch clicks outside the container
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            <button
                type="button"
                onClick={toggleDropDown}
                className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-100 transition-colors focus:outline-none"
                aria-label="User menu"
            >
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm shadow-sm">
                    {user?.name ? user.name.charAt(0).toUpperCase() : <CircleUser size={20} />}
                </div>
            </button>

            {isOpen && (
                <ul
                    className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl py-1 z-50 text-slate-700 animate-in fade-in zoom-in-95 duration-100"
                >
                    <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Signed in as</p>
                        <p className="text-sm font-medium text-gray-900 truncate">{user?.email || 'User'}</p>
                    </div>

                    <li>
                        <Link
                            to='/profile'
                            onClick={() => setIsOpen(false)}
                            className="flex items-center px-4 py-2 text-sm hover:bg-slate-50 transition-colors"
                        >
                            <User className="me-2 text-slate-500" size={16} /> Profile Page
                        </Link>
                    </li>

                    <li>
                        <Link
                            to='/job_applied'
                            onClick={() => setIsOpen(false)}
                            className="flex items-center px-4 py-2 text-sm hover:bg-slate-50 transition-colors"
                        >
                            <BriefcaseBusiness className="me-2 text-slate-500" size={16} /> Jobs Applied
                        </Link>
                    </li>

                    <li className="border-t border-gray-100 my-1"></li>

                    <li>
                        <button
                            type="button"
                            onClick={() => {
                                if (onLogout) onLogout();
                                setIsOpen(false);
                            }}
                            className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                        >
                            <LogOut className="me-2" size={16} /> Sign Out
                        </button>
                    </li>
                </ul>
            )}
        </div>
    );
}
