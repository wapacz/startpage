/*
 *   Copyright (c) 2022
 *   All rights reserved.
 */
import { useState } from 'react';

const LOCATION_STORAGE_KEY = 'startpage_location_context';

export function useLocationContext() {
    const [locationContext, setLocationContext] = useState(
        () => localStorage.getItem(LOCATION_STORAGE_KEY) || 'all'
    );

    const changeLocationContext = (newContext) => {
        setLocationContext(newContext);
        localStorage.setItem(LOCATION_STORAGE_KEY, newContext);
    };

    return { locationContext, changeLocationContext };
}
