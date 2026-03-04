/*
 *   Copyright (c) 2022
 *   All rights reserved.
 */
import React from 'react';

export default function DeleteConfirmModal({ isOpen, linkName, onConfirm, onCancel }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
             onClick={onCancel}>
            <div className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-sm mx-4 p-6"
                 onClick={(e) => e.stopPropagation()}>
                <h3 className="text-lg font-semibold text-white mb-2">Delete Link</h3>
                <p className="text-gray-400 mb-6">
                    Are you sure you want to delete <span className="text-white font-medium">{linkName}</span>?
                    This action cannot be undone.
                </p>
                <div className="flex justify-end gap-3">
                    <button onClick={onCancel}
                            className="px-4 py-2 text-gray-400 hover:text-white transition-colors">
                        Cancel
                    </button>
                    <button onClick={onConfirm}
                            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
