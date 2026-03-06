/*
 *   Copyright (c) 2022
 *   All rights reserved.
 */
import React, { useState, useMemo } from 'react';
import { useLinks } from '../context/LinksContext';
import { useFolders, buildTree } from '../context/FoldersContext';
import { useLocationContext } from '../hooks/useLocationContext';
import { useTheme } from '../context/ThemeContext';
import { useSearch } from '../hooks/useSearch';
import AppBar from '../components/AppBar';
import SidebarFolderTree from '../components/SidebarFolderTree';
import SidebarTagList from '../components/SidebarTagList';
import ContentLinkList from '../components/ContentLinkList';
import FolderFormModal from '../components/FolderFormModal';
import LinkFormModal from '../components/LinkFormModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import MoveToFolderModal from '../components/MoveToFolderModal';
import LoadingSpinner from '../components/LoadingSpinner';
import { HiOutlinePlus, HiOutlineDownload, HiOutlineUpload } from 'react-icons/hi';
import { downloadBookmarks, parseBookmarksFile } from '../utils/bookmarkIO';

export default function Manager() {
    const { allLinks, isLoading: linksLoading, addLink, updateLink, deleteLink, refetchLinks } = useLinks();
    const { allFolders, isLoading: foldersLoading, addFolder, updateFolder, deleteFolder, refetchFolders } = useFolders();
    const { locationContext, changeLocationContext } = useLocationContext();
    const { theme, toggleTheme } = useTheme();

    const isLoading = linksLoading || foldersLoading;

    const existingGroups = useMemo(() => {
        if (!allLinks) return [];
        const groupNames = new Set();
        for (const link of allLinks) {
            if (link.tileGroup) groupNames.add(link.tileGroup);
        }
        return [...groupNames].sort();
    }, [allLinks]);

    const tree = useMemo(() => {
        if (!allLinks) return { rootFolders: [], rootLinks: [], folderMap: {} };
        return buildTree(allFolders, allLinks);
    }, [allFolders, allLinks]);

    // Sidebar view mode: folders or tags
    const [viewMode, setViewMode] = useState('folders');

    // Selected folder in sidebar (null = "All Bookmarks", 'uncategorized' = root links only)
    const [selectedFolderId, setSelectedFolderId] = useState(null);

    // Selected tag in sidebar (null = all, '__untagged' = links without tags)
    const [selectedTag, setSelectedTag] = useState(null);

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

    // Import state
    const [isImporting, setIsImporting] = useState(false);

    // Build tag list with counts for sidebar
    const tagList = useMemo(() => {
        if (!allLinks) return [];
        const tagCounts = new Map();
        for (const link of allLinks) {
            if (link.tags?.length) {
                for (const tag of link.tags) {
                    tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
                }
            }
        }
        return [...tagCounts.entries()]
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([tag, count]) => ({ tag, count }));
    }, [allLinks]);

    const { searchQuery, setSearchQuery, filteredLinks: searchFilteredLinks } = useSearch(allLinks);

    // When searching, show results from all links; otherwise filter by selected folder or tag
    const displayedLinks = useMemo(() => {
        if (searchQuery.trim()) return searchFilteredLinks || [];

        if (viewMode === 'tags') {
            if (selectedTag === null) return allLinks || [];
            if (selectedTag === '__untagged') return (allLinks || []).filter(l => !l.tags?.length);
            return (allLinks || []).filter(l => l.tags?.includes(selectedTag));
        }

        if (selectedFolderId === null) return allLinks || [];
        if (selectedFolderId === 'uncategorized') return tree.rootLinks;
        const folder = tree.folderMap[selectedFolderId];
        if (!folder) return [];
        function collectLinks(folderNode) {
            let links = [...folderNode.links];
            for (const child of folderNode.children) {
                links = links.concat(collectLinks(child));
            }
            return links;
        }
        return collectLinks(folder);
    }, [searchQuery, searchFilteredLinks, viewMode, selectedTag, selectedFolderId, allLinks, tree]);

    const contentTitle = useMemo(() => {
        if (searchQuery.trim()) return 'Search Results';
        if (viewMode === 'tags') {
            if (selectedTag === null) return 'All Bookmarks';
            if (selectedTag === '__untagged') return 'Untagged';
            return selectedTag;
        }
        if (selectedFolderId === null) return 'All Bookmarks';
        if (selectedFolderId === 'uncategorized') return 'Uncategorized';
        const folder = tree.folderMap[selectedFolderId];
        return folder?.name || 'Unknown';
    }, [searchQuery, viewMode, selectedTag, selectedFolderId, tree.folderMap]);

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

    const handleExport = () => {
        downloadBookmarks(tree);
    };

    const handleImport = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.html,.htm';
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            setIsImporting(true);
            try {
                const htmlString = await file.text();
                const parsed = parseBookmarksFile(htmlString);

                // Create folders first, mapping import IDs to real Firestore IDs
                const folderIdMap = {};
                for (const folder of parsed.folders) {
                    const realParentId = folder.parentId ? folderIdMap[folder.parentId] : null;
                    const created = await addFolder({ name: folder.name, parentId: realParentId || null });
                    folderIdMap[folder._importId] = created.id;
                }

                // Create links with mapped folder IDs
                for (const link of parsed.links) {
                    const { _importFolderId, ...linkData } = link;
                    const folderId = _importFolderId ? folderIdMap[_importFolderId] : null;
                    await addLink({ ...linkData, folderId: folderId || null });
                }

                await refetchLinks();
                await refetchFolders();
            } catch (error) {
                console.error('Import failed:', error);
            } finally {
                setIsImporting(false);
            }
        };
        input.click();
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

            <div className="pt-16 flex h-screen">
                {isLoading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <LoadingSpinner />
                    </div>
                ) : (
                    <>
                        <aside className="w-72 flex-shrink-0 bg-gray-900 border-r border-gray-800 flex flex-col h-full">
                            <div className="px-3 py-2 border-b border-gray-800 flex items-center gap-1">
                                <div className="flex items-center bg-gray-800 rounded-lg border border-gray-700 p-0.5 flex-1">
                                    {[
                                        { value: 'folders', label: 'Folders' },
                                        { value: 'tags', label: 'Tags' },
                                    ].map(option => (
                                        <button
                                            key={option.value}
                                            onClick={() => {
                                                setViewMode(option.value);
                                                setSelectedFolderId(null);
                                                setSelectedTag(null);
                                            }}
                                            className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                                                viewMode === option.value
                                                    ? 'bg-blue-600 text-white'
                                                    : 'text-gray-400 hover:text-gray-200'
                                            }`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {viewMode === 'folders' ? (
                                <SidebarFolderTree
                                    tree={tree}
                                    selectedFolderId={selectedFolderId}
                                    onSelectFolder={setSelectedFolderId}
                                    onAddRootFolder={handleAddRootFolder}
                                    onAddSubfolder={handleAddSubfolder}
                                    onRenameFolder={handleRenameFolder}
                                    onDeleteFolder={handleDeleteFolder}
                                />
                            ) : (
                                <SidebarTagList
                                    tags={tagList}
                                    selectedTag={selectedTag}
                                    onSelectTag={setSelectedTag}
                                    totalLinks={(allLinks || []).length}
                                />
                            )}
                        </aside>

                        <main className="flex-1 flex flex-col overflow-hidden">
                            <div className="flex items-center justify-between px-6 py-3 border-b border-gray-800">
                                <div>
                                    <h2 className="text-lg font-semibold text-white">{contentTitle}</h2>
                                    <p className="text-xs text-gray-500">{(displayedLinks).length} link{(displayedLinks).length !== 1 ? 's' : ''}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handleImport}
                                        disabled={isImporting}
                                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-gray-800 border border-gray-700
                                                   hover:bg-gray-700 text-gray-300 text-sm rounded-lg transition-colors disabled:opacity-50"
                                        title="Import bookmarks"
                                    >
                                        <HiOutlineUpload size={16} /> {isImporting ? 'Importing...' : 'Import'}
                                    </button>
                                    <button
                                        onClick={handleExport}
                                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-gray-800 border border-gray-700
                                                   hover:bg-gray-700 text-gray-300 text-sm rounded-lg transition-colors"
                                        title="Export bookmarks"
                                    >
                                        <HiOutlineDownload size={16} /> Export
                                    </button>
                                    <button
                                        onClick={handleAddLink}
                                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-600
                                                   hover:bg-blue-500 text-white text-sm rounded-lg transition-colors"
                                    >
                                        <HiOutlinePlus size={16} /> Add Link
                                    </button>
                                </div>
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
                existingGroups={existingGroups}
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
