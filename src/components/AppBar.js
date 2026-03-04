/*
 *   Copyright (c) 2022
 *   All rights reserved.
 */
import React, { useState } from 'react';
import { HiOutlineSearch, HiOutlineLogout, HiOutlinePlus, HiOutlineMenu, HiOutlineX, HiOutlineHome, HiOutlineCollection, HiOutlineViewList } from 'react-icons/hi';
import { Link, useLocation } from 'react-router-dom';
import { firebaseService } from '../FirebaseService';

const LOCATION_OPTIONS = [
    { value: 'all', label: 'All' },
    { value: 'work', label: 'Work' },
    { value: 'home', label: 'Home' },
];

export default function AppBar({ searchQuery, onSearchChange, locationContext, onLocationChange, onAddLink, showSearch = true }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const currentPath = location.pathname.replace(/\/$/, '');

    const navItems = [
        { path: '/startpage', label: 'Home', icon: HiOutlineHome },
        { path: '/startpage/links', label: 'Links', icon: HiOutlineCollection },
        { path: '/startpage/manager', label: 'Manager', icon: HiOutlineViewList },
    ];

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
            <div className="mx-auto px-6 h-16 flex items-center gap-4">
                <Link to="/startpage" className="text-lg font-semibold text-white whitespace-nowrap hover:text-blue-400 transition-colors">
                    Start Page
                </Link>

                <nav className="hidden sm:flex items-center gap-1">
                    {navItems.map(({ path, label, icon: Icon }) => (
                        <Link key={path} to={path}
                              className={`px-3 py-1.5 text-sm rounded-md transition-colors flex items-center gap-1.5 ${
                                  currentPath === path ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-gray-200'
                              }`}>
                            <Icon size={16} /> {label}
                        </Link>
                    ))}
                </nav>

                {showSearch && (
                    <div className="flex-1 max-w-xl relative">
                        <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search links..."
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg
                                       text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2
                                       focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                    </div>
                )}

                {!showSearch && <div className="flex-1" />}

                <div className="hidden sm:flex items-center bg-gray-800 rounded-lg border border-gray-700 p-0.5">
                    {LOCATION_OPTIONS.map(option => (
                        <button
                            key={option.value}
                            onClick={() => onLocationChange(option.value)}
                            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                                locationContext === option.value
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-400 hover:text-gray-200'
                            }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>

                <button
                    onClick={onAddLink}
                    className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 bg-blue-600
                               hover:bg-blue-500 text-white text-sm rounded-lg transition-colors"
                >
                    <HiOutlinePlus size={18} />
                    Add Link
                </button>

                <button
                    onClick={() => firebaseService.signOut()}
                    className="hidden sm:inline-flex p-2 text-gray-400 hover:text-white transition-colors"
                    title="Logout"
                >
                    <HiOutlineLogout size={20} />
                </button>

                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="sm:hidden p-2 text-gray-400 hover:text-white"
                >
                    {isMobileMenuOpen ? <HiOutlineX size={24} /> : <HiOutlineMenu size={24} />}
                </button>
            </div>

            {isMobileMenuOpen && (
                <div className="sm:hidden bg-gray-900 border-t border-gray-800 px-4 py-3 space-y-3">
                    <div className="flex gap-2">
                        {navItems.map(({ path, label }) => (
                            <Link key={path} to={path} onClick={() => setIsMobileMenuOpen(false)}
                                  className={`flex-1 py-2 text-sm rounded-lg text-center transition-colors ${
                                      currentPath === path ? 'bg-gray-800 text-white' : 'text-gray-400'
                                  }`}>
                                {label}
                            </Link>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        {LOCATION_OPTIONS.map(option => (
                            <button
                                key={option.value}
                                onClick={() => onLocationChange(option.value)}
                                className={`flex-1 py-2 text-sm rounded-lg transition-colors ${
                                    locationContext === option.value
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-800 text-gray-400'
                                }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                    <button onClick={() => { onAddLink(); setIsMobileMenuOpen(false); }}
                            className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm">
                        Add Link
                    </button>
                    <button onClick={() => firebaseService.signOut()}
                            className="w-full py-2 bg-gray-800 text-gray-400 rounded-lg text-sm">
                        Logout
                    </button>
                </div>
            )}
        </header>
    );
}
