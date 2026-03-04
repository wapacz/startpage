/*
 *   Copyright (c) 2022
 *   All rights reserved.
 */
import React, { useState, useRef, useEffect } from 'react';
import { HiOutlineExternalLink, HiOutlinePencil, HiOutlineTrash, HiDotsVertical } from 'react-icons/hi';

const CONTEXT_BADGE_COLORS = {
    work: 'bg-blue-900 text-blue-300',
    home: 'bg-green-900 text-green-300',
    both: 'bg-gray-700 text-gray-300',
};

export default function LinkCard({ link, onEdit, onDelete }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        }
        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isMenuOpen]);

    let faviconUrl = null;
    try {
        const hostname = new URL(link.url).hostname;
        faviconUrl = `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`;
    } catch { /* invalid URL */ }

    const linkContext = link.context || 'both';

    return (
        <div className="group relative bg-gray-900 border border-gray-800 rounded-xl p-5
                        hover:border-gray-600 transition-all duration-200">
            <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2 min-w-0">
                    {faviconUrl && (
                        <img src={faviconUrl} alt="" className="w-5 h-5 flex-shrink-0"
                             onError={(e) => { e.target.style.display = 'none'; }} />
                    )}
                    <a href={link.url}
                       {...(link.newTab && { target: '_blank', rel: 'noreferrer' })}
                       className="text-white font-medium truncate hover:text-blue-400 transition-colors">
                        {link.name}
                    </a>
                    {link.newTab && <HiOutlineExternalLink className="text-gray-600 flex-shrink-0" size={14} />}
                </div>

                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-gray-500 hover:text-white
                                   transition-all rounded"
                    >
                        <HiDotsVertical size={16} />
                    </button>
                    {isMenuOpen && (
                        <div className="absolute right-0 top-8 bg-gray-800 border border-gray-700 rounded-lg
                                        shadow-lg py-1 z-10 min-w-[120px]">
                            <button
                                onClick={() => { onEdit(link); setIsMenuOpen(false); }}
                                className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-700
                                           flex items-center gap-2"
                            >
                                <HiOutlinePencil size={14} /> Edit
                            </button>
                            <button
                                onClick={() => { onDelete(link.id); setIsMenuOpen(false); }}
                                className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-gray-700
                                           flex items-center gap-2"
                            >
                                <HiOutlineTrash size={14} /> Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {link.description && (
                <p className="text-sm text-gray-400 mb-3 line-clamp-2">{link.description}</p>
            )}

            <p className="text-xs text-gray-600 truncate mb-3">{link.url}</p>

            <div className="flex flex-wrap items-center gap-1.5">
                {linkContext !== 'both' && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${CONTEXT_BADGE_COLORS[linkContext] || CONTEXT_BADGE_COLORS.both}`}>
                        {linkContext}
                    </span>
                )}
                {link.tags?.map(tag => (
                    <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-purple-900/50 text-purple-300">
                        {tag}
                    </span>
                ))}
                {link.keywords?.map(keyword => (
                    <span key={keyword} className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-500">
                        {keyword}
                    </span>
                ))}
            </div>
        </div>
    );
}
