'use client';

import { useRef } from 'react';
import { Section, ErrorItem } from './sectionTypes';

/**
 * Internal block editor components used by SectionCard.
 * Not exported from the package — import SectionCard instead.
 */

// ─── Paragraph ────────────────────────────────────────────────────────────────

export function ParagraphEditor({ section, onChange }: { section: Section; onChange: (s: Section) => void }) {
    return (
        <textarea
            value={section.content ?? ''}
            onChange={e => onChange({ ...section, content: e.target.value })}
            rows={4}
            className="w-full bg-cream border-[1.5px] border-transparent rounded-lg px-4 py-3 text-sm outline-none focus:border-yellow transition-colors resize-none"
            placeholder="Escribe tu párrafo aquí..."
        />
    );
}

// ─── Heading (H2 / H3) ────────────────────────────────────────────────────────

export function HeadingEditor({
    section, onChange, level,
}: { section: Section; onChange: (s: Section) => void; level: 2 | 3 }) {
    return (
        <div className="space-y-1">
            <input
                value={section.content ?? ''}
                onChange={e => onChange({ ...section, content: e.target.value })}
                className={`w-full bg-cream border-[1.5px] border-transparent rounded-lg px-4 py-3 font-bold outline-none focus:border-yellow transition-colors ${level === 2 ? 'text-xl' : 'text-base'}`}
                placeholder={`Título H${level}`}
            />
            {section.content && (
                <p className="text-xs text-subtle italic">Vista previa: aparecerá como H{level} en el artículo</p>
            )}
        </div>
    );
}

// ─── Quote ────────────────────────────────────────────────────────────────────

export function QuoteEditor({ section, onChange }: { section: Section; onChange: (s: Section) => void }) {
    return (
        <div className="border-l-4 border-yellow pl-4">
            <textarea
                value={section.content ?? ''}
                onChange={e => onChange({ ...section, content: e.target.value })}
                rows={3}
                className="w-full bg-[#FDF8DC] border-[1.5px] border-transparent rounded-lg px-4 py-3 text-sm italic text-[#e07b00] font-medium outline-none focus:border-yellow transition-colors resize-none"
                placeholder='El open rate no se gana en el cuerpo del email. Se gana en el asunto.'
            />
        </div>
    );
}

// ─── List (bullet / numbered) ─────────────────────────────────────────────────

export function ListEditor({
    section, onChange, numbered,
}: { section: Section; onChange: (s: Section) => void; numbered?: boolean }) {
    const items = (section.items ?? []) as string[];
    const update = (idx: number, val: string) => {
        const next = [...items]; next[idx] = val;
        onChange({ ...section, items: next });
    };
    const add = () => onChange({ ...section, items: [...items, ''] });
    const remove = (idx: number) => onChange({ ...section, items: items.filter((_, i) => i !== idx) });

    return (
        <div className="space-y-2">
            {items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                    <span className="w-6 h-6 flex-shrink-0 flex items-center justify-center">
                        {numbered
                            ? <span className="text-xs font-bold text-blue-500">{idx + 1}.</span>
                            : <span className="w-2 h-2 rounded-full bg-orange" />}
                    </span>
                    <input
                        value={item}
                        onChange={e => update(idx, e.target.value)}
                        className="flex-1 bg-cream border-[1.5px] border-transparent rounded-lg px-3 py-2 text-sm outline-none focus:border-yellow transition-colors"
                        placeholder={`${numbered ? 'Paso' : 'Punto'} ${idx + 1}`}
                    />
                    {items.length > 1 && (
                        <button type="button" onClick={() => remove(idx)}
                            className="w-7 h-7 flex items-center justify-center rounded-full bg-red-50 text-red-400 hover:bg-red-100 text-xs font-bold flex-shrink-0">
                            ×
                        </button>
                    )}
                </div>
            ))}
            <button type="button" onClick={add} className="text-xs text-orange font-semibold hover:text-[#e55a25]">
                + Agregar {numbered ? 'paso' : 'punto'}
            </button>
        </div>
    );
}

// ─── Highlight ────────────────────────────────────────────────────────────────

