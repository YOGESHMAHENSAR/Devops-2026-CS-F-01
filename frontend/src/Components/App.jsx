import '../css/App.css'
import { IconBriefcase } from '@tabler/icons-react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import AdminPage from './Admin.jsx';
import PageNotFound from './PageNotFound.jsx'
import AuthPage from './AuthPage.jsx';
import {logout as clearAuth} from "../api/auth.js";
import {useState} from 'react';

function Home() {
    return (
        <div style={{background: 'linear-gradient(180deg, #F5F6F8 0%, #fff 60%)'}}>
            <button className="bg-amber-100 my-5">
             <a href='/senior_portal_prototype.html' target='_blank' style={{textDecoration: "none", color: "black"}}> Check for design</a>
            </button>
            <div className="topDev" style={{width: "680px", paddingTop: "10px", paddingBottom: "50px", margin:"0 auto"}}>
                <div className="text-orange-600">
                    <h4 className="text-sm">40–55+ YEARS EXPERIENCE, VALUED AGAIN</h4>
                </div>
                <div className="text-center">
                    <div className="text-4xl font-bold text-black my-3">Your experience is exactly what someone is looking for</div>
                    <p>Connect with organizations that need your consultancy, mentorship, advisory or part-time expertise — on your terms.</p>
                </div>
                <div className="flex flex-row justify-center space-x-3 mt-7">
                    <button className="cursor-pointer text-white bg-orange-500 rounded-lg px-4 py-1">Create your profile</button>
                    {/* <button className="cursor-pointer text-black border border-slate-300/75 rounded-lg px-4 py-1">Hire an expert</button> */}
                </div>
            </div>
            <div className="flex flex-row my-5" style={{width: "1000px", paddingBottom: "40px", margin:"0 auto"}}>
                <div className="bg-blue-950 rounded-l-2xl p-10 space-y-2">
                    <div className="text-center text-2xl text-white">I'm a professional</div>
                    <div className="text-sm text-gray-300 text-center">
                        Get matched with consultancy, mentorship and advisory work that fits your experience.
                    </div>
                    <button className="cursor-pointer text-sm font-medium rounded-md bg-white text-blue-950 px-3 py-1.5">Get Started</button>
                </div>
                <div className="bg-green-400 rounded-r-2xl p-10 space-y-2">
                <div className="text-center text-2xl text-white">I'm hiring</div>
                    <div className="text-sm text-gray-200 text-center">
                        Find verified, experienced professionals for guidance your team needs right now.
                    </div>
                    <button className="cursor-pointer bg-white text-green-400 rounded-lg px-3 py-1.5">Post an opportunity</button>
                </div>
            </div>
            <hr className="w-full border-slate-300/50"/>
            <div className="statsDiv" style={{width: "650px", margin: "34px auto 70px"}}>
                <div className="flex flex-row space-x-13">
                    <div className="text-center">
                        <h3 className="text-3xl font-bold text-black">12,400+</h3>
                        <p className="text-xs">Verified professionals</p>
                    </div>
                    <div className="text-center">
                        <h3 className="text-3xl font-bold text-black">3,200+</h3>
                        <p className="text-xs">Organizations</p>
                    </div>
                    <div className="text-center">
                        <h3 className="text-3xl font-bold text-black">40%</h3>
                        <p className="text-xs">Skill-based matching</p>
                    </div>
                    <div className="text-center">
                        <h3 className="text-3xl font-bold text-black">98%</h3>
                        <p className="text-xs">Verified profiles</p>
                    </div>
                </div>
            </div>
            <hr className="border-slate-300/50 w-full"/>
            <div className="infoDiv">
                <div className="flex flex-row justify-between">
                    <div className="border-r border-r-slate-300 p-8 text-start">
                        <h3 className="text-md font-bold text-black">Verified, always</h3>
                        <p className="text-xs">Every profile and company passes document review before going live.</p>
                    </div>
                    <div className="border-r border-r-slate-300 p-8 text-start">
                        <h3 className="text-md font-bold text-black">Smart matching</h3>
                        <p className="text-xs">Weighted on skills, experience, industry, work type and location.</p>
                    </div>
                    <div className="border-r border-r-slate-300 p-8 text-start">
                        <h3 className="text-md font-bold text-black">Work on your terms</h3>
                        <p className="text-xs">Full-time, part-time, consultancy or project-based — you choose.</p>
                    </div>
                    <div className="border-r border-r-slate-300 p-8 text-start">
                        <h3 className="text-md font-bold text-black">Built on trust</h3>
                        <p className="text-xs">Ratings and reviews after every engagement, both ways.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

function Opportunities() {
    return <h1>This is Opportunities Page.</h1>
}

function Employer() {
    return <h1>This page is only for staff memebers.</h1>
}

function Working() {
    return <h1>This is walk-through guide.</h1>
}

function handleLogout({setUser}){
    clearAuth(); //remove the local storage material
    setUser(null);
}

function Header({user, setUser}) {
    return (
        <>
            <div className="flex flex-row justify-between px-10 py-3 items-center">
                <div className="leftLogo flex flex-row items-center space-x-2">
                    <IconBriefcase size={24} color="blue" /><p className="text-xl text-black font-bold">SeniorPro</p>
                </div>
                <div className="centerContent">
                    <nav className="space-x-8">
                        <Link to="/">Home</Link>
                        <Link to="/opportunities">Find opportunities</Link>
                        <Link to="/employer">For employers</Link>
                        <Link to="/working">How it works</Link>
                        <Link to="/admin">Admin Page</Link>
                    </nav>
                </div>
                <div className="rightContent">
                    {!user ? <Link to="/login" >
                            <button className="cursor-pointer bg-white text-black rounded-lg border border-slate-300/75 text-sm px-3 py-1.5">Log in</button>
                        </Link> : 
                            <button onClick={() => handleLogout({setUser})}  className="cursor-pointer bg-white text-black rounded-lg border border-slate-300/75 text-sm px-3 py-1.5">Sign Out</button>
                        }
                </div>
            </div>
            <hr className="w-full"/>
        </>
    )
}

function App() {
    let [user, setUser] = useState(() =>{
        const saved = localStorage.getItem('user');
        return saved ? JSON.parse(saved) : null;
    })

    if(!user){
        return <AuthPage onAuthSuccess={setUser} />
    }
    return (
        <>
            <BrowserRouter>
                <div className="firstApp" style={{background: '#FFFFFF'}}>
                    <Header user={user.role} setUser={setUser} />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/opportunities" element={<Opportunities />} />
                        <Route path="/employer" element={<Employer />} />
                        <Route path="/working" element={<Working />} />
                        <Route path="/admin/*" element={<AdminPage />} />
                        <Route path="/login" element={<AuthPage onAuthSuccess={setUser} />} />
                        <Route path= "*" element={<PageNotFound />}/>
                    </Routes>
                </div>
            </BrowserRouter>
        </>
    )
}

export default App
