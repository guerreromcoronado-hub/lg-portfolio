'use client';

/**
 * Google SERP preview used in the SEO sidebar panel of post forms.
 */
export function SerpPreview({
    title,
    description,
    slug,
    basePath = 'blog',
}: {
    title: string;
    description: string;
    slug: string;
    basePath?: string;
}) {
    const displayTitle = title || 'Título SEO del post';
    const displayDesc =
        description ||
        'Meta descripción del post. Aparecerá en los resultados de búsqueda de Google.';
    const displayUrl = `lauraguerrero.com/${basePath}/${slug || 'url-del-post'}`;

    return (
        <div className="border border-text/[0.08] rounded-lg p-3 bg-white font-sans">
            <p className="text-[#1a0dab] text-sm font-medium leading-tight hover:underline cursor-pointer line-clamp-1">
                {displayTitle}
            </p>
            <p className="text-[#006621] text-xs mt-0.5 line-clamp-1">{displayUrl}</p>
            <p className="text-[#545454] text-xs mt-1 leading-relaxed line-clamp-2">
                {displayDesc}
            </p>
        </div>
    );
}
