/*
 *   Copyright (c) 2022
 *   All rights reserved.
 */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { firebaseService } from '../FirebaseService';

const LinksContext = createContext();

export function LinksProvider({ children }) {
    const [allLinks, setAllLinks] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchLinks = useCallback(async () => {
        setIsLoading(true);
        const links = await firebaseService.getDocs("links");
        setAllLinks(links);
        setIsLoading(false);
    }, []);

    useEffect(() => { fetchLinks(); }, [fetchLinks]);

    const addLink = async (linkData) => {
        const newLink = await firebaseService.addLink(linkData);
        setAllLinks(previousLinks => [...previousLinks, newLink]);
    };

    const updateLink = async (id, linkData) => {
        await firebaseService.updateLink(id, linkData);
        setAllLinks(previousLinks =>
            previousLinks.map(link => link.id === id ? { ...link, ...linkData } : link)
        );
    };

    const deleteLink = async (id) => {
        await firebaseService.deleteLink(id);
        setAllLinks(previousLinks => previousLinks.filter(link => link.id !== id));
    };

    return (
        <LinksContext.Provider value={{ allLinks, isLoading, addLink, updateLink, deleteLink, refetchLinks: fetchLinks }}>
            {children}
        </LinksContext.Provider>
    );
}

export function useLinks() {
    return useContext(LinksContext);
}
