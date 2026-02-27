'use client';

import { ProjectSection } from './projectSectionTypes';

/**
 * Internal editor components used by ProjectSectionCard.
 * Not exported from the package — import ProjectSectionCard instead.
 */

// ─── Shared props shorthand ───────────────────────────────────────────────────

type EP = { s: ProjectSection; onChange: (s: ProjectSection) => void };

// ─── Paragraph ────────────────────────────────────────────────────────────────

export function ParagraphEditor({ s, onChange }: EP) {
    return (
        <textarea value={s.content ?? ''} onChange={e => onChange({ ...s, content: e.target.value })} rows={4}
            className="w-full bg-cream border-[1.5px] border-transparent rounded-lg px-4 py-3 text-sm outline-none focus:border-yellow transition-colors resize-none"
            placeholder="Escribe tu párrafo aquí..." />
    );
}

// ─── Heading (H2) ─────────────────────────────────────────────────────────────

export function HeadingEditor({ s, onChange }: EP) {
    return (
        <input value={s.content ?? ''} onChange={e => onChange({ ...s, content: e.target.value })}
            className="w-full bg-cream border-[1.5px] border-transparent rounded-lg px-4 py-3 text-lg font-bold outline-none focus:border-yellow transition-colors"
            placeholder="Título de la sección" />
    );
}

// ─── Heading 3 ────────────────────────────────────────────────────────────────

export function Heading3Editor({ s, onChange }: EP) {
    return (
        <input value={s.content ?? ''} onChange={e => onChange({ ...s, content: e.target.value })}
            className="w-full bg-cream border-[1.5px] border-transparent rounded-lg px-4 py-3 text-base font-bold outline-none focus:border-yellow transition-colors"
            placeholder="Subtítulo de sección (H3)" />
    );
}

// ─── Quote ────────────────────────────────────────────────────────────────────

export function QuoteEditor({ s, onChange }: EP) {
    return (
        <div className="border-l-4 border-yellow pl-4">
            <textarea value={s.content ?? ''} onChange={e => onChange({ ...s, content: e.target.value })} rows={3}
                className="w-full bg-[#FDF8DC] border-[1.5px] border-transparent rounded-lg px-4 py-3 text-sm italic text-[#e07b00] font-medium outline-none focus:border-yellow transition-colors resize-none"
                placeholder="«El cliente quería más que métricas, quería una historia...»" />
        </div>
    );
}

// ─── Highlight ────────────────────────────────────────────────────────────────

export function HighlightEditor({ s, onChange }: EP) {
    return (
        <div className="space-y-3 border-l-4 border-orange pl-4">
            <input value={s.title ?? ''} onChange={e => onChange({ ...s, title: e.target.value })}
                className="w-full bg-cream border-[1.5px] border-transparent rounded-lg px-4 py-2 text-sm font-bold uppercase tracking-wider outline-none focus:border-yellow transition-colors"
                placeholder="↗ Insight clave" />
            <textarea value={s.content ?? ''} onChange={e => onChange({ ...s, content: e.target.value })} rows={3}
                className="w-full bg-cream border-[1.5px] border-transparent rounded-lg px-4 py-3 text-sm outline-none focus:border-yellow transition-colors resize-none"
                placeholder="Detalle del insight o consejo aplicado en este proyecto..." />
        </div>
    );
}

// ─── Challenge ────────────────────────────────────────────────────────────────

export function ChallengeEditor({ s, onChange }: EP) {
    return (
        <div className="border-l-4 border-[#FF6B35] pl-4 space-y-2">
            <p className="text-xs font-bold uppercase tracking-widest text-[#FF6B35]">El Reto</p>
            <textarea value={s.content ?? ''} onChange={e => onChange({ ...s, content: e.target.value })} rows={4}
                className="w-full bg-[#FFF0EB] border-[1.5px] border-transparent rounded-lg px-4 py-3 text-sm font-medium outline-none focus:border-yellow transition-colors resize-none"
                placeholder="Describe el desafío principal o el problema que había que resolver..." />
        </div>
    );
}

// ─── Process Step ─────────────────────────────────────────────────────────────

export function ProcessStepEditor({ s, onChange }: EP) {
    return (
        <div className="flex gap-3">
            <input value={s.number ?? ''} onChange={e => onChange({ ...s, number: e.target.value })}
                className="w-14 text-center flex-shrink-0 bg-[#EFF6FF] border-[1.5px] border-transparent rounded-lg px-2 py-2 text-sm font-bold text-blue-600 outline-none focus:border-yellow transition-colors"
                placeholder="01" />
            <div className="flex-1 space-y-2">
                <input value={s.title ?? ''} onChange={e => onChange({ ...s, title: e.target.value })}
                    className="w-full bg-cream border-[1.5px] border-transparent rounded-lg px-4 py-2 text-sm font-semibold outline-none focus:border-yellow transition-colors"
                    placeholder="Título del paso (ej: Investigación inicial)" />
                <textarea value={s.description ?? ''} onChange={e => onChange({ ...s, description: e.target.value })} rows={3}
                    className="w-full bg-cream border-[1.5px] border-transparent rounded-lg px-4 py-3 text-sm outline-none focus:border-yellow transition-colors resize-none"
                    placeholder="Descripción de lo que se hizo en este paso..." />
            </div>
        </div>
    );
}

