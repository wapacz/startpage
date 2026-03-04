/*
 *   Copyright (c) 2022
 *   All rights reserved.
 */
import React from 'react';
import { HiOutlineSearch, HiOutlinePlus } from 'react-icons/hi';

export default function EmptyState({ hasSearchQuery, onAddLink }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            {hasSearchQuery ? (
                <>
                    <HiOutlineSearch size={48} className="mb-4 text-gray-600" />
                    <p className="text-lg">No links match your search</p>
                    <p className="text-sm text-gray-600 mt-1">Try a different search term or change the location filter</p>
                </>
            ) : (
                <>
                    <HiOutlinePlus size={48} className="mb-4 text-gray-600" />
                    <p className="text-lg">No links yet</p>
                    <button onClick={onAddLink}
                            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors">
                        Add your first link
                    </button>
                </>
            )}
        </div>
    );
}
