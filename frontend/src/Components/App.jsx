import '../css/App.css'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import AuthPage from './AuthPage.jsx';
import Header from './Header.jsx';
import Protected from './Protected.jsx';

import AdminPage from '../Pages/Admin.jsx';
import PageNotFound from '../Pages/PageNotFound.jsx';
import Home from '../Pages/Home.jsx';
import Opportunity from '../Pages/Opportunity.jsx'
import Working from '../Pages/Working.jsx';
import Employer from '../Pages/Employer.jsx';
import {logout as clearAuth} from "../api/auth.js";
import {useState} from 'react';

function AppContent(){
    let [user, setUser] = useState(() =>{
        const saved = localStorage.getItem('user');
        return saved ? JSON.parse(saved) : null;
    })
    
    function handleLogout(){
        clearAuth(); //remove the local storage material
        setUser(null);
    }

    // if(!user){
    //     return <AuthPage onAuthSuccess={setUser} />
    // }
    return (
        <>
            <BrowserRouter>
                <div className="firstApp" style={{background: '#FFFFFF'}}>
                    {user && <Header user={user} onLogout={handleLogout} />}
                    <Routes>
                        <Route path='/login' element={
                            user ? <Navigate to='/' replace /> : <AuthPage onAuthSuccess={setUser} />
                        } />
                        <Route path="/" element={
                            <Protected user={user}><Home /></Protected> 
                        }/>
                        <Route path="/Opportunity" element={
                            <Protected user={user}><Opportunity/></Protected>
                        }/>
                        <Route path="/working" element={
                            <Protected user={user} ><Working /></Protected>
                        } />
                        <Route path="/Employer" element={
                            <Protected user={user} roles={['recruiter']} ><Employer /> </Protected>
                        } />
                        <Route path="/admin/*" element={
                            <Protected user={user} roles={['admin']}><AdminPage /></Protected>
                        } />
                        {/* <Route path="/login" element={<AuthPage onAuthSuccess={setUser} />} /> */}
                        <Route path= "*" element={<PageNotFound />}/>
                    </Routes>
                </div>
            </BrowserRouter>
        </>
    )
}

function App() {
    return (
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <AppContent />
        </GoogleOAuthProvider>
    );
}

export default App
