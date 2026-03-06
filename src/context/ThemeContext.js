/*
 *   Copyright (c) 2022
 *   All rights reserved.
 */
import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();
const THEME_STORAGE_KEY = 'startpage_theme';

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(
        () => localStorage.getItem(THEME_STORAGE_KEY) || 'dark'
    );

    useEffect(() => {
        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem(THEME_STORAGE_KEY, theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(previous => previous === 'dark' ? 'light' : 'dark');
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}
