import {useState} from 'react'
import './css/App.css'
import { IconBriefcase } from '@tabler/icons-react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function Home() {
    return (
        <>
            <div style={{background: 'linear-gradient(180deg, #F5F6F8 0%, #fff 60%)'}}>
                <button className="bg-amber-100 my-5">
                    <a href='/senior_portal_prototype.html' target='_blank' style={{textDecoration: "none", color: "black"}}> Check for design</a>
                </button>
                <h1>This is Home page</h1>
            </div>
        </>
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

function Header() {
    return (
        <>
            <div className="flex flex-row justify-between px-10 py-3 items-center">
                <div className="leftLogo flex flex-row items-center space-x-2">
                    <IconBriefcase size={24} color="blue" /><p>SeniorPro</p>
                </div>
                <div className="centerContent">
                    <nav className="space-x-3">
                        <Link to="/">Home</Link>
                        <Link to="/opportunities">Find opportunities</Link>
                        <Link to="/employer">For employers</Link>
                        <Link to="/working">How it works</Link>
                    </nav>
                </div>
                <div className="rightContent">
                    <button className="px-2 py-1 bg-white text-black rounded-lg border border-black" type="button">Log in</button>
                    <button className="px-2 py-1 bg-orange-500 text-white rounded-lg ml-2">Join free</button>
                </div>
            </div>
            <hr className="w-full"/>
        </>
    )
}

function App() {
    // const [count, setCount] = useState(0)


    return (
        <>
            <BrowserRouter>
                <div className="firstApp" style={{background: '#FFFFFF'}}>
                    <Header />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/opportunities" element={<Opportunities />} />
                        <Route path="/employer" element={<Employer />} />
                        <Route path="/working" element={<Working />} />
                    </Routes>
                </div>
            </BrowserRouter>
        </>
    )
}

export default App
