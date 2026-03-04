/*
 *   Copyright (c) 2022
 *   All rights reserved.
 */
import React from 'react';
import { FcGoogle } from 'react-icons/fc';

export default function LoginPage({ onSignIn }) {
    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-white mb-2">Start Page</h1>
                <p className="text-gray-400 mb-8">Your personal link dashboard</p>
                <button
                    onClick={onSignIn}
                    className="inline-flex items-center gap-3 px-6 py-3 bg-gray-800
                               hover:bg-gray-700 text-white rounded-lg border border-gray-700
                               transition-colors duration-200 text-lg"
                >
                    <FcGoogle size={24} />
                    Sign in with Google
                </button>
            </div>
        </div>
    );
}
