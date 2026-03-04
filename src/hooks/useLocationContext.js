/*
 *   Copyright (c) 2022
 *   All rights reserved.
 */
import { useState, useEffect } from 'react';

const LOCATION_STORAGE_KEY = 'startpage_location_context';
const IP_CACHE_KEY = 'startpage_ip_data';

async function detectLocationFromIp() {
    const cachedData = sessionStorage.getItem(IP_CACHE_KEY);
    if (cachedData) {
        return JSON.parse(cachedData);
    }

    try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        sessionStorage.setItem(IP_CACHE_KEY, JSON.stringify(data));
        return data;
    } catch {
        return null;
    }
}

export function useLocationContext() {
    const [locationContext, setLocationContext] = useState(
        () => localStorage.getItem(LOCATION_STORAGE_KEY) || 'all'
    );
    const [detectedLocation, setDetectedLocation] = useState(null);

    useEffect(() => {
        detectLocationFromIp().then(ipData => {
            if (ipData) {
                setDetectedLocation(ipData);
                const storedPreference = localStorage.getItem(LOCATION_STORAGE_KEY);
                if (!storedPreference) {
                    const isWorkNetwork = ipData.org?.toLowerCase().includes('ericsson');
                    setLocationContext(isWorkNetwork ? 'work' : 'home');
                }
            }
        });
    }, []);

    const changeLocationContext = (newContext) => {
        setLocationContext(newContext);
        if (newContext === 'all') {
            localStorage.removeItem(LOCATION_STORAGE_KEY);
        } else {
            localStorage.setItem(LOCATION_STORAGE_KEY, newContext);
        }
    };

    return { locationContext, changeLocationContext, detectedLocation };
}
