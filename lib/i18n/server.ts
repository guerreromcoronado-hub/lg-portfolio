import { cookies } from 'next/headers';
import { type Locale, DEFAULT_LOCALE, getDictionary } from './dictionaries';

export async function getLocale(): Promise<Locale> {
    const cookieStore = await cookies();
    const lang = cookieStore.get('lang')?.value;
    if (lang === 'en' || lang === 'es') return lang;
    return DEFAULT_LOCALE;
}

export async function getServerDictionary() {
    const locale = await getLocale();
    return { locale, dict: getDictionary(locale) };
}
