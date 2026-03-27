'use client';

import { useLanguage } from '@/lib/i18n/context';

export default function ProjectLanguageSwitcher() {
    const { locale, setLocale } = useLanguage();

    return (
        <button
            onClick={() => setLocale(locale === 'es' ? 'en' : 'es')}
            className="text-[0.75rem] font-bold tracking-[0.1em] text-muted/70 border border-muted/25 px-3 py-[0.3rem] rounded-full hover:border-orange hover:text-orange transition-all"
            aria-label="Switch language"
        >
            {locale === 'es' ? 'ES' : 'EN'}
        </button>
    );
}
