'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

const SCROLL_KEY = 'lg_scroll_positions';

function savePosition(pathname: string) {
    try {
        const raw = sessionStorage.getItem(SCROLL_KEY);
        const map: Record<string, number> = raw ? JSON.parse(raw) : {};
        map[pathname] = window.scrollY;
        sessionStorage.setItem(SCROLL_KEY, JSON.stringify(map));
    } catch { /* ignore */ }
}

function getSavedY(pathname: string): number | null {
    try {
        const raw = sessionStorage.getItem(SCROLL_KEY);
        if (!raw) return null;
        const map: Record<string, number> = JSON.parse(raw);
        const y = map[pathname];
        return typeof y === 'number' && y > 0 ? y : null;
    } catch { return null; }
}

/**
 * Manages scroll position across client-side navigations (Next.js App Router).
 *
 * - Saves position continuously while the user scrolls (debounced).
 * - Saves position eagerly on every click (before navigation starts).
 * - On pathname change, retries scrolling until the page has enough height
 *   (handles async server-component data fetches), for up to 1.5 s.
 */
export default function ScrollRestorer() {
    const pathname = usePathname();
    const prevPathname = useRef<string | null>(null);
    const retryHandle = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Disable native browser scroll restoration so we control it fully
    useEffect(() => {
        window.history.scrollRestoration = 'manual';
    }, []);

    // Save position on scroll (debounced 200 ms) and before page unload
    useEffect(() => {
        let tid: ReturnType<typeof setTimeout> | null = null;
        const onScroll = () => {
            if (tid) clearTimeout(tid);
            tid = setTimeout(() => savePosition(pathname), 200);
        };
        const onBeforeUnload = () => savePosition(pathname);
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('beforeunload', onBeforeUnload);
        return () => {
            if (tid) clearTimeout(tid);
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('beforeunload', onBeforeUnload);
        };
    }, [pathname]);

    // Save position eagerly on every click — captures scroll BEFORE
    // navigation starts, so the correct Y is always persisted even if
    // the debounced scroll-handler hasn't fired yet.
    useEffect(() => {
        const onClick = () => savePosition(pathname);
        document.addEventListener('click', onClick, { capture: true });
        return () => document.removeEventListener('click', onClick, { capture: true });
    }, [pathname]);

    // Restore position when pathname changes
    useEffect(() => {
        // On the very first mount, don't jump — let the page render normally
        if (prevPathname.current === null) {
            prevPathname.current = pathname;
            return;
        }

        // Track the new pathname.
        // NOTE: We do NOT call savePosition here — by this point window.scrollY
        // is already 0 (Next.js scrolled to top), which would overwrite the
        // correct value that the click handler already persisted.
        if (prevPathname.current !== pathname) {
            prevPathname.current = pathname;
        }

        // Cancel any pending retry from a previous navigation
        if (retryHandle.current) clearTimeout(retryHandle.current);

        const targetY = getSavedY(pathname);
        if (targetY === null) {
            window.scrollTo({ top: 0, behavior: 'instant' });
            return;
        }

        // Retry scroll until the page is tall enough to actually reach targetY
        // (server components may still be loading their data)
        const MAX_ATTEMPTS = 30;
        let attempts = 0;

        const attempt = () => {
            attempts++;
            window.scrollTo({ top: targetY, behavior: 'instant' });

            const reached = Math.abs(window.scrollY - targetY) < 50;
            if (!reached && attempts < MAX_ATTEMPTS) {
                retryHandle.current = setTimeout(attempt, 50);
            }
        };

        // Wait two frames so Next.js completes its initial DOM paint
        requestAnimationFrame(() => requestAnimationFrame(attempt));

        return () => {
            if (retryHandle.current) clearTimeout(retryHandle.current);
        };
    }, [pathname]);

    return null;
}
