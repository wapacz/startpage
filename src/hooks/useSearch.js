/*
 *   Copyright (c) 2022
 *   All rights reserved.
 */
import { useState, useMemo } from 'react';

export function useSearch(links) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredLinks = useMemo(() => {
        if (!links) return null;
        if (!searchQuery.trim()) return links;

        const normalizedQuery = searchQuery.toLowerCase().trim();

        return links.filter(link => {
            const nameMatch = link.name?.toLowerCase().includes(normalizedQuery);
            const descriptionMatch = link.description?.toLowerCase().includes(normalizedQuery);
            const urlMatch = link.url?.toLowerCase().includes(normalizedQuery);
            const tagsMatch = link.tags?.some(tag => tag.toLowerCase().includes(normalizedQuery));
            const keywordsMatch = link.keywords?.some(keyword => keyword.toLowerCase().includes(normalizedQuery));
            return nameMatch || descriptionMatch || urlMatch || tagsMatch || keywordsMatch;
        });
    }, [links, searchQuery]);

    return { searchQuery, setSearchQuery, filteredLinks };
}
