/*
 *   Copyright (c) 2022
 *   All rights reserved.
 */
import React, { useState, useRef, useEffect } from 'react';
import { HiOutlineExternalLink, HiOutlinePencil, HiOutlineTrash, HiDotsVertical, HiOutlineSwitchHorizontal } from 'react-icons/hi';

export default function TreeLinkItem({ link, onEdit, onDelete, onMove }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        }
        if (isMenuOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isMenuOpen]);

    let faviconUrl = null;
    try {
        const hostname = new URL(link.url).hostname;
        faviconUrl = `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`;
    } catch { /* invalid URL */ }

    return (
        <div className="group flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-gray-800/50 transition-colors">
            {faviconUrl && (
                <img src={faviconUrl} alt="" className="w-4 h-4 flex-shrink-0"
                     onError={(e) => { e.target.style.display = 'none'; }} />
            )}
            <a href={link.url}
               {...(link.newTab && { target: '_blank', rel: 'noreferrer' })}
               className="flex-1 text-sm text-gray-300 hover:text-blue-400 truncate transition-colors">
                {link.name}
            </a>
            {link.newTab && <HiOutlineExternalLink className="text-gray-700 flex-shrink-0" size={12} />}

            <div className="relative" ref={menuRef}>
                <button onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-gray-500 hover:text-white transition-all rounded">
                    <HiDotsVertical size={14} />
                </button>
                {isMenuOpen && (
                    <div className="absolute right-0 top-7 bg-gray-800 border border-gray-700 rounded-lg shadow-lg py-1 z-10 min-w-[140px]">
                        <button onClick={() => { onEdit(link); setIsMenuOpen(false); }}
                                className="w-full px-3 py-1.5 text-left text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-2">
                            <HiOutlinePencil size={14} /> Edit
                        </button>
                        <button onClick={() => { onMove(link); setIsMenuOpen(false); }}
                                className="w-full px-3 py-1.5 text-left text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-2">
                            <HiOutlineSwitchHorizontal size={14} /> Move
                        </button>
                        <button onClick={() => { onDelete(link.id); setIsMenuOpen(false); }}
                                className="w-full px-3 py-1.5 text-left text-sm text-red-400 hover:bg-gray-700 flex items-center gap-2">
                            <HiOutlineTrash size={14} /> Delete
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
