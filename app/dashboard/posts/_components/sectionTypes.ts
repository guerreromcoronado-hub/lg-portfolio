/**
 * Type definitions, helpers, and data functions for the blog post
 * section builder. No React/JSX here — pure TypeScript.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type SectionType =
    | 'paragraph'
    | 'heading'
    | 'heading3'
    | 'quote'
    | 'list'
    | 'numbered-list'
    | 'highlight'
    | 'error-list'
    | 'callout'
    | 'image'
    | 'video'
    | 'divider'
    | 'code'
    | 'html';

export interface ErrorItem {
    number: string;
    title: string;
    description: string;
    fix: string;
}

export interface Section {
    id: string;
    type: SectionType;
    content?: string;
    title?: string;
    items?: string[] | ErrorItem[];
    variant?: string;   // callout variant
    url?: string;       // image / video
    caption?: string;   // image / video caption
    alt?: string;       // image alt text
    language?: string;  // code language
}

// ─── ID generator ─────────────────────────────────────────────────────────────

let _counter = 0;
export const newId = () => `s_${++_counter}_${Date.now()}`;

// ─── Factory ──────────────────────────────────────────────────────────────────

export const makeSection = (type: SectionType): Section => {
    switch (type) {
        case 'paragraph': return { id: newId(), type, content: '' };
        case 'heading': return { id: newId(), type, content: '' };
        case 'heading3': return { id: newId(), type, content: '' };
        case 'quote': return { id: newId(), type, content: '' };
        case 'list': return { id: newId(), type, items: [''] };
        case 'numbered-list': return { id: newId(), type, items: [''] };
        case 'highlight': return { id: newId(), type, title: '', content: '' };
        case 'error-list': return {
            id: newId(), type,
            items: [{ number: '01', title: '', description: '', fix: '' }] as ErrorItem[],
        };
        case 'callout': return { id: newId(), type, variant: 'tip', content: '' };
        case 'image': return { id: newId(), type, url: '', caption: '', alt: '' };
        case 'video': return { id: newId(), type, url: '', caption: '' };
        case 'divider': return { id: newId(), type };
        case 'code': return { id: newId(), type, language: 'text', content: '' };
        case 'html': return { id: newId(), type, content: '' };
    }
};

// ─── Metadata for the picker UI ───────────────────────────────────────────────

export const SECTION_TYPES_META: {
    type: SectionType; label: string; icon: string; desc: string; group: string;
}[] = [
        { type: 'paragraph', label: 'Párrafo', icon: '¶', desc: 'Texto libre', group: 'Texto' },
        { type: 'heading', label: 'Título H2', icon: 'H²', desc: 'Subtítulo de sección', group: 'Texto' },
        { type: 'heading3', label: 'Título H3', icon: 'H³', desc: 'Subtítulo menor', group: 'Texto' },
        { type: 'quote', label: 'Cita', icon: '"', desc: 'Frase con borde izquierdo', group: 'Texto' },
        { type: 'list', label: 'Lista •', icon: '•', desc: 'Lista de puntos', group: 'Listas' },
        { type: 'numbered-list', label: 'Lista 1.', icon: '1.', desc: 'Lista numerada', group: 'Listas' },
        { type: 'error-list', label: 'Lista Errores', icon: '①', desc: 'Tarjetas numeradas + solución', group: 'Listas' },
        { type: 'highlight', label: 'Destacado', icon: '★', desc: 'Caja diagnóstico / tip', group: 'Bloques' },
        { type: 'callout', label: 'Callout', icon: 'C', desc: 'Tip / warning / info / danger', group: 'Bloques' },
        { type: 'image', label: 'Imagen', icon: 'IMG', desc: 'Imagen con caption', group: 'Media' },
        { type: 'video', label: 'Video embed', icon: 'VID', desc: 'URL YouTube / Vimeo', group: 'Media' },
        { type: 'divider', label: 'Separador', icon: '—', desc: 'Línea horizontal', group: 'Utilidades' },
        { type: 'code', label: 'Código', icon: '</>', desc: 'Bloque de código', group: 'Utilidades' },
        { type: 'html', label: 'HTML libre', icon: '{ }', desc: 'HTML personalizado', group: 'Utilidades' },
    ];

// backwards compat alias
export const SECTION_TYPES = SECTION_TYPES_META;

export const TYPE_COLORS: Record<SectionType, string> = {
    paragraph: 'bg-[#F5F5F5] text-[#555]',
    heading: 'bg-[#111]/10 text-[#111]',
    heading3: 'bg-[#111]/10 text-[#111]',
    quote: 'bg-[#FDF8DC] text-[#e07b00]',
    list: 'bg-[#EFF6FF] text-blue-600',
    'numbered-list': 'bg-[#EFF6FF] text-blue-600',
    highlight: 'bg-[#FEF3C7] text-amber-700',
    'error-list': 'bg-[#FFF0EB] text-[#FF6B35]',
    callout: 'bg-[#F0FDF4] text-emerald-700',
    image: 'bg-[#F5F0FF] text-purple-600',
    video: 'bg-[#F5F0FF] text-purple-600',
    divider: 'bg-[#F5F5F5] text-[#999]',
    code: 'bg-[#F1F5F9] text-slate-600',
    html: 'bg-[#F1F5F9] text-slate-600',
};

export const BLOCK_GROUPS = ['Texto', 'Listas', 'Bloques', 'Media', 'Utilidades'] as const;

// ─── buildContent (meta-aware) ────────────────────────────────────────────────

export const buildContent = (
    sections: Section[],
    meta?: { tags?: string[]; seo?: { title?: string; description?: string } },
) => ({
    intro: '',
    sections: sections.map(({ id: _id, ...rest }) => {
        if (rest.type === 'list' || rest.type === 'numbered-list')
            return { ...rest, items: (rest.items as string[]).filter(i => i.trim()) };
        if (rest.type === 'error-list')
            return { ...rest, items: (rest.items as ErrorItem[]).filter(i => i.title.trim()) };
        return rest;
    }),
    ...(meta ? { meta } : {}),
});

// ─── sectionsFromDB ───────────────────────────────────────────────────────────


export const sectionsFromDB = (dbSections: any[]): Section[] =>
    (dbSections ?? []).map(s => ({ ...s, id: newId() }));