export function HighlightEditor({ section, onChange }: { section: Section; onChange: (s: Section) => void }) {
    return (
        <div className="space-y-3 border-l-4 border-orange pl-4">
            <input
                value={section.title ?? ''}
                onChange={e => onChange({ ...section, title: e.target.value })}
                className="w-full bg-cream border-[1.5px] border-transparent rounded-lg px-4 py-2 text-sm font-bold uppercase tracking-wider outline-none focus:border-yellow transition-colors"
                placeholder="↗ Diagnóstico rápido"
            />
            <textarea
                value={section.content ?? ''}
                onChange={e => onChange({ ...section, content: e.target.value })}
                rows={3}
                className="w-full bg-cream border-[1.5px] border-transparent rounded-lg px-4 py-3 text-sm outline-none focus:border-yellow transition-colors resize-none"
                placeholder="Usa Mail-Tester.com para revisar la reputación de tu dominio..."
            />
        </div>
    );
}

// ─── Callout ─────────────────────────────────────────────────────────────────

export const CALLOUT_VARIANTS = [
    { value: 'tip', label: 'Tip', colors: 'bg-emerald-50 text-emerald-800', border: 'border-emerald-400', icon: '💡' },
    { value: 'info', label: 'Info', colors: 'bg-blue-50 text-blue-800', border: 'border-blue-400', icon: 'ℹ️' },
    { value: 'warning', label: 'Warning', colors: 'bg-amber-50 text-amber-800', border: 'border-amber-400', icon: '⚠️' },
    { value: 'danger', label: 'Peligro', colors: 'bg-red-50 text-red-800', border: 'border-red-400', icon: '🚨' },
];

