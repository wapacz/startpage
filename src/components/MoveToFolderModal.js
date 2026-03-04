/*
 *   Copyright (c) 2022
 *   All rights reserved.
 */
import React from 'react';
import { HiOutlineX, HiOutlineFolder } from 'react-icons/hi';

function FolderOption({ folder, depth, selectedFolderId, onSelect }) {
    return (
        <>
            <button
                onClick={() => onSelect(folder.id)}
                className={`w-full text-left px-3 py-2 text-sm rounded-lg flex items-center gap-2 transition-colors ${
                    selectedFolderId === folder.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-800'
                }`}
                style={{ paddingLeft: `${depth * 16 + 12}px` }}
            >
                <HiOutlineFolder size={16} className="flex-shrink-0" />
                {folder.name}
            </button>
            {folder.children?.map(child => (
                <FolderOption key={child.id} folder={child} depth={depth + 1}
                              selectedFolderId={selectedFolderId} onSelect={onSelect} />
            ))}
        </>
    );
}

export default function MoveToFolderModal({ isOpen, onClose, onMove, linkName, folders, currentFolderId }) {
    const [selectedFolderId, setSelectedFolderId] = React.useState(currentFolderId || null);

    React.useEffect(() => {
        setSelectedFolderId(currentFolderId || null);
    }, [currentFolderId, isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
             onClick={onClose}>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-sm mx-4 p-6 max-h-[70vh] flex flex-col"
                 onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-white">Move "{linkName}"</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <HiOutlineX size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-0.5 mb-4">
                    <button
                        onClick={() => setSelectedFolderId(null)}
                        className={`w-full text-left px-3 py-2 text-sm rounded-lg flex items-center gap-2 transition-colors ${
                            selectedFolderId === null
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-300 hover:bg-gray-800'
                        }`}
                    >
                        Root (no folder)
                    </button>
                    {folders.map(folder => (
                        <FolderOption key={folder.id} folder={folder} depth={0}
                                      selectedFolderId={selectedFolderId} onSelect={setSelectedFolderId} />
                    ))}
                </div>

                <div className="flex justify-end gap-3">
                    <button onClick={onClose}
                            className="px-4 py-2 text-gray-400 hover:text-white transition-colors">
                        Cancel
                    </button>
                    <button onClick={() => { onMove(selectedFolderId); onClose(); }}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors">
                        Move
                    </button>
                </div>
            </div>
        </div>
    );
}
