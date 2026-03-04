/*
 *   Copyright (c) 2022
 *   All rights reserved.
 */
import React, { useState, useEffect } from 'react';
import { HiOutlineX } from 'react-icons/hi';
import IconPicker from './IconPicker';

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
};

export default function LinkFormModal({ isOpen, onClose, onSave, editingLink }) {
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
        };
        onSave(linkData);
        onClose();
    };

    if (!isOpen) return null;

    const inputClassName = "w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
             onClick={onClose}>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-lg mx-4 p-6 max-h-[90vh] overflow-y-auto"
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

                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Description</label>
                        <textarea value={formData.description}
                                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                                  rows={2}
                                  className={`${inputClassName} resize-none`} />
                    </div>

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

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm text-gray-400 mb-1">Context</label>
                            <select value={formData.context}
                                    onChange={(e) => setFormData({...formData, context: e.target.value})}
                                    className={inputClassName}>
                                <option value="both">Both</option>
                                <option value="work">Work</option>
                                <option value="home">Home</option>
                            </select>
                        </div>
                        <div className="flex items-end pb-2">
                            <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
                                <input type="checkbox" checked={formData.newTab}
                                       onChange={(e) => setFormData({...formData, newTab: e.target.checked})}
                                       className="rounded bg-gray-800 border-gray-700 text-blue-600 focus:ring-blue-500" />
                                Open in new tab
                            </label>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 pt-4">
                        <label className="flex items-center gap-3 text-sm text-gray-300 cursor-pointer mb-3">
                            <input type="checkbox" checked={formData.pinned}
                                   onChange={(e) => setFormData({...formData, pinned: e.target.checked})}
                                   className="rounded bg-gray-800 border-gray-700 text-blue-600 focus:ring-blue-500" />
                            <span>Pin to homepage as tile</span>
                        </label>

                        {formData.pinned && (
                            <div className="space-y-3">
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

                                {formData.iconType === 'heroicon' && (
                                    <IconPicker
                                        selectedIcon={formData.icon}
                                        onSelect={(icon) => setFormData({...formData, icon})}
                                    />
                                )}

                                {formData.iconType === 'favicon' && (
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-sm text-gray-400 mb-1">Custom favicon URL (optional)</label>
                                            <input type="url" value={formData.faviconUrl}
                                                   onChange={(e) => setFormData({...formData, faviconUrl: e.target.value})}
                                                   placeholder="https://example.com/icon.png"
                                                   className={inputClassName} />
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-gray-400">
                                            {(() => {
                                                const previewSrc = formData.faviconUrl.trim()
                                                    || (formData.url ? `https://www.google.com/s2/favicons?domain=${(() => { try { return new URL(formData.url).hostname; } catch { return ''; }})()}&sz=64` : null);
                                                if (!previewSrc) return <span className="text-gray-500">Enter a URL above to preview favicon</span>;
                                                return (
                                                    <>
                                                        <img src={previewSrc} alt="Favicon preview"
                                                             className="w-10 h-10 rounded-lg bg-gray-800 p-1"
                                                             onError={(e) => { e.target.style.display = 'none'; }} />
                                                        <span>{formData.faviconUrl.trim() ? 'Custom favicon' : <>Auto-detected from <span className="text-gray-300">{(() => { try { return new URL(formData.url).hostname; } catch { return 'URL'; }})()}</span></>}</span>
                                                    </>
                                                );
                                            })()}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

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
