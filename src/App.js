/*
 *   Copyright (c) 2022
 *   All rights reserved.
 */
import React from 'react';
import LoginPage from './components/LoginPage';
import Home from './pages/Home';
import Links from './pages/Links';
import Manager from './pages/Manager';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { firebaseService } from './FirebaseService';
import { LinksProvider } from './context/LinksContext';
import { FoldersProvider } from './context/FoldersContext';

function App() {
    const isAuth = firebaseService.useState();

    if (!isAuth) {
        return <LoginPage onSignIn={() => firebaseService.signIn()} />;
    }

    return (
        <LinksProvider>
            <FoldersProvider>
                <div className="min-h-screen bg-gray-950 text-gray-100">
                    <Router>
                        <Routes>
                            <Route path="/startpage" element={<Home />} />
                            <Route path="/startpage/links" element={<Links />} />
                            <Route path="/startpage/manager" element={<Manager />} />
                            <Route path="*" element={<Navigate to="/startpage" />} />
                        </Routes>
                    </Router>
                </div>
            </FoldersProvider>
        </LinksProvider>
    );
}

export default App;
