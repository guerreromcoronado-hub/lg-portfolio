'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/context';

interface BlogNavProps {
    backLink?: string;
}

export default function BlogNavigation({ backLink }: BlogNavProps) {
    const { dict, locale, setLocale } = useLanguage();
    const router = useRouter();

    const handleBack = () => {
        if (window.history.length > 1) {
            router.back();
        } else {
            router.push(backLink ?? '/');
        }
    };

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
                <div className="flex items-center gap-5">
                    <button
                        onClick={() => setLocale(locale === 'es' ? 'en' : 'es')}
                        className="text-[0.75rem] font-bold tracking-[0.1em] text-muted/70 border border-muted/25 px-3 py-[0.3rem] rounded-full hover:border-orange hover:text-orange transition-all"
                        aria-label="Switch language"
                    >
                        {locale === 'es' ? 'EN' : 'ES'}
                    </button>
                    <button
                        onClick={handleBack}
                        className="text-[0.8rem] text-muted font-semibold hover:text-orange transition-colors"
                    >
                        {dict.blogNav.back}
                    </button>
                </div>
            </div>
        </motion.nav>
    );
}


