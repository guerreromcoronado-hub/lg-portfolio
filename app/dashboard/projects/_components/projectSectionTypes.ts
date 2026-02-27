/**
 * Type definitions, helpers, and data functions for the project
 * section builder. No React/JSX here — pure TypeScript.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type ProjectSectionType =
    | 'paragraph'
    | 'heading'
    | 'quote'
    | 'highlight'
    | 'challenge'
    | 'process-step'
    | 'result-item'
    | 'learning'
    | 'heading3'
    | 'numbered-list'
    | 'callout'
    | 'image'
    | 'video'
    | 'divider'
    | 'code'
    | 'html';

export interface ProjectSection {
    id: string;
    type: ProjectSectionType;
    content?: string;
    title?: string;
    description?: string;
    number?: string;
    variant?: string;
    url?: string;
    caption?: string;
    alt?: string;
    language?: string;
    items?: string[];
}

// ─── ID generator ─────────────────────────────────────────────────────────────

let _cnt = 0;
export const newProjId = () => `p_${++_cnt}_${Date.now()}`;

// ─── Factory ──────────────────────────────────────────────────────────────────

export const makeProjSection = (type: ProjectSectionType): ProjectSection => {
    switch (type) {
        case 'paragraph': return { id: newProjId(), type, content: '' };
        case 'heading': return { id: newProjId(), type, content: '' };
        case 'quote': return { id: newProjId(), type, content: '' };
        case 'highlight': return { id: newProjId(), type, title: '', content: '' };
        case 'challenge': return { id: newProjId(), type, content: '' };
        case 'process-step': return { id: newProjId(), type, number: '', title: '', description: '' };
        case 'result-item': return { id: newProjId(), type, title: '', description: '' };
        case 'learning': return { id: newProjId(), type, content: '' };
        case 'heading3': return { id: newProjId(), type, content: '' };
        case 'numbered-list': return { id: newProjId(), type, items: [''] };
        case 'callout': return { id: newProjId(), type, variant: 'tip', content: '' };
        case 'image': return { id: newProjId(), type, url: '', alt: '', caption: '' };
        case 'video': return { id: newProjId(), type, url: '' };
        case 'divider': return { id: newProjId(), type };
        case 'code': return { id: newProjId(), type, language: 'javascript', content: '' };
        case 'html': return { id: newProjId(), type, content: '' };
    }
};

// ─── Section type metadata ────────────────────────────────────────────────────

export const PROJ_SECTION_TYPES: {
    type: ProjectSectionType; label: string; icon: string; desc: string;
}[] = [
        { type: 'paragraph', label: 'Párrafo', icon: '¶', desc: 'Texto libre' },
        { type: 'heading', label: 'Título', icon: 'H', desc: 'H3 de sección' },
        { type: 'quote', label: 'Cita', icon: '"', desc: 'Frase destacada' },
        { type: 'highlight', label: 'Destacado', icon: '★', desc: 'Caja callout / tip' },
        { type: 'challenge', label: 'El Reto', icon: '⚡', desc: 'Bloque de reto/desafío' },
        { type: 'process-step', label: 'Paso Proceso', icon: '⚙', desc: 'Paso numerado con título' },
        { type: 'result-item', label: 'Resultado', icon: '✓', desc: 'Resultado con título' },
        { type: 'learning', label: 'Aprendizaje', icon: '💡', desc: 'Reflexión / insight' },
        { type: 'heading3', label: 'Subtítulo', icon: 'h3', desc: 'Encabezado H3' },
        { type: 'numbered-list', label: 'Lista num.', icon: '1.', desc: 'Lista numerada' },
        { type: 'callout', label: 'Callout', icon: '!', desc: 'Tip/info/aviso' },
        { type: 'image', label: 'Imagen', icon: '🖼', desc: 'Imagen con caption' },
        { type: 'video', label: 'Video', icon: '▶', desc: 'YouTube / Vimeo' },
        { type: 'divider', label: 'Divisor', icon: '—', desc: 'Separador visual' },
        { type: 'code', label: 'Código', icon: '</>', desc: 'Bloque de código' },
        { type: 'html', label: 'HTML', icon: '{…}', desc: 'HTML personalizado' },
    ];

export const PROJ_TYPE_COLORS: Record<ProjectSectionType, string> = {
    paragraph: 'bg-[#F5F5F5] text-[#555]',
    heading: 'bg-[#111]/10 text-[#111]',
    quote: 'bg-[#FDF8DC] text-[#e07b00]',
    highlight: 'bg-[#FEF3C7] text-amber-700',
    challenge: 'bg-[#FFF0EB] text-[#FF6B35]',
    'process-step': 'bg-[#EFF6FF] text-blue-600',
    'result-item': 'bg-[#ECFDF5] text-emerald-700',
    learning: 'bg-[#F5F0FF] text-purple-600',
    heading3: 'bg-[#111]/10 text-[#111]',
    'numbered-list': 'bg-[#EFF6FF] text-blue-600',
    callout: 'bg-[#FEF3C7] text-amber-700',
    image: 'bg-[#F0FDF4] text-green-700',
    video: 'bg-[#FFF0EB] text-[#FF6B35]',
    divider: 'bg-[#F5F5F5] text-[#999]',
    code: 'bg-[#1e1e1e] text-[#4ec9b0]',
    html: 'bg-[#EDE9FE] text-violet-700',
};

export const PROJ_BLOCK_GROUPS = [
    {
        label: 'Proyecto',
        items: ['paragraph', 'heading', 'heading3', 'challenge'] as ProjectSectionType[],
    },
    {
        label: 'Proceso & Resultados',
        items: ['process-step', 'result-item', 'learning', 'numbered-list'] as ProjectSectionType[],
    },
    {
        label: 'Destacados',
        items: ['quote', 'highlight', 'callout'] as ProjectSectionType[],
    },
    {
        label: 'Media',
        items: ['image', 'video'] as ProjectSectionType[],
    },
    {
        label: 'Utilidades',
        items: ['divider', 'code', 'html'] as ProjectSectionType[],
    },
] as const;

// ─── buildProjectContent ──────────────────────────────────────────────────────

export function buildProjectContent(
    heroDescription: string,
    sections: ProjectSection[],
    seo?: { title: string; description: string },
): Record<string, unknown> {
    return {
        hero: { description: heroDescription },
        sections: sections.map(({ id: _id, ...rest }) => rest),
        ...(seo ? { seo } : {}),
    };
}

// ─── sectionsFromProjectDB ────────────────────────────────────────────────────


export function sectionsFromProjectDB(dbContent: any, dbResults?: any): ProjectSection[] {
    if (!dbContent) return [makeProjSection('paragraph')];

    // New format: content.sections array
    if (Array.isArray(dbContent.sections) && dbContent.sections.length > 0) {

        return dbContent.sections.map((s: any) => ({
            id: newProjId(),
            type: s.type as ProjectSectionType,
            content: s.content ?? undefined,
            title: s.title ?? undefined,
            description: s.description ?? undefined,
            number: s.number ?? undefined,
            variant: s.variant ?? undefined,
            url: s.url ?? undefined,
            caption: s.caption ?? undefined,
            alt: s.alt ?? undefined,
            language: s.language ?? undefined,
            items: s.items ?? undefined,
        }));
    }

    // Legacy / seed-data format
    const result: ProjectSection[] = [];

    if (typeof dbContent.context === 'string' && dbContent.context.trim())
        result.push({ id: newProjId(), type: 'paragraph', content: dbContent.context });
    else if (Array.isArray(dbContent.context))
        for (const p of dbContent.context)
            if (typeof p === 'string' && p.trim())
                result.push({ id: newProjId(), type: 'paragraph', content: p });

    if (typeof dbContent.challenge === 'string' && dbContent.challenge.trim())
        result.push({ id: newProjId(), type: 'challenge', content: dbContent.challenge });


    const processArr: any[] = Array.isArray(dbContent.process)
        ? dbContent.process
        : Array.isArray(dbContent.solution) ? dbContent.solution : [];

    processArr.forEach((step: any, i: number) => {
        result.push({
            id: newProjId(), type: 'process-step',
            number: step.step ?? step.number ?? String(i + 1).padStart(2, '0'),
            title: step.title ?? '',
            description: step.description ?? '',
        });
    });

    if (typeof dbContent.quote === 'string' && dbContent.quote.trim())
        result.push({ id: newProjId(), type: 'quote', content: dbContent.quote });

    if (Array.isArray(dbContent.results))
        for (const r of dbContent.results)
            result.push({ id: newProjId(), type: 'result-item', title: r.title ?? r.label ?? '', description: r.description ?? r.value ?? '' });
    else if (dbResults) {
        if (Array.isArray(dbResults.main))

            for (const r of dbResults.main as any[])
                result.push({ id: newProjId(), type: 'result-item', title: String(r.value ?? r.label ?? ''), description: String(r.label ?? '') });
        if (typeof dbResults.summary === 'string' && dbResults.summary.trim())
            result.push({ id: newProjId(), type: 'learning', content: dbResults.summary });
    }

    if (typeof dbContent.learnings === 'string' && dbContent.learnings.trim())
        result.push({ id: newProjId(), type: 'learning', content: dbContent.learnings });
    else if (Array.isArray(dbContent.learnings))
        for (const l of dbContent.learnings)
            if (typeof l === 'string' && l.trim())
                result.push({ id: newProjId(), type: 'learning', content: l });

    return result.length > 0 ? result : [makeProjSection('paragraph')];
}

// ─── Metric / Tool helpers ────────────────────────────────────────────────────

export type MetricRow = { label: string; value: string };
export type ToolRow = { tool: string };

export const buildMetrics = (rows: MetricRow[]): Record<string, string> =>
    rows.filter(r => r.label.trim() && r.value.trim())
        .reduce((acc, r) => { acc[r.label] = r.value; return acc; }, {} as Record<string, string>);

export const buildTools = (rows: ToolRow[]): string[] =>
    rows.map(r => r.tool.trim()).filter(Boolean);

export const metricsFromDB = (dbMetrics: unknown): MetricRow[] => {
    if (dbMetrics && typeof dbMetrics === 'object' && !Array.isArray(dbMetrics)) {
        const entries = Object.entries(dbMetrics as Record<string, string>);
        if (entries.length > 0) return entries.map(([label, value]) => ({ label, value }));
    }
    return [{ label: '', value: '' }];
};

export const toolsFromDB = (dbTools: unknown): ToolRow[] => {
    if (Array.isArray(dbTools) && dbTools.length > 0)
        return (dbTools as string[]).map(t => ({ tool: t }));
    return [{ tool: '' }];
};
