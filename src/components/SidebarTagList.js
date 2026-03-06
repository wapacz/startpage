/*
 *   Copyright (c) 2022
 *   All rights reserved.
 */
import React from 'react';
import { HiOutlineTag, HiOutlineCollection } from 'react-icons/hi';

export default function SidebarTagList({ tags, selectedTag, onSelectTag, totalLinks }) {
    return (
        <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
            <button
                onClick={() => onSelectTag(null)}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                    selectedTag === null
                        ? 'bg-blue-600/20 text-blue-400'
                        : 'text-gray-300 hover:bg-gray-800/60'
                }`}
            >
                <HiOutlineCollection size={16} className="flex-shrink-0" />
                <span>All Bookmarks</span>
                {totalLinks > 0 && <span className="text-xs text-gray-600 ml-auto">{totalLinks}</span>}
            </button>

            {tags.map(({ tag, count }) => (
                <button
                    key={tag}
                    onClick={() => onSelectTag(tag)}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                        selectedTag === tag
                            ? 'bg-blue-600/20 text-blue-400'
                            : 'text-gray-300 hover:bg-gray-800/60'
                    }`}
                >
                    <HiOutlineTag size={16} className="text-purple-400 flex-shrink-0" />
                    <span className="truncate">{tag}</span>
                    <span className="text-xs text-gray-600 ml-auto flex-shrink-0">{count}</span>
                </button>
            ))}

            <button
                onClick={() => onSelectTag('__untagged')}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                    selectedTag === '__untagged'
                        ? 'bg-blue-600/20 text-blue-400'
                        : 'text-gray-300 hover:bg-gray-800/60'
                }`}
            >
                <HiOutlineTag size={16} className="text-gray-600 flex-shrink-0" />
                <span>Untagged</span>
            </button>
        </nav>
    );
}