// ─── Result Item ──────────────────────────────────────────────────────────────

export function ResultItemEditor({ s, onChange }: EP) {
    return (
        <div className="border-l-4 border-emerald-400 pl-4 space-y-2">
            <input value={s.title ?? ''} onChange={e => onChange({ ...s, title: e.target.value })}
                className="w-full bg-[#ECFDF5] border-[1.5px] border-transparent rounded-lg px-4 py-2 text-sm font-bold outline-none focus:border-yellow transition-colors"
                placeholder="Título del resultado (ej: +45% en tasa de apertura)" />
            <textarea value={s.description ?? ''} onChange={e => onChange({ ...s, description: e.target.value })} rows={3}
                className="w-full bg-cream border-[1.5px] border-transparent rounded-lg px-4 py-3 text-sm outline-none focus:border-yellow transition-colors resize-none"
                placeholder="Explicación del resultado y su impacto..." />
        </div>
    );
}

// ─── Learning ─────────────────────────────────────────────────────────────────

export function LearningEditor({ s, onChange }: EP) {
    return (
        <div className="border-l-4 border-purple-400 pl-4">
            <textarea value={s.content ?? ''} onChange={e => onChange({ ...s, content: e.target.value })} rows={3}
                className="w-full bg-[#F5F0FF] border-[1.5px] border-transparent rounded-lg px-4 py-3 text-sm outline-none focus:border-yellow transition-colors resize-none"
                placeholder="💡 Qué aprendiste o qué harías diferente..." />
        </div>
    );
}

// ─── Numbered List ────────────────────────────────────────────────────────────

export function NumberedListEditor({ s, onChange }: EP) {
    const items = s.items ?? [''];
    const update = (idx: number, val: string) => {
        const next = [...items]; next[idx] = val;
        onChange({ ...s, items: next });
    };
    return (
        <div className="space-y-2">
            {items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                    <span className="w-6 h-6 flex-shrink-0 rounded-full bg-[#EFF6FF] text-blue-600 text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                    </span>
                    <input value={item} onChange={e => update(idx, e.target.value)}
                        className="flex-1 bg-cream border-[1.5px] border-transparent rounded-lg px-3 py-2 text-sm outline-none focus:border-yellow transition-colors"
                        placeholder={`Elemento ${idx + 1}...`} />
                    {items.length > 1 && (
                        <button type="button" onClick={() => onChange({ ...s, items: items.filter((_, i) => i !== idx) })}
                            className="w-6 h-6 flex items-center justify-center rounded text-red-400 hover:bg-red-50 text-sm font-bold">×</button>
                    )}
                </div>
            ))}
            <button type="button" onClick={() => onChange({ ...s, items: [...items, ''] })}
                className="text-xs text-subtle border border-dashed border-text/10 rounded-lg px-3 py-1.5 hover:border-yellow hover:text-text transition-colors">
                + Agregar elemento
            </button>
        </div>
    );
}

// ─── Callout ─────────────────────────────────────────────────────────────────

const CALLOUT_VARIANTS = [
    { key: 'tip', label: 'Tip', bg: 'bg-emerald-50', border: 'border-emerald-400', text: 'text-emerald-700', icon: '💡' },
    { key: 'info', label: 'Info', bg: 'bg-blue-50', border: 'border-blue-400', text: 'text-blue-700', icon: 'ℹ' },
    { key: 'warning', label: 'Atención', bg: 'bg-yellow/10', border: 'border-yellow', text: 'text-amber-700', icon: '⚠' },
    { key: 'danger', label: 'Peligro', bg: 'bg-red-50', border: 'border-red-400', text: 'text-red-700', icon: '🚨' },
];

