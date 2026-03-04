/*
 *   Copyright (c) 2022
 *   All rights reserved.
 */
import React, { useState, useMemo } from 'react';
import { useLinks } from '../context/LinksContext';
import { useFolders, buildTree } from '../context/FoldersContext';
import { useLocationContext } from '../hooks/useLocationContext';
import AppBar from '../components/AppBar';
import SidebarFolderTree from '../components/SidebarFolderTree';
import ContentLinkList from '../components/ContentLinkList';
import FolderFormModal from '../components/FolderFormModal';
import LinkFormModal from '../components/LinkFormModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import MoveToFolderModal from '../components/MoveToFolderModal';
import LoadingSpinner from '../components/LoadingSpinner';
import { HiOutlinePlus } from 'react-icons/hi';

export default function Manager() {
    const { allLinks, isLoading: linksLoading, addLink, updateLink, deleteLink } = useLinks();
    const { allFolders, isLoading: foldersLoading, addFolder, updateFolder, deleteFolder } = useFolders();
    const { locationContext, changeLocationContext } = useLocationContext();

    const isLoading = linksLoading || foldersLoading;

    const tree = useMemo(() => {
        if (!allLinks) return { rootFolders: [], rootLinks: [], folderMap: {} };
        return buildTree(allFolders, allLinks);
    }, [allFolders, allLinks]);

    // Selected folder in sidebar (null = "All Bookmarks", 'uncategorized' = root links only)
    const [selectedFolderId, setSelectedFolderId] = useState(null);

    // Folder modal state
    const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
    const [editingFolder, setEditingFolder] = useState(null);
    const [newFolderParentId, setNewFolderParentId] = useState(null);
    const [newFolderParentName, setNewFolderParentName] = useState(null);

    // Link modal state
    const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
    const [editingLink, setEditingLink] = useState(null);
    const [newLinkFolderId, setNewLinkFolderId] = useState(null);

    // Delete state
    const [deletingItem, setDeletingItem] = useState(null);

    // Move state
    const [movingLink, setMovingLink] = useState(null);

    // Compute displayed links based on selected folder
    const displayedLinks = useMemo(() => {
        if (selectedFolderId === null) {
            // All bookmarks — collect all links from tree
            return allLinks || [];
        }
        if (selectedFolderId === 'uncategorized') {
            return tree.rootLinks;
        }
        const folder = tree.folderMap[selectedFolderId];
        if (!folder) return [];
        // Collect links from this folder and all nested subfolders
        function collectLinks(folderNode) {
            let links = [...folderNode.links];
            for (const child of folderNode.children) {
                links = links.concat(collectLinks(child));
            }
            return links;
        }
        return collectLinks(folder);
    }, [selectedFolderId, allLinks, tree]);

    const selectedFolderName = useMemo(() => {
        if (selectedFolderId === null) return 'All Bookmarks';
        if (selectedFolderId === 'uncategorized') return 'Uncategorized';
        const folder = tree.folderMap[selectedFolderId];
        return folder?.name || 'Unknown';
    }, [selectedFolderId, tree.folderMap]);

    // Folder actions
    const handleAddRootFolder = () => {
        setEditingFolder(null);
        setNewFolderParentId(null);
        setNewFolderParentName(null);
        setIsFolderModalOpen(true);
    };

    const handleAddSubfolder = (parentId, parentName) => {
        setEditingFolder(null);
        setNewFolderParentId(parentId);
        setNewFolderParentName(parentName);
        setIsFolderModalOpen(true);
    };

    const handleRenameFolder = (folder) => {
        setEditingFolder(folder);
        setIsFolderModalOpen(true);
    };

    const handleSaveFolder = async (name) => {
        if (editingFolder) {
            await updateFolder(editingFolder.id, { name });
        } else {
            await addFolder({ name, parentId: newFolderParentId || null });
        }
    };

    const handleDeleteFolder = (folderId) => {
        const folder = allFolders.find(f => f.id === folderId);
        setDeletingItem({ type: 'folder', id: folderId, name: folder?.name || 'folder' });
    };

    // Link actions
    const handleAddLink = () => {
        setEditingLink(null);
        // When a specific folder is selected, add link to that folder
        const targetFolderId = selectedFolderId && selectedFolderId !== 'uncategorized' ? selectedFolderId : null;
        setNewLinkFolderId(targetFolderId);
        setIsLinkModalOpen(true);
    };

    const handleEditLink = (link) => {
        setEditingLink(link);
        setNewLinkFolderId(link.folderId || null);
        setIsLinkModalOpen(true);
    };

    const handleSaveLink = async (linkData) => {
        const dataWithFolder = { ...linkData, folderId: newLinkFolderId || null };
        if (editingLink) {
            await updateLink(editingLink.id, dataWithFolder);
        } else {
            await addLink(dataWithFolder);
        }
    };

    const handleDeleteLink = (linkId) => {
        const link = allLinks.find(l => l.id === linkId);
        setDeletingItem({ type: 'link', id: linkId, name: link?.name || 'link' });
    };

    const handleConfirmDelete = async () => {
        if (!deletingItem) return;
        if (deletingItem.type === 'folder') {
            const folderLinks = allLinks.filter(l => l.folderId === deletingItem.id);
            for (const link of folderLinks) {
                await updateLink(link.id, { folderId: null });
            }
            const subfolders = allFolders.filter(f => f.parentId === deletingItem.id);
            for (const subfolder of subfolders) {
                await updateFolder(subfolder.id, { parentId: null });
            }
            await deleteFolder(deletingItem.id);
            if (selectedFolderId === deletingItem.id) {
                setSelectedFolderId(null);
            }
        } else {
            await deleteLink(deletingItem.id);
        }
        setDeletingItem(null);
    };

    // Move link
    const handleMoveLink = (link) => {
        setMovingLink(link);
    };

    const handleConfirmMove = async (targetFolderId) => {
        if (movingLink) {
            await updateLink(movingLink.id, { folderId: targetFolderId || null });
            setMovingLink(null);
        }
    };

    return (
        <>
            <AppBar
                searchQuery=""
                onSearchChange={() => {}}
                locationContext={locationContext}
                onLocationChange={changeLocationContext}
                onAddLink={handleAddLink}
                showSearch={false}
            />

            <div className="pt-16 flex h-screen">
                {isLoading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <LoadingSpinner />
                    </div>
                ) : (
                    <>
                        <SidebarFolderTree
                            tree={tree}
                            selectedFolderId={selectedFolderId}
                            onSelectFolder={setSelectedFolderId}
                            onAddRootFolder={handleAddRootFolder}
                            onAddSubfolder={handleAddSubfolder}
                            onRenameFolder={handleRenameFolder}
                            onDeleteFolder={handleDeleteFolder}
                        />

                        <main className="flex-1 flex flex-col overflow-hidden">
                            <div className="flex items-center justify-between px-6 py-3 border-b border-gray-800">
                                <div>
                                    <h2 className="text-lg font-semibold text-white">{selectedFolderName}</h2>
                                    <p className="text-xs text-gray-500">{displayedLinks.length} link{displayedLinks.length !== 1 ? 's' : ''}</p>
                                </div>
                                <button
                                    onClick={handleAddLink}
                                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-600
                                               hover:bg-blue-500 text-white text-sm rounded-lg transition-colors"
                                >
                                    <HiOutlinePlus size={16} /> Add Link
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto">
                                <ContentLinkList
                                    links={displayedLinks}
                                    onEditLink={handleEditLink}
                                    onDeleteLink={handleDeleteLink}
                                    onMoveLink={handleMoveLink}
                                />
                            </div>
                        </main>
                    </>
                )}
            </div>

            <FolderFormModal
                isOpen={isFolderModalOpen}
                onClose={() => setIsFolderModalOpen(false)}
                onSave={handleSaveFolder}
                editingFolder={editingFolder}
                parentFolderName={newFolderParentName}
            />

            <LinkFormModal
                isOpen={isLinkModalOpen}
                onClose={() => setIsLinkModalOpen(false)}
                onSave={handleSaveLink}
                editingLink={editingLink}
            />

            <DeleteConfirmModal
                isOpen={!!deletingItem}
                linkName={deletingItem?.name}
                onConfirm={handleConfirmDelete}
                onCancel={() => setDeletingItem(null)}
            />

            <MoveToFolderModal
                isOpen={!!movingLink}
                onClose={() => setMovingLink(null)}
                onMove={handleConfirmMove}
                linkName={movingLink?.name}
                folders={tree.rootFolders}
                currentFolderId={movingLink?.folderId}
            />
        </>
    );
}
