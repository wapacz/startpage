/*
 *   Copyright (c) 2022
 *   All rights reserved.
 */
import React, { useState, useRef, useEffect } from 'react';
import { HiOutlineFolder, HiOutlineFolderOpen, HiChevronRight, HiChevronDown, HiDotsVertical, HiOutlinePencil, HiOutlineTrash, HiOutlineFolderAdd, HiOutlinePlus } from 'react-icons/hi';
import TreeLinkItem from './TreeLinkItem';

export default function FolderNode({ folder, onAddSubfolder, onRenameFolder, onDeleteFolder, onEditLink, onDeleteLink, onMoveLink, onAddLinkToFolder, depth = 0 }) {
    const [isExpanded, setIsExpanded] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    const hasChildren = folder.children.length > 0 || folder.links.length > 0;

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        }
        if (isMenuOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isMenuOpen]);

    return (
        <div>
            <div className="group flex items-center gap-1 py-1.5 px-2 rounded-lg hover:bg-gray-800/50 transition-colors cursor-pointer"
                 style={{ paddingLeft: `${depth * 20 + 8}px` }}>
                <button onClick={() => setIsExpanded(!isExpanded)} className="p-0.5 text-gray-500">
                    {hasChildren ? (
                        isExpanded ? <HiChevronDown size={16} /> : <HiChevronRight size={16} />
                    ) : (
                        <span className="w-4" />
                    )}
                </button>

                <button onClick={() => setIsExpanded(!isExpanded)} className="flex items-center gap-2 flex-1 min-w-0">
                    {isExpanded
                        ? <HiOutlineFolderOpen size={18} className="text-yellow-500 flex-shrink-0" />
                        : <HiOutlineFolder size={18} className="text-yellow-600 flex-shrink-0" />
                    }
                    <span className="text-sm text-gray-200 truncate">{folder.name}</span>
                    <span className="text-xs text-gray-600">
                        {folder.links.length + folder.children.length}
                    </span>
                </button>

                <div className="relative" ref={menuRef}>
                    <button onClick={(e) => { e.stopPropagation(); setIsMenuOpen(!isMenuOpen); }}
                            className="opacity-0 group-hover:opacity-100 p-1 text-gray-500 hover:text-white transition-all rounded">
                        <HiDotsVertical size={14} />
                    </button>
                    {isMenuOpen && (
                        <div className="absolute right-0 top-7 bg-gray-800 border border-gray-700 rounded-lg shadow-lg py-1 z-10 min-w-[160px]">
                            <button onClick={() => { onAddLinkToFolder(folder.id); setIsMenuOpen(false); }}
                                    className="w-full px-3 py-1.5 text-left text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-2">
                                <HiOutlinePlus size={14} /> Add link here
                            </button>
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

            {isExpanded && (
                <div style={{ paddingLeft: `${depth * 20 + 20}px` }}>
                    {folder.children.map(childFolder => (
                        <FolderNode
                            key={childFolder.id}
                            folder={childFolder}
                            depth={depth + 1}
                            onAddSubfolder={onAddSubfolder}
                            onRenameFolder={onRenameFolder}
                            onDeleteFolder={onDeleteFolder}
                            onEditLink={onEditLink}
                            onDeleteLink={onDeleteLink}
                            onMoveLink={onMoveLink}
                            onAddLinkToFolder={onAddLinkToFolder}
                        />
                    ))}
                    {folder.links.map(link => (
                        <TreeLinkItem
                            key={link.id}
                            link={link}
                            onEdit={onEditLink}
                            onDelete={onDeleteLink}
                            onMove={onMoveLink}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