export function CalloutEditor({ s, onChange }: EP) {
    const variant = CALLOUT_VARIANTS.find(v => v.key === (s.variant ?? 'tip')) ?? CALLOUT_VARIANTS[0];
    return (
        <div className={`rounded-lg border-l-4 ${variant.border} ${variant.bg} p-3 space-y-2`}>
            <div className="flex gap-1.5 flex-wrap">
                {CALLOUT_VARIANTS.map(v => (
                    <button key={v.key} type="button" onClick={() => onChange({ ...s, variant: v.key })}
                        className={`text-xs px-2.5 py-1 rounded-full font-bold border transition-colors ${(s.variant === v.key || (!s.variant && v.key === 'tip')) ? `${v.bg} ${v.border} ${v.text} border` : 'bg-cream border-transparent text-subtle'}`}>
                        {v.icon} {v.label}
                    </button>
                ))}
            </div>
            <textarea value={s.content ?? ''} onChange={e => onChange({ ...s, content: e.target.value })} rows={2}
                className={`w-full bg-transparent border-0 text-sm outline-none resize-none ${variant.text} placeholder:opacity-50`}
                placeholder="Contenido del callout..." />
        </div>
    );
}

// ─── Image ────────────────────────────────────────────────────────────────────

export function ProjImageEditor({ s, onChange }: EP) {
    return (
        <div className="space-y-2">
            <input value={s.url ?? ''} onChange={e => onChange({ ...s, url: e.target.value })}
                className="w-full bg-cream border-[1.5px] border-transparent rounded-lg px-3 py-2 text-sm outline-none focus:border-yellow font-mono transition-colors"
                placeholder="https://... URL de la imagen" />
            {s.url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={s.url} alt={s.alt ?? ''} className="w-full rounded-lg object-cover max-h-48" />
            )}
            <div className="grid grid-cols-2 gap-2">
                <input value={s.alt ?? ''} onChange={e => onChange({ ...s, alt: e.target.value })}
                    className="bg-cream border-[1.5px] border-transparent rounded-lg px-3 py-2 text-sm outline-none focus:border-yellow transition-colors"
                    placeholder="Texto alt" />
                <input value={s.caption ?? ''} onChange={e => onChange({ ...s, caption: e.target.value })}
                    className="bg-cream border-[1.5px] border-transparent rounded-lg px-3 py-2 text-sm outline-none focus:border-yellow transition-colors"
                    placeholder="Caption (opcional)" />
            </div>
        </div>
    );
}

// ─── Video ────────────────────────────────────────────────────────────────────

export function ProjVideoEditor({ s, onChange }: EP) {
    const getEmbedUrl = (url: string) => {
        const yt = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&?/]+)/);
        if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
        const vm = url.match(/vimeo\.com\/(\d+)/);
        if (vm) return `https://player.vimeo.com/video/${vm[1]}`;
        return null;
    };
    const embedUrl = getEmbedUrl(s.url ?? '');
    return (
        <div className="space-y-2">
            <input value={s.url ?? ''} onChange={e => onChange({ ...s, url: e.target.value })}
                className="w-full bg-cream border-[1.5px] border-transparent rounded-lg px-3 py-2 text-sm outline-none focus:border-yellow font-mono transition-colors"
                placeholder="https://youtube.com/watch?v=... o vimeo.com/..." />
            {embedUrl && (
                <iframe src={embedUrl} className="w-full aspect-video rounded-lg"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen />
            )}
        </div>
    );
}

// ─── Divider ─────────────────────────────────────────────────────────────────

export function ProjDividerEditor() {
    return (
        <div className="flex items-center gap-3 py-2">
            <div className="flex-1 h-px bg-text/10" />
            <span className="text-xs text-subtle">divisor</span>
            <div className="flex-1 h-px bg-text/10" />
        </div>
    );
}

// ─── Code ─────────────────────────────────────────────────────────────────────

const CODE_LANGS = ['javascript', 'typescript', 'html', 'css', 'python', 'bash', 'json', 'sql', 'php'];

export function ProjCodeEditor({ s, onChange }: EP) {
    return (
        <div className="space-y-2">
            <select value={s.language ?? 'javascript'} onChange={e => onChange({ ...s, language: e.target.value })}
                className="bg-[#2d2d2d] text-[#ccc] text-xs rounded-lg px-3 py-1.5 outline-none border border-[#444]">
                {CODE_LANGS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            <textarea value={s.content ?? ''} onChange={e => onChange({ ...s, content: e.target.value })} rows={8}
                className="w-full bg-[#1e1e1e] text-[#d4d4d4] font-mono text-sm rounded-xl px-4 py-3 outline-none border-2 border-transparent focus:border-[#3e3e3e] resize-none transition-colors"
                placeholder="// tu código aqui..." />
        </div>
    );
}

// ─── HTML ─────────────────────────────────────────────────────────────────────

export function ProjHtmlEditor({ s, onChange }: EP) {
    return (
        <textarea value={s.content ?? ''} onChange={e => onChange({ ...s, content: e.target.value })} rows={6}
            className="w-full bg-[#EDE9FE] text-violet-700 font-mono text-sm rounded-xl px-4 py-3 outline-none border-2 border-transparent focus:border-violet-300 resize-none"
            placeholder="<div>HTML personalizado...</div>" />
    );
}
