'use client';

import { useEffect, useRef } from 'react';

export function useUnsavedChangesGuard(enabled: boolean, message = 'Tienes cambios sin guardar. ¿Seguro que quieres salir?') {
    const enabledRef = useRef(enabled);
    const isConfirmingRef = useRef(false);

    useEffect(() => {
        enabledRef.current = enabled;
    }, [enabled]);

    useEffect(() => {
        if (!enabled) return;

        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            if (!enabledRef.current) return;
            event.preventDefault();
            event.returnValue = '';
        };

        const handlePopState = () => {
            if (!enabledRef.current) return;

            const shouldLeave = window.confirm(message);
            if (shouldLeave) {
                enabledRef.current = false;
                window.history.back();
                return;
            }

            window.history.pushState(null, '', window.location.href);
        };

        const handleLinkClick = (event: MouseEvent) => {
            if (!enabledRef.current || isConfirmingRef.current) return;

            const target = (event.target as HTMLElement).closest('a');
            if (!target) return;

            const href = target.getAttribute('href');
            // Ignore hash links, external links, and button-like links
            if (!href || href.startsWith('#') || href.startsWith('http') || target.getAttribute('role') === 'button') return;

            // Allow downloads and same-page navigation
            if (target.hasAttribute('download') || target.getAttribute('target') === '_blank') return;

            event.preventDefault();
            isConfirmingRef.current = true;

            const shouldLeave = window.confirm(message);
            isConfirmingRef.current = false;

            if (shouldLeave) {
                enabledRef.current = false;
                window.location.href = href;
            }
        };

        window.history.pushState(null, '', window.location.href);
        window.addEventListener('beforeunload', handleBeforeUnload);
        window.addEventListener('popstate', handlePopState);
        window.addEventListener('click', handleLinkClick, true);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            window.removeEventListener('popstate', handlePopState);
            window.removeEventListener('click', handleLinkClick, true);
        };
    }, [enabled, message]);
}