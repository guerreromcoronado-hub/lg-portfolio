'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useLanguage } from '@/lib/i18n/context';

export default function Navigation() {
    const { dict, locale, setLocale } = useLanguage();
    const d = dict.nav;
    const [menuOpen, setMenuOpen] = useState(false);

    const navLinks = [
        { href: '/#about', label: d.about },
        { href: '/#services', label: d.services },
        { href: '/#portfolio', label: d.projects },
        { href: '/#blog', label: d.blog },
    ];

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="fixed top-0 left-0 right-0 z-[100] bg-white/96 backdrop-blur-2xl border-b border-text/[0.06]"
        >
            <div className="flex justify-between items-center px-5 md:px-14 py-[1.1rem]">
                <Link
                    href="/"
                    className="font-bold text-base text-orange tracking-[0.02em] hover:scale-105 transition-transform"
                >
                    Laura Guerrero
                </Link>

                {/* Desktop nav */}
                <ul className="hidden md:flex gap-10 items-center list-none">
                    {navLinks.map((link) => (
                        <li key={link.href}>
                            <Link
                                href={link.href}
                                className="text-text text-[0.82rem] font-medium opacity-65 hover:opacity-100 transition-opacity tracking-[0.03em]"
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}
                    <li>
                        <button
                            onClick={() => setLocale(locale === 'es' ? 'en' : 'es')}
                            className="text-[0.75rem] font-bold tracking-[0.1em] text-muted/70 border border-muted/25 px-3 py-[0.3rem] rounded-full hover:border-orange hover:text-orange transition-all"
                            aria-label="Switch language"
                        >
                            {locale === 'es' ? 'EN' : 'ES'}
                        </button>
                    </li>
                    <li>
                        <Link
                            href="/#contact"
                            className="bg-yellow text-text px-[1.4rem] py-[0.55rem] rounded-full font-bold text-[0.82rem] tracking-[0.03em] hover:bg-[#e0b510] hover:-translate-y-[1px] transition-all"
                        >
                            {d.contact}
                        </Link>
                    </li>
                </ul>

                {/* Mobile: lang + hamburger */}
                <div className="flex items-center gap-3 md:hidden">
                    <button
                        onClick={() => setLocale(locale === 'es' ? 'en' : 'es')}
                        className="text-[0.75rem] font-bold tracking-[0.1em] text-muted/70 border border-muted/25 px-3 py-[0.3rem] rounded-full hover:border-orange hover:text-orange transition-all"
                        aria-label="Switch language"
                    >
                        {locale === 'es' ? 'EN' : 'ES'}
                    </button>
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle menu"
                        className="flex flex-col gap-[5px] p-1"
                    >
                        <span className={`block w-5 h-[2px] bg-text transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
                        <span className={`block w-5 h-[2px] bg-text transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
                        <span className={`block w-5 h-[2px] bg-text transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Mobile dropdown menu */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        key="mobile-menu"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="md:hidden overflow-hidden bg-white/98 border-t border-text/[0.06]"
                    >
                        <div className="flex flex-col px-5 py-4 gap-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMenuOpen(false)}
                                    className="text-text text-[0.9rem] font-medium py-3 border-b border-text/[0.05] hover:text-orange transition-colors"
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <Link
                                href="/#contact"
                                onClick={() => setMenuOpen(false)}
                                className="bg-yellow text-text text-center px-6 py-3 rounded-full font-bold text-[0.85rem] mt-3 hover:bg-[#e0b510] transition-colors"
                            >
                                {d.contact}
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}


