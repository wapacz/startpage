/*
 *   Copyright (c) 2022
 *   All rights reserved.
 */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { firebaseService } from '../FirebaseService';

const FoldersContext = createContext();

function buildTree(folders, links) {
    const folderMap = {};
    folders.forEach(folder => {
        folderMap[folder.id] = { ...folder, children: [], links: [] };
    });

    const rootFolders = [];
    folders.forEach(folder => {
        if (folder.parentId && folderMap[folder.parentId]) {
            folderMap[folder.parentId].children.push(folderMap[folder.id]);
        } else {
            rootFolders.push(folderMap[folder.id]);
        }
    });

    const rootLinks = [];
    links.forEach(link => {
        if (link.folderId && folderMap[link.folderId]) {
            folderMap[link.folderId].links.push(link);
        } else {
            rootLinks.push(link);
        }
    });

    rootFolders.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    Object.values(folderMap).forEach(folder => {
        folder.children.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    });

    return { rootFolders, rootLinks, folderMap };
}

export function FoldersProvider({ children }) {
    const [allFolders, setAllFolders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchFolders = useCallback(async () => {
        setIsLoading(true);
        const folders = await firebaseService.getDocs("folders");
        setAllFolders(folders);
        setIsLoading(false);
    }, []);

    useEffect(() => { fetchFolders(); }, [fetchFolders]);

    const addFolder = async (folderData) => {
        const newFolder = await firebaseService.addFolder(folderData);
        setAllFolders(previous => [...previous, newFolder]);
        return newFolder;
    };

    const updateFolder = async (id, folderData) => {
        await firebaseService.updateFolder(id, folderData);
        setAllFolders(previous =>
            previous.map(folder => folder.id === id ? { ...folder, ...folderData } : folder)
        );
    };

    const deleteFolder = async (id) => {
        await firebaseService.deleteFolder(id);
        setAllFolders(previous => previous.filter(folder => folder.id !== id));
    };

    return (
        <FoldersContext.Provider value={{ allFolders, isLoading, addFolder, updateFolder, deleteFolder, buildTree, refetchFolders: fetchFolders }}>
            {children}
        </FoldersContext.Provider>
    );
}

export function useFolders() {
    return useContext(FoldersContext);
}

export { buildTree };
