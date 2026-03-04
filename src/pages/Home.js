/*
 *   Copyright (c) 2022
 *   All rights reserved.
 */
import React, { useState, useMemo } from 'react';
import { useLinks } from '../context/LinksContext';
import { useLocationContext } from '../hooks/useLocationContext';
import AppBar from '../components/AppBar';
import PinnedTile from '../components/PinnedTile';
import LinkFormModal from '../components/LinkFormModal';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';
import { HiOutlinePlus } from 'react-icons/hi';

export default function Home() {
    const { allLinks, isLoading, addLink } = useLinks();
    const { locationContext, changeLocationContext } = useLocationContext();

    const [isFormModalOpen, setIsFormModalOpen] = useState(false);

    const pinnedLinks = useMemo(() => {
        if (!allLinks) return [];
        return allLinks.filter(link => {
            if (!link.pinned) return false;
            if (locationContext === 'all') return true;
            const linkContext = link.context || 'both';
            return linkContext === 'both' || linkContext === locationContext;
        });
    }, [allLinks, locationContext]);

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
                    <div className="flex flex-wrap justify-center gap-4 w-3/5">
                        {pinnedLinks.map(link => (
                            <PinnedTile key={link.id} link={link} />
                        ))}
                        <button
                            onClick={handleAddLink}
                            className="flex flex-col items-center justify-center gap-3
                                       w-32 h-32
                                       border-2 border-dashed border-gray-800 rounded-2xl
                                       hover:border-gray-600 transition-all duration-200
                                       cursor-pointer group"
                        >
                            <HiOutlinePlus size={28} className="text-gray-600 group-hover:text-gray-400 transition-colors" />
                        </button>
                    </div>
                )}
            </main>

            <Footer linkCount={allLinks?.length || 0} />

            <LinkFormModal
                isOpen={isFormModalOpen}
                onClose={() => setIsFormModalOpen(false)}
                onSave={handleSaveLink}
                editingLink={null}
            />
        </div>
    );
}
