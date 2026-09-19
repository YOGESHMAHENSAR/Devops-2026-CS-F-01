import { IconBriefcase } from '@tabler/icons-react';
import { Link } from "react-router-dom";

export default function Header({user, onLogout}) {
    return (
        <>
            <div className="flex flex-row justify-between px-10 py-3 items-center">
                <div className="leftLogo flex flex-row items-center space-x-2">
                    <IconBriefcase size={24} color="blue" /><p className="text-xl text-black font-bold">SeniorPro</p>
                </div>
                <div className="centerContent">
                    <nav className="space-x-8">
                        <Link to="/">Home</Link>
                        <Link to="/Opportunity">Find opportunities</Link>
                        {user.role==='recruiter' && <Link to="/Employer">For employers</Link>}
                        <Link to="/working">How it works</Link>
                        {user.role==='admin' && <Link to="/admin">Admin Page</Link>}
                    </nav>
                </div>
                <div className="rightContent"> 
                    <button onClick={onLogout}  
                        className="cursor-pointer bg-white text-black rounded-lg border border-slate-300/75 text-sm px-3 py-1.5">
                        Sign Out
                    </button>
                </div>
            </div>
            <hr className="w-full"/>
        </>
    )
}