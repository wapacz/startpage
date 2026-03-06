/*
 *   Copyright (c) 2022
 *   All rights reserved.
 */
import React, { useState, useEffect } from 'react';
import { HiOutlineX } from 'react-icons/hi';
import { AVAILABLE_ICONS } from './IconPicker';

const EMPTY_FORM = {
    name: '',
    url: '',
    description: '',
    tags: '',
    keywords: '',
    context: 'both',
    newTab: true,
    pinned: false,
    icon: 'globe',
    iconType: 'heroicon',
    faviconUrl: '',
    tileGroup: '',
    sortOrder: 0,
};

export default function LinkFormModal({ isOpen, onClose, onSave, editingLink, existingGroups = [] }) {
    const [formData, setFormData] = useState(EMPTY_FORM);

    useEffect(() => {
        if (editingLink) {
            setFormData({
                name: editingLink.name || '',
                url: editingLink.url || '',
                description: editingLink.description || '',
                tags: editingLink.tags?.join(', ') || '',
                keywords: editingLink.keywords?.join(', ') || '',
                context: editingLink.context || 'both',
                newTab: editingLink.newTab ?? true,
                pinned: editingLink.pinned ?? false,
                icon: editingLink.icon || 'globe',
                iconType: editingLink.iconType || 'heroicon',
                faviconUrl: editingLink.faviconUrl || '',
                tileGroup: editingLink.tileGroup || '',
                sortOrder: editingLink.sortOrder ?? 0,
            });
        } else {
            setFormData(EMPTY_FORM);
        }
    }, [editingLink, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const linkData = {
            name: formData.name.trim(),
            url: formData.url.trim(),
            description: formData.description.trim() || null,
            tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
            keywords: formData.keywords ? formData.keywords.split(',').map(kw => kw.trim()).filter(Boolean) : [],
            context: formData.context,
            newTab: formData.newTab,
            pinned: formData.pinned,
            icon: formData.icon,
            iconType: formData.iconType,
            faviconUrl: formData.faviconUrl.trim() || null,
            tileGroup: formData.tileGroup.trim() || null,
            sortOrder: Number(formData.sortOrder) || 0,
        };
        onSave(linkData);
        onClose();
    };

    if (!isOpen) return null;

    const inputClassName = "w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
             onClick={onClose}>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-3xl mx-4 p-6 max-h-[90vh] overflow-y-auto"
                 onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-white">
                        {editingLink ? 'Edit Link' : 'Add New Link'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <HiOutlineX size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Name *</label>
                            <input type="text" required value={formData.name}
                                   onChange={(e) => setFormData({...formData, name: e.target.value})}
                                   className={inputClassName} />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">URL *</label>
                            <input type="url" required value={formData.url}
                                   onChange={(e) => setFormData({...formData, url: e.target.value})}
                                   className={inputClassName} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Description</label>
                        <textarea value={formData.description}
                                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                                  rows={2}
                                  className={`${inputClassName} resize-none`} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Tags (comma-separated)</label>
                            <input type="text" value={formData.tags}
                                   onChange={(e) => setFormData({...formData, tags: e.target.value})}
                                   placeholder="e.g. devops, monitoring, k8s"
                                   className={inputClassName} />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Keywords (comma-separated)</label>
                            <input type="text" value={formData.keywords}
                                   onChange={(e) => setFormData({...formData, keywords: e.target.value})}
                                   placeholder="e.g. grafana, prometheus"
                                   className={inputClassName} />
                        </div>
                    </div>

                    <div className="flex gap-4 items-end">
                        <div className="w-32">
                            <label className="block text-sm text-gray-400 mb-1">Context</label>
                            <select value={formData.context}
                                    onChange={(e) => setFormData({...formData, context: e.target.value})}
                                    className={inputClassName}>
                                <option value="both">Both</option>
                                <option value="work">Work</option>
                                <option value="home">Home</option>
                            </select>
                        </div>
                        <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer pb-2">
                            <input type="checkbox" checked={formData.newTab}
                                   onChange={(e) => setFormData({...formData, newTab: e.target.checked})}
                                   className="rounded bg-gray-800 border-gray-700 text-blue-600 focus:ring-blue-500" />
                            Open in new tab
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer pb-2">
                            <input type="checkbox" checked={formData.pinned}
                                   onChange={(e) => setFormData({...formData, pinned: e.target.checked})}
                                   className="rounded bg-gray-800 border-gray-700 text-blue-600 focus:ring-blue-500" />
                            Pin to homepage
                        </label>
                    </div>

                    {formData.pinned && (
                        <div className="border-t border-gray-800 pt-4 space-y-3">
                            <div className="flex gap-4 items-end">
                                <div className="flex items-center bg-gray-800 rounded-lg border border-gray-700 p-0.5 w-fit">
                                    <button type="button"
                                            onClick={() => setFormData({...formData, iconType: 'heroicon'})}
                                            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                                                formData.iconType === 'heroicon'
                                                    ? 'bg-blue-600 text-white'
                                                    : 'text-gray-400 hover:text-gray-200'
                                            }`}>
                                        Icon
                                    </button>
                                    <button type="button"
                                            onClick={() => setFormData({...formData, iconType: 'favicon'})}
                                            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                                                formData.iconType === 'favicon'
                                                    ? 'bg-blue-600 text-white'
                                                    : 'text-gray-400 hover:text-gray-200'
                                            }`}>
                                        Favicon
                                    </button>
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm text-gray-400 mb-1">Group</label>
                                    <input type="text" value={formData.tileGroup}
                                           onChange={(e) => setFormData({...formData, tileGroup: e.target.value})}
                                           list="tile-groups"
                                           placeholder="e.g. DevOps, Monitoring"
                                           className={inputClassName} />
                                    <datalist id="tile-groups">
                                        {existingGroups.map(groupName => (
                                            <option key={groupName} value={groupName} />
                                        ))}
                                    </datalist>
                                </div>
                                <div className="w-20">
                                    <label className="block text-sm text-gray-400 mb-1">Order</label>
                                    <input type="number" value={formData.sortOrder}
                                           onChange={(e) => setFormData({...formData, sortOrder: e.target.value})}
                                           className={inputClassName} />
                                </div>
                            </div>

                            {formData.iconType === 'heroicon' && (
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Icon</label>
                                    <div className="grid grid-cols-12 gap-1 bg-gray-800 border border-gray-700 rounded-xl p-2">
                                        {Object.entries(AVAILABLE_ICONS).map(([key, { component: IconComp, label }]) => (
                                            <button
                                                key={key}
                                                type="button"
                                                onClick={() => setFormData({...formData, icon: key})}
                                                className={`p-1.5 rounded-lg flex items-center justify-center transition-colors ${
                                                    formData.icon === key
                                                        ? 'bg-blue-600 text-white'
                                                        : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                                                }`}
                                                title={label}
                                            >
                                                <IconComp size={18} />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {formData.iconType === 'favicon' && (
                                <div className="flex gap-4 items-end">
                                    <div className="flex-1">
                                        <label className="block text-sm text-gray-400 mb-1">Custom favicon URL (optional)</label>
                                        <input type="url" value={formData.faviconUrl}
                                               onChange={(e) => setFormData({...formData, faviconUrl: e.target.value})}
                                               placeholder="https://example.com/icon.png"
                                               className={inputClassName} />
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-400 pb-2">
                                        {(() => {
                                            const previewSrc = formData.faviconUrl.trim()
                                                || (formData.url ? `https://www.google.com/s2/favicons?domain=${(() => { try { return new URL(formData.url).hostname; } catch { return ''; }})()}&sz=64` : null);
                                            if (!previewSrc) return null;
                                            return (
                                                <img src={previewSrc} alt="Favicon preview"
                                                     className="w-8 h-8 rounded-lg bg-gray-800 p-0.5"
                                                     onError={(e) => { e.target.style.display = 'none'; }} />
                                            );
                                        })()}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={onClose}
                                className="px-4 py-2 text-gray-400 hover:text-white transition-colors">
                            Cancel
                        </button>
                        <button type="submit"
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors">
                            {editingLink ? 'Save Changes' : 'Add Link'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
