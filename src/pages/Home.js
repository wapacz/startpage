/*
 *   Copyright (c) 2022
 *   All rights reserved.
 */
import React, { useState, useMemo } from 'react';
import { useLinks } from '../context/LinksContext';
import { useLocationContext } from '../hooks/useLocationContext';
import { useTheme } from '../context/ThemeContext';
import AppBar from '../components/AppBar';
import PinnedTile from '../components/PinnedTile';
import LinkFormModal from '../components/LinkFormModal';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Home() {
    const { allLinks, isLoading, addLink } = useLinks();
    const { locationContext, changeLocationContext } = useLocationContext();
    const { theme, toggleTheme } = useTheme();

    const [isFormModalOpen, setIsFormModalOpen] = useState(false);

    const pinnedLinks = useMemo(() => {
        if (!allLinks) return [];
        return allLinks
            .filter(link => {
                if (!link.pinned) return false;
                if (locationContext === 'all') return true;
                const linkContext = link.context || 'both';
                return linkContext === 'both' || linkContext === locationContext;
            })
            .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    }, [allLinks, locationContext]);

    const groupedPinnedLinks = useMemo(() => {
        const groups = new Map();
        for (const link of pinnedLinks) {
            const groupName = link.tileGroup || null;
            if (!groups.has(groupName)) groups.set(groupName, []);
            groups.get(groupName).push(link);
        }
        return groups;
    }, [pinnedLinks]);

    const existingGroups = useMemo(() => {
        if (!allLinks) return [];
        const groupNames = new Set();
        for (const link of allLinks) {
            if (link.tileGroup) groupNames.add(link.tileGroup);
        }
        return [...groupNames].sort();
    }, [allLinks]);

    const hasGroups = useMemo(() => {
        for (const key of groupedPinnedLinks.keys()) {
            if (key !== null) return true;
        }
        return false;
    }, [groupedPinnedLinks]);

    const handleAddLink = () => {
        setIsFormModalOpen(true);
    };

    const handleSaveLink = async (linkData) => {
        await addLink(linkData);
    };

    return (
        <div className="min-h-screen flex flex-col">
            <AppBar
                searchQuery=""
                onSearchChange={() => {}}
                locationContext={locationContext}
                onLocationChange={changeLocationContext}
                onAddLink={handleAddLink}
                showSearch={false}
                theme={theme}
                onToggleTheme={toggleTheme}
            />

            <main className="flex-1 flex flex-col items-center justify-center px-6 pt-20 pb-8">
                {isLoading && <LoadingSpinner />}

                {!isLoading && pinnedLinks.length === 0 && (
                    <div className="text-center text-gray-500">
                        <p className="text-lg mb-2">No pinned tiles yet</p>
                        <p className="text-sm text-gray-600 mb-4">Add a link and pin it to show it here as a tile</p>
                        <button onClick={handleAddLink}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors">
                            Add your first tile
                        </button>
                    </div>
                )}

                {!isLoading && pinnedLinks.length > 0 && (
                    <div className="w-3/5 space-y-6">
                        {[...groupedPinnedLinks.entries()].map(([groupName, groupLinks]) => (
                            <div key={groupName ?? '__ungrouped'}>
                                {hasGroups && groupName && (
                                    <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                                        {groupName}
                                    </h2>
                                )}
                                <div className="flex flex-wrap justify-center gap-4">
                                    {groupLinks.map(link => (
                                        <PinnedTile key={link.id} link={link} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <Footer linkCount={allLinks?.length || 0} />

            <LinkFormModal
                isOpen={isFormModalOpen}
                onClose={() => setIsFormModalOpen(false)}
                onSave={handleSaveLink}
                editingLink={null}
                existingGroups={existingGroups}
            />
        </div>
    );
}
