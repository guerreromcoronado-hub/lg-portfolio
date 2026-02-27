'use client';

import { useState } from 'react';

/**
 * Reusable collapsible card wrapper for dashboard sidebars.
 * Usage:
 *   <SideCard title="Etiquetas">…children…</SideCard>
 *   <SideCard title="SEO" collapsible>…children…</SideCard>
 */
export function SideCard({
    title,
    children,
    collapsible = false,
    defaultOpen = true,
}: {
    title: string;
    children: React.ReactNode;
    collapsible?: boolean;
    defaultOpen?: boolean;
}) {
    const [open, setOpen] = useState(defaultOpen);

    return (
        <div className="bg-white rounded-xl border border-text/[0.06] overflow-hidden">
            <button
                type="button"
                className={`flex items-center justify-between w-full px-4 py-3 text-left border-b border-text/[0.05] ${collapsible ? 'hover:bg-cream/50 transition-colors cursor-pointer' : 'cursor-default'}`}
                onClick={() => collapsible && setOpen(v => !v)}
            >
                <h3 className="text-xs font-bold uppercase tracking-[0.1em] text-subtle">{title}</h3>
                {collapsible && (
                    <span className="text-subtle text-xs">{open ? '▲' : '▼'}</span>
                )}
            </button>
            {(!collapsible || open) && (
                <div className="px-4 pb-4 pt-3">{children}</div>
            )}
        </div>
    );
}
