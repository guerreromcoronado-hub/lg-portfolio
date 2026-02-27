'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/context';

export default function Footer() {
    const { dict } = useLanguage();
    const d = dict.footer;

    return (
        <footer className="bg-text px-6 md:px-20 py-10 flex flex-col gap-6 md:flex-row md:justify-between md:items-center">
            <Link
                href="/"
                className="text-base font-bold text-yellow no-underline hover:scale-105 transition-transform"
            >
                Laura Guerrero
            </Link>
            <div className="flex gap-8">
                <Link
                    href="/#portfolio"
                    className="text-[0.78rem] text-white/40 no-underline hover:text-white transition-colors"
                >
                    {d.projects}
                </Link>
                <Link
                    href="/#blog"
                    className="text-[0.78rem] text-white/40 no-underline hover:text-white transition-colors"
                >
                    {d.blog}
                </Link>
                <Link
                    href="/#contact"
                    className="text-[0.78rem] text-white/40 no-underline hover:text-white transition-colors"
                >
                    {d.contact}
                </Link>
            </div>
            <span className="text-[0.75rem] text-white/25">
                © 2025 lauraguerrero.co
            </span>
        </footer>
    );
}

