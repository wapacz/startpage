/*
 *   Copyright (c) 2022
 *   All rights reserved.
 */
import React, { useState, useRef, useEffect } from 'react';
import { HiOutlineExternalLink, HiOutlinePencil, HiOutlineTrash, HiDotsVertical, HiOutlineSwitchHorizontal } from 'react-icons/hi';

function ContentLinkRow({ link, onEdit, onDelete, onMove }) {
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
        <div className="group flex items-center gap-3 py-2.5 px-4 border-b border-gray-800/50 last:border-b-0 hover:bg-gray-800/30 transition-colors">
            <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                {faviconUrl ? (
                    <img src={faviconUrl} alt="" className="w-5 h-5 rounded"
                         onError={(e) => { e.target.style.display = 'none'; }} />
                ) : (
                    <div className="w-5 h-5 rounded bg-gray-800" />
                )}
            </div>

            <div className="flex-1 min-w-0">
                <a href={link.url}
                   {...(link.newTab && { target: '_blank', rel: 'noreferrer' })}
                   className="text-sm text-gray-200 hover:text-blue-400 transition-colors truncate block">
                    {link.name}
                </a>
                <span className="text-xs text-gray-600 truncate block">{link.url}</span>
            </div>

            {link.context && link.context !== 'both' && (
                <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                    link.context === 'work' ? 'bg-blue-900/40 text-blue-400' : 'bg-green-900/40 text-green-400'
                }`}>
                    {link.context}
                </span>
            )}

            {link.newTab && (
                <HiOutlineExternalLink className="text-gray-700 flex-shrink-0" size={14} />
            )}

            <div className="relative flex-shrink-0" ref={menuRef}>
                <button onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-500 hover:text-white transition-all rounded hover:bg-gray-700">
                    <HiDotsVertical size={14} />
                </button>
                {isMenuOpen && (
                    <div className="absolute right-0 top-8 bg-gray-800 border border-gray-700 rounded-lg shadow-lg py-1 z-10 min-w-[140px]">
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

function groupLinks(links, groupBy) {
    if (groupBy === 'none') return null;

    const groups = new Map();

    for (const link of links) {
        if (groupBy === 'tags') {
            const tags = link.tags?.length ? link.tags : [null];
            for (const tag of tags) {
                const key = tag || '__untagged';
                if (!groups.has(key)) groups.set(key, []);
                groups.get(key).push(link);
            }
        } else if (groupBy === 'context') {
            const key = link.context || 'both';
            if (!groups.has(key)) groups.set(key, []);
            groups.get(key).push(link);
        }
    }

    // Sort group keys alphabetically, but put __untagged / 'both' at the end
    const sortedEntries = [...groups.entries()].sort((a, b) => {
        if (a[0] === '__untagged' || a[0] === 'both') return 1;
        if (b[0] === '__untagged' || b[0] === 'both') return -1;
        return a[0].localeCompare(b[0]);
    });

    return sortedEntries;
}

const GROUP_LABELS = {
    __untagged: 'Untagged',
    both: 'Both',
    work: 'Work',
    home: 'Home',
};

export default function ContentLinkList({ links, onEditLink, onDeleteLink, onMoveLink, groupBy = 'none' }) {
    if (links.length === 0) {
        return (
            <div className="text-center text-gray-500 py-16">
                <p className="text-sm">No links in this folder</p>
            </div>
        );
    }

    const grouped = groupLinks(links, groupBy);

    if (!grouped) {
        return (
            <div className="divide-y divide-gray-800/50">
                {links.map(link => (
                    <ContentLinkRow
                        key={link.id}
                        link={link}
                        onEdit={onEditLink}
                        onDelete={onDeleteLink}
                        onMove={onMoveLink}
                    />
                ))}
            </div>
        );
    }

    return (
        <div>
            {grouped.map(([groupKey, groupedLinks]) => (
                <div key={groupKey}>
                    <div className="sticky top-0 z-10 px-4 py-1.5 bg-gray-800/60 backdrop-blur-sm border-b border-gray-800/50">
                        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                            {GROUP_LABELS[groupKey] || groupKey}
                        </span>
                        <span className="text-xs text-gray-600 ml-2">{groupedLinks.length}</span>
                    </div>
                    {groupedLinks.map(link => (
                        <ContentLinkRow
                            key={`${groupKey}-${link.id}`}
                            link={link}
                            onEdit={onEditLink}
                            onDelete={onDeleteLink}
                            onMove={onMoveLink}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}
