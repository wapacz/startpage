/*
 *   Copyright (c) 2022
 *   All rights reserved.
 */
import React, { useState, useMemo } from 'react';
import { useLinks } from '../context/LinksContext';
import { useSearch } from '../hooks/useSearch';
import { useLocationContext } from '../hooks/useLocationContext';
import { useTheme } from '../context/ThemeContext';
import AppBar from '../components/AppBar';
import LinkCard from '../components/LinkCard';
import LinkFormModal from '../components/LinkFormModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

export default function Links() {
    const { allLinks, isLoading, addLink, updateLink, deleteLink } = useLinks();
    const { locationContext, changeLocationContext } = useLocationContext();
    const { theme, toggleTheme } = useTheme();

    const locationFilteredLinks = useMemo(() => {
        if (!allLinks) return null;
        if (locationContext === 'all') return allLinks;
        return allLinks.filter(link => {
            const linkContext = link.context || 'both';
            return linkContext === 'both' || linkContext === locationContext;
        });
    }, [allLinks, locationContext]);

    const { searchQuery, setSearchQuery, filteredLinks: displayedLinks } = useSearch(locationFilteredLinks);

    const existingGroups = useMemo(() => {
        if (!allLinks) return [];
        const groupNames = new Set();
        for (const link of allLinks) {
            if (link.tileGroup) groupNames.add(link.tileGroup);
        }
        return [...groupNames].sort();
    }, [allLinks]);

    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingLink, setEditingLink] = useState(null);
    const [deletingLink, setDeletingLink] = useState(null);

    const handleAddLink = () => {
        setEditingLink(null);
        setIsFormModalOpen(true);
    };

    const handleEditLink = (link) => {
        setEditingLink(link);
        setIsFormModalOpen(true);
    };

    const handleSaveLink = async (linkData) => {
        if (editingLink) {
            await updateLink(editingLink.id, linkData);
        } else {
            await addLink(linkData);
        }
    };

    const handleDeleteRequest = (linkId) => {
        const linkToDelete = allLinks.find(link => link.id === linkId);
        setDeletingLink(linkToDelete);
    };

    const handleConfirmDelete = async () => {
        if (deletingLink) {
            await deleteLink(deletingLink.id);
            setDeletingLink(null);
        }
    };

    return (
        <>
            <AppBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                locationContext={locationContext}
                onLocationChange={changeLocationContext}
                onAddLink={handleAddLink}
                theme={theme}
                onToggleTheme={toggleTheme}
            />

            <main className="pt-20 px-6 pb-8">
                {isLoading && <LoadingSpinner />}

                {!isLoading && displayedLinks && displayedLinks.length === 0 && (
                    <EmptyState hasSearchQuery={!!searchQuery.trim()} onAddLink={handleAddLink} />
                )}

                {!isLoading && displayedLinks && displayedLinks.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                        {displayedLinks.map(link => (
                            <LinkCard
                                key={link.id}
                                link={link}
                                onEdit={handleEditLink}
                                onDelete={handleDeleteRequest}
                            />
                        ))}
                    </div>
                )}
            </main>

            <LinkFormModal
                isOpen={isFormModalOpen}
                onClose={() => setIsFormModalOpen(false)}
                onSave={handleSaveLink}
                editingLink={editingLink}
                existingGroups={existingGroups}
            />

            <DeleteConfirmModal
                isOpen={!!deletingLink}
                linkName={deletingLink?.name}
                onConfirm={handleConfirmDelete}
                onCancel={() => setDeletingLink(null)}
            />
        </>
    );
}
