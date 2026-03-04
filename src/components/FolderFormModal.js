/*
 *   Copyright (c) 2022
 *   All rights reserved.
 */
import React, { useState, useEffect } from 'react';
import { HiOutlineX } from 'react-icons/hi';

export default function FolderFormModal({ isOpen, onClose, onSave, editingFolder, parentFolderName }) {
    const [folderName, setFolderName] = useState('');

    useEffect(() => {
        if (editingFolder) {
            setFolderName(editingFolder.name || '');
        } else {
            setFolderName('');
        }
    }, [editingFolder, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(folderName.trim());
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
             onClick={onClose}>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-sm mx-4 p-6"
                 onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-white">
                        {editingFolder ? 'Rename Folder' : 'New Folder'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <HiOutlineX size={20} />
                    </button>
                </div>

                {parentFolderName && !editingFolder && (
                    <p className="text-sm text-gray-500 mb-3">
                        Inside <span className="text-gray-300">{parentFolderName}</span>
                    </p>
                )}

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        required
                        value={folderName}
                        onChange={(e) => setFolderName(e.target.value)}
                        placeholder="Folder name"
                        autoFocus
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white
                                   focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none mb-4"
                    />
                    <div className="flex justify-end gap-3">
                        <button type="button" onClick={onClose}
                                className="px-4 py-2 text-gray-400 hover:text-white transition-colors">
                            Cancel
                        </button>
                        <button type="submit"
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors">
                            {editingFolder ? 'Rename' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
