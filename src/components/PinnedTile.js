/*
 *   Copyright (c) 2022
 *   All rights reserved.
 */
import React from 'react';
import { getIconComponent } from './IconPicker';

function TileIcon({ link }) {
    if (link.iconType === 'favicon') {
        let hostname = '';
        try { hostname = new URL(link.url).hostname; } catch { /* invalid URL */ }
        return (
            <img
                src={`https://www.google.com/s2/favicons?domain=${hostname}&sz=64`}
                alt=""
                className="w-10 h-10 rounded-lg group-hover:scale-110 transition-transform"
                onError={(e) => {
                    e.target.style.display = 'none';
                }}
            />
        );
    }

    const IconComponent = getIconComponent(link.icon);
    return (
        <IconComponent
            size={40}
            className="text-gray-400 group-hover:text-blue-400 transition-colors"
        />
    );
}

export default function PinnedTile({ link }) {
    return (
        <a
            href={link.url}
            {...(link.newTab && { target: '_blank', rel: 'noreferrer' })}
            title={link.name}
            className="flex flex-col items-center justify-center gap-3 p-2
                       w-32 h-32
                       bg-gray-900 border border-gray-800 rounded-2xl
                       hover:bg-gray-800 hover:border-gray-600 hover:scale-105
                       transition-all duration-200 cursor-pointer group"
        >
            <TileIcon link={link} />
            <span className="text-xs font-light text-gray-400 group-hover:text-white text-center leading-tight transition-colors w-full truncate px-1">
                {link.name}
            </span>
        </a>
    );
}
