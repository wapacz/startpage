/*
 *   Copyright (c) 2022
 *   All rights reserved.
 */
import React, { useState } from 'react';
import { HiOutlineFolder, HiOutlineFolderOpen, HiChevronRight, HiChevronDown, HiDotsVertical, HiOutlinePencil, HiOutlineTrash, HiOutlineFolderAdd } from 'react-icons/hi';

function SidebarFolderItem({ folder, depth, selectedFolderId, onSelectFolder, onAddSubfolder, onRenameFolder, onDeleteFolder }) {
    const [isExpanded, setIsExpanded] = useState(true);
    const [isHovered, setIsHovered] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = React.useRef(null);

    const isSelected = selectedFolderId === folder.id;
    const hasChildren = folder.children.length > 0;

    React.useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        }
        if (isMenuOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isMenuOpen]);

    const itemCount = folder.links.length + folder.children.length;

    return (
        <div>
            <div
                className={`flex items-center gap-1 py-1.5 px-2 rounded-lg cursor-pointer transition-colors ${
                    isSelected ? 'bg-blue-600/20 text-blue-400' : 'text-gray-300 hover:bg-gray-800/60'
                }`}
                style={{ paddingLeft: `${depth * 16 + 8}px` }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => { setIsHovered(false); if (!isMenuOpen) setIsMenuOpen(false); }}
            >
                <button
                    onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
                    className="p-0.5 text-gray-500 flex-shrink-0"
                >
                    {hasChildren ? (
                        isExpanded ? <HiChevronDown size={14} /> : <HiChevronRight size={14} />
                    ) : (
                        <span className="w-3.5 inline-block" />
                    )}
                </button>

                <button
                    onClick={() => onSelectFolder(folder.id)}
                    className="flex items-center gap-2 flex-1 min-w-0"
                >
                    {isExpanded && hasChildren
                        ? <HiOutlineFolderOpen size={16} className="text-yellow-500 flex-shrink-0" />
                        : <HiOutlineFolder size={16} className="text-yellow-600 flex-shrink-0" />
                    }
                    <span className="text-sm truncate">{folder.name}</span>
                    {itemCount > 0 && (
                        <span className="text-xs text-gray-600 flex-shrink-0">{itemCount}</span>
                    )}
                </button>

                <div className="relative flex-shrink-0" ref={menuRef}>
                    <button
                        onClick={(e) => { e.stopPropagation(); setIsMenuOpen(!isMenuOpen); }}
                        className={`p-0.5 text-gray-500 hover:text-white transition-all rounded ${
                            isHovered || isMenuOpen ? 'opacity-100' : 'opacity-0'
                        }`}
                    >
                        <HiDotsVertical size={12} />
                    </button>
                    {isMenuOpen && (
                        <div className="absolute right-0 top-6 bg-gray-800 border border-gray-700 rounded-lg shadow-lg py-1 z-20 min-w-[150px]">
                            <button onClick={() => { onAddSubfolder(folder.id, folder.name); setIsMenuOpen(false); }}
                                    className="w-full px-3 py-1.5 text-left text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-2">
                                <HiOutlineFolderAdd size={14} /> Add subfolder
                            </button>
                            <button onClick={() => { onRenameFolder(folder); setIsMenuOpen(false); }}
                                    className="w-full px-3 py-1.5 text-left text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-2">
                                <HiOutlinePencil size={14} /> Rename
                            </button>
                            <button onClick={() => { onDeleteFolder(folder.id); setIsMenuOpen(false); }}
                                    className="w-full px-3 py-1.5 text-left text-sm text-red-400 hover:bg-gray-700 flex items-center gap-2">
                                <HiOutlineTrash size={14} /> Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {isExpanded && hasChildren && (
                <div>
                    {folder.children.map(childFolder => (
                        <SidebarFolderItem
                            key={childFolder.id}
                            folder={childFolder}
                            depth={depth + 1}
                            selectedFolderId={selectedFolderId}
                            onSelectFolder={onSelectFolder}
                            onAddSubfolder={onAddSubfolder}
                            onRenameFolder={onRenameFolder}
                            onDeleteFolder={onDeleteFolder}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function SidebarFolderTree({ tree, selectedFolderId, onSelectFolder, onAddRootFolder, onAddSubfolder, onRenameFolder, onDeleteFolder }) {
    const totalLinks = tree.rootLinks.length + tree.rootFolders.reduce(
        function countLinks(total, folder) {
            return total + folder.links.length + folder.children.reduce(countLinks, 0);
        }, 0
    );

    return (
        <>
            <div className="px-4 py-2 border-b border-gray-800 flex items-center justify-between">
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Folders</span>
                <button
                    onClick={onAddRootFolder}
                    className="p-1 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors"
                    title="New folder"
                >
                    <HiOutlineFolderAdd size={16} />
                </button>
            </div>

            <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
                <button
                    onClick={() => onSelectFolder(null)}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                        selectedFolderId === null
                            ? 'bg-blue-600/20 text-blue-400'
                            : 'text-gray-300 hover:bg-gray-800/60'
                    }`}
                >
                    <HiOutlineFolder size={16} className="flex-shrink-0" />
                    <span>All Bookmarks</span>
                    {totalLinks > 0 && <span className="text-xs text-gray-600 ml-auto">{totalLinks}</span>}
                </button>

                {tree.rootFolders.map(folder => (
                    <SidebarFolderItem
                        key={folder.id}
                        folder={folder}
                        depth={0}
                        selectedFolderId={selectedFolderId}
                        onSelectFolder={onSelectFolder}
                        onAddSubfolder={onAddSubfolder}
                        onRenameFolder={onRenameFolder}
                        onDeleteFolder={onDeleteFolder}
                    />
                ))}

                {tree.rootLinks.length > 0 && (
                    <button
                        onClick={() => onSelectFolder('uncategorized')}
                        className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                            selectedFolderId === 'uncategorized'
                                ? 'bg-blue-600/20 text-blue-400'
                                : 'text-gray-300 hover:bg-gray-800/60'
                        }`}
                    >
                        <HiOutlineFolder size={16} className="text-gray-600 flex-shrink-0" />
                        <span>Uncategorized</span>
                        <span className="text-xs text-gray-600 ml-auto">{tree.rootLinks.length}</span>
                    </button>
                )}
            </nav>
        </>
    );
}
