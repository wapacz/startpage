/*
 *   Copyright (c) 2022
 *   All rights reserved.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineCollection } from 'react-icons/hi';

export default function Footer({ linkCount }) {
    return (
        <footer className="mt-auto border-t border-gray-800 py-6 px-6">
            <div className="mx-auto flex items-center justify-between text-sm text-gray-500">
                <span>{linkCount} link{linkCount !== 1 ? 's' : ''} saved</span>
                <Link to="/startpage/links"
                      className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors">
                    <HiOutlineCollection size={16} />
                    View all links
                </Link>
            </div>
        </footer>
    );
}