export function CalloutEditor({ section, onChange }: { section: Section; onChange: (s: Section) => void }) {
    const variant = CALLOUT_VARIANTS.find(v => v.value === section.variant) ?? CALLOUT_VARIANTS[0];
    return (
        <div className="space-y-3">
            <div className="flex gap-2 flex-wrap">
                {CALLOUT_VARIANTS.map(v => (
                    <button key={v.value} type="button"
                        onClick={() => onChange({ ...section, variant: v.value })}
                        className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border-2 transition-colors ${section.variant === v.value ? `${v.border} ${v.colors}` : 'border-transparent bg-cream text-subtle hover:bg-[#f0ede6]'}`}>
                        <span>{v.icon}</span> {v.label}
                    </button>
                ))}
            </div>
            <div className={`border-l-4 ${variant.border} pl-4`}>
                <textarea
                    value={section.content ?? ''}
                    onChange={e => onChange({ ...section, content: e.target.value })}
                    rows={3}
                    className={`w-full border-[1.5px] border-transparent rounded-lg px-4 py-3 text-sm outline-none focus:border-yellow transition-colors resize-none ${variant.colors}`}
                    placeholder={`${variant.icon} Escribe el contenido del callout...`}
                />
            </div>
        </div>
    );
}

// ─── Image ────────────────────────────────────────────────────────────────────

export function ImageEditor({ section, onChange }: { section: Section; onChange: (s: Section) => void }) {
    const fileRef = useRef<HTMLInputElement>(null);

    const handleFile = (file: File | null) => {
        if (!file) { onChange({ ...section, url: '' }); return; }
        const reader = new FileReader();
        reader.onload = e => onChange({ ...section, url: e.target?.result as string });
        reader.readAsDataURL(file);
        (window as unknown as Record<string, File>)[`__img_${section.id}`] = file;
    };

    const preview = section.url && !section.url.startsWith('__file__') ? section.url : null;

    return (
        <div className="space-y-3">
            {preview ? (
                <div className="relative rounded-xl overflow-hidden group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={preview} alt={section.alt ?? ''} className="w-full max-h-64 object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <button type="button" onClick={() => fileRef.current?.click()}
                            className="bg-white text-text text-xs font-bold px-4 py-2 rounded-full">↻ Cambiar</button>
                        <button type="button" onClick={() => handleFile(null)}
                            className="bg-red-500 text-white text-xs font-bold px-4 py-2 rounded-full">× Quitar</button>
                    </div>
                </div>
            ) : (
                <div className="space-y-2">
                    <button type="button" onClick={() => fileRef.current?.click()}
                        className="w-full border-2 border-dashed border-text/10 rounded-xl h-32 flex flex-col items-center justify-center gap-2 hover:border-yellow hover:bg-cream/40 transition-colors text-subtle">
                        <span className="text-3xl">🖼</span>
                        <span className="text-xs font-semibold">Haz clic para subir imagen</span>
                    </button>
                    <input
                        value={section.url ?? ''}
                        onChange={e => onChange({ ...section, url: e.target.value })}
                        className="w-full bg-cream border-[1.5px] border-transparent rounded-lg px-3 py-2 text-xs font-mono outline-none focus:border-yellow transition-colors"
                        placeholder="O pega una URL: https://..."
                    />
                </div>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden"
                onChange={e => handleFile(e.target.files?.[0] ?? null)} />
            <div className="grid grid-cols-2 gap-2">
                <input value={section.alt ?? ''} onChange={e => onChange({ ...section, alt: e.target.value })}
                    className="bg-cream border-[1.5px] border-transparent rounded-lg px-3 py-2 text-xs outline-none focus:border-yellow transition-colors"
                    placeholder="Texto alternativo (alt)" />
                <input value={section.caption ?? ''} onChange={e => onChange({ ...section, caption: e.target.value })}
                    className="bg-cream border-[1.5px] border-transparent rounded-lg px-3 py-2 text-xs outline-none focus:border-yellow transition-colors"
                    placeholder="Caption (opcional)" />
            </div>
        </div>
    );
}

// ─── Video ────────────────────────────────────────────────────────────────────

export function VideoEditor({ section, onChange }: { section: Section; onChange: (s: Section) => void }) {
    const getEmbedUrl = (url: string) => {
        try {
            const u = new URL(url);
            if (u.hostname.includes('youtube.com') || u.hostname.includes('youtu.be')) {
                const vid = u.searchParams.get('v') || u.pathname.split('/').pop();
                return `https://www.youtube.com/embed/${vid}`;
            }
            if (u.hostname.includes('vimeo.com')) {
                return `https://player.vimeo.com/video/${u.pathname.split('/').pop()}`;
            }
        } catch { /* ignore */ }
        return null;
    };

    const embedUrl = section.url ? getEmbedUrl(section.url) : null;

    return (
        <div className="space-y-3">
            <input
                value={section.url ?? ''}
                onChange={e => onChange({ ...section, url: e.target.value })}
                className="w-full bg-cream border-[1.5px] border-transparent rounded-lg px-4 py-3 text-sm font-mono outline-none focus:border-yellow transition-colors"
                placeholder="https://www.youtube.com/watch?v=... o vimeo.com/..."
            />
            {embedUrl && (
                <div className="rounded-xl overflow-hidden aspect-video bg-black">
                    <iframe src={embedUrl} className="w-full h-full" allowFullScreen title="Video embed" />
                </div>
            )}
            <input value={section.caption ?? ''} onChange={e => onChange({ ...section, caption: e.target.value })}
                className="w-full bg-cream border-[1.5px] border-transparent rounded-lg px-3 py-2 text-xs outline-none focus:border-yellow transition-colors"
                placeholder="Caption del video (opcional)" />
        </div>
    );
}

// ─── Divider ─────────────────────────────────────────────────────────────────

export function DividerEditor() {
    return (
        <div className="py-3 flex items-center gap-4">
            <div className="flex-1 h-px bg-text/10" />
            <span className="text-xs text-subtle">— separador —</span>
            <div className="flex-1 h-px bg-text/10" />
        </div>
    );
}

// ─── Code ─────────────────────────────────────────────────────────────────────

const CODE_LANGS = ['text', 'javascript', 'typescript', 'python', 'html', 'css', 'json', 'bash', 'sql', 'php'];

export function CodeEditor({ section, onChange }: { section: Section; onChange: (s: Section) => void }) {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-subtle uppercase tracking-wider">Lenguaje:</label>
                <select value={section.language ?? 'text'} onChange={e => onChange({ ...section, language: e.target.value })}
                    className="bg-cream border-[1.5px] border-transparent rounded-lg px-3 py-1.5 text-xs outline-none focus:border-yellow transition-colors">
                    {CODE_LANGS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
            </div>
            <textarea
                value={section.content ?? ''}
                onChange={e => onChange({ ...section, content: e.target.value })}
                rows={6} spellCheck={false}
                className="w-full bg-slate-900 text-green-400 border-[1.5px] border-slate-700 rounded-lg px-4 py-3 text-xs font-mono outline-none focus:border-yellow transition-colors resize-y"
                placeholder="// Pega o escribe tu código aquí..."
            />
        </div>
    );
}

// ─── HTML ─────────────────────────────────────────────────────────────────────

export function HtmlEditor({ section, onChange }: { section: Section; onChange: (s: Section) => void }) {
    return (
        <div className="space-y-2">
            <textarea
                value={section.content ?? ''}
                onChange={e => onChange({ ...section, content: e.target.value })}
                rows={5} spellCheck={false}
                className="w-full bg-slate-50 border-[1.5px] border-slate-200 rounded-lg px-4 py-3 text-xs font-mono text-slate-700 outline-none focus:border-yellow transition-colors resize-y"
                placeholder="<div>Tu HTML personalizado aquí...</div>"
            />
            <p className="text-xs text-subtle">⚠️ El HTML se renderizará tal cual en el artículo.</p>
        </div>
    );
}

// ─── Error List ───────────────────────────────────────────────────────────────

export function ErrorListEditor({ section, onChange }: { section: Section; onChange: (s: Section) => void }) {
    const items = (section.items ?? []) as ErrorItem[];

    const update = (idx: number, field: keyof ErrorItem, val: string) => {
        const next = items.map((item, i) => i === idx ? { ...item, [field]: val } : item);
        onChange({ ...section, items: next });
    };
    const add = () => {
        const n = items.length + 1;
        onChange({ ...section, items: [...items, { number: n < 10 ? `0${n}` : `${n}`, title: '', description: '', fix: '' }] });
    };
    const remove = (idx: number) => onChange({ ...section, items: items.filter((_, i) => i !== idx) });

    return (
        <div className="space-y-4">
            {items.map((item, idx) => (
                <div key={idx} className="bg-white rounded-xl border border-black/[0.07] p-4 space-y-3 relative">
                    {items.length > 1 && (
                        <button type="button" onClick={() => remove(idx)}
                            className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-full bg-red-50 text-red-400 hover:bg-red-100 text-xs font-bold">
                            ×
                        </button>
                    )}
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-orange text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {item.number || String(idx + 1).padStart(2, '0')}
                        </div>
                        <div className="grid grid-cols-[60px_1fr] gap-2 flex-1">
                            <input value={item.number} onChange={e => update(idx, 'number', e.target.value)}
                                className="bg-cream border-[1.5px] border-transparent rounded-lg px-2 py-2 text-sm text-center font-bold outline-none focus:border-yellow transition-colors"
                                placeholder="01" />
                            <input value={item.title} onChange={e => update(idx, 'title', e.target.value)}
                                className="bg-cream border-[1.5px] border-transparent rounded-lg px-3 py-2 text-sm font-semibold outline-none focus:border-yellow transition-colors"
                                placeholder="Título del error o tip" />
                        </div>
                    </div>
                    <textarea value={item.description} onChange={e => update(idx, 'description', e.target.value)} rows={2}
                        className="w-full bg-cream border-[1.5px] border-transparent rounded-lg px-3 py-2 text-sm text-muted outline-none focus:border-yellow transition-colors resize-none"
                        placeholder="Descripción del problema..." />
                    <div className="border-l-4 border-yellow pl-3">
                        <textarea value={item.fix} onChange={e => update(idx, 'fix', e.target.value)} rows={2}
                            className="w-full bg-[#FDF8DC] border-[1.5px] border-transparent rounded-lg px-3 py-2 text-sm outline-none focus:border-yellow transition-colors resize-none"
                            placeholder="✓ Solución: cómo corregirlo..." />
                    </div>
                </div>
            ))}
            <button type="button" onClick={add} className="text-xs text-orange font-semibold hover:text-[#e55a25]">
                + Agregar error / tip
            </button>
        </div>
    );
}
