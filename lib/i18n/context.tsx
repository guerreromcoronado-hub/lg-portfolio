'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getDictionary, type Locale, type Dictionary, DEFAULT_LOCALE } from './dictionaries';

interface LanguageContextValue {
    locale: Locale;
    dict: Dictionary;
    setLocale: (locale: Locale) => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function getInitialLocale(cookieLocale?: string): Locale {
    if (cookieLocale === 'en' || cookieLocale === 'es') return cookieLocale;
    return DEFAULT_LOCALE;
}

interface LanguageProviderProps {
    children: React.ReactNode;
    initialLocale?: string;
}

export function LanguageProvider({ children, initialLocale }: LanguageProviderProps) {
    const [locale, setLocaleState] = useState<Locale>(getInitialLocale(initialLocale));
    const router = useRouter();

    // Sync from cookie on mount (handles hard navigation)
    useEffect(() => {
        const cookie = document.cookie
            .split('; ')
            .find((row) => row.startsWith('lang='))
            ?.split('=')[1];
        if (cookie === 'en' || cookie === 'es') {
            setLocaleState(cookie);
        }
    }, []);

    const setLocale = useCallback(
        (newLocale: Locale) => {
            // Set cookie (1 year expiry)
            const expires = new Date();
            expires.setFullYear(expires.getFullYear() + 1);
            document.cookie = `lang=${newLocale}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;
            setLocaleState(newLocale);
            // Refresh server components so they read the updated cookie
            router.refresh();
        },
        [router]
    );

    const dict = getDictionary(locale);

    return (
        <LanguageContext.Provider value={{ locale, dict, setLocale }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage(): LanguageContextValue {
    const ctx = useContext(LanguageContext);
    if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
    return ctx;
}
