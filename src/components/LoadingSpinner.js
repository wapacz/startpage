/*
 *   Copyright (c) 2022
 *   All rights reserved.
 */
import React from 'react';

export default function LoadingSpinner() {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <div className="w-8 h-8 border-2 border-gray-700 border-t-blue-500 rounded-full animate-spin mb-4" />
            <span>Loading links...</span>
        </div>
    );
}
