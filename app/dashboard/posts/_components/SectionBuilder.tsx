'use client';

import { useState } from 'react';
import {
    Section, SectionType,
    SECTION_TYPES_META, TYPE_COLORS, BLOCK_GROUPS,
} from './sectionTypes';
import {
    ParagraphEditor, HeadingEditor, QuoteEditor, ListEditor,
    HighlightEditor, CalloutEditor, ImageEditor, VideoEditor,
    DividerEditor, CodeEditor, HtmlEditor, ErrorListEditor,
} from './SectionEditors';

// Re-export everything callers might need from this barrel file
export type { SectionType, Section, ErrorItem } from './sectionTypes';
export {
    newId, makeSection, buildContent, sectionsFromDB,
    SECTION_TYPES_META, SECTION_TYPES, TYPE_COLORS,
} from './sectionTypes';

// ─── Section Card ─────────────────────────────────────────────────────────────

export function SectionCard({
    section, index, total,
    onMoveUp, onMoveDown, onDelete, onChange,
}: {
    section: Section; index: number; total: number;
    onMoveUp: () => void; onMoveDown: () => void;
    onDelete: () => void; onChange: (s: Section) => void;
}) {
    const meta = SECTION_TYPES_META.find(t => t.type === section.type)!;

    return (
        <div className="bg-white rounded-xl border border-text/[0.07] overflow-hidden">
            {/* Card header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-text/[0.05] bg-[#FAFAF9]">
                <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold ${TYPE_COLORS[section.type]}`}>
                        {meta.icon}
                    </span>
                    <span className="text-xs font-bold text-text">{meta.label}</span>
                    <span className="text-xs text-subtle hidden sm:inline">{meta.desc}</span>
                </div>
                <div className="flex items-center gap-1">
                    <button type="button" onClick={onMoveUp} disabled={index === 0}
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-subtle hover:text-text hover:bg-cream transition-colors disabled:opacity-25 disabled:cursor-not-allowed text-sm"
                        title="Mover arriba">↑</button>
                    <button type="button" onClick={onMoveDown} disabled={index === total - 1}
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-subtle hover:text-text hover:bg-cream transition-colors disabled:opacity-25 disabled:cursor-not-allowed text-sm"
                        title="Mover abajo">↓</button>
                    <div className="w-px h-5 bg-text/[0.08] mx-1" />
                    <button type="button" onClick={onDelete}
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-red-400 hover:bg-red-50 transition-colors text-sm font-bold"
                        title="Eliminar">×</button>
                </div>
            </div>

            {/* Editor body */}
            <div className="p-4">
                {section.type === 'paragraph' && <ParagraphEditor section={section} onChange={onChange} />}
                {section.type === 'heading' && <HeadingEditor section={section} onChange={onChange} level={2} />}
                {section.type === 'heading3' && <HeadingEditor section={section} onChange={onChange} level={3} />}
                {section.type === 'quote' && <QuoteEditor section={section} onChange={onChange} />}
                {section.type === 'list' && <ListEditor section={section} onChange={onChange} />}
                {section.type === 'numbered-list' && <ListEditor section={section} onChange={onChange} numbered />}
                {section.type === 'highlight' && <HighlightEditor section={section} onChange={onChange} />}
                {section.type === 'error-list' && <ErrorListEditor section={section} onChange={onChange} />}
                {section.type === 'callout' && <CalloutEditor section={section} onChange={onChange} />}
                {section.type === 'image' && <ImageEditor section={section} onChange={onChange} />}
                {section.type === 'video' && <VideoEditor section={section} onChange={onChange} />}
                {section.type === 'divider' && <DividerEditor />}
                {section.type === 'code' && <CodeEditor section={section} onChange={onChange} />}
                {section.type === 'html' && <HtmlEditor section={section} onChange={onChange} />}
            </div>
        </div>
    );
}

// ─── Add Section Picker (grouped, Shopify-style) ──────────────────────────────

export function AddSectionPicker({ onAdd }: { onAdd: (type: SectionType) => void }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative">
            <button type="button" onClick={() => setOpen(v => !v)}
                className="w-full border-2 border-dashed border-text/10 rounded-xl py-4 text-sm text-subtle font-semibold hover:border-yellow hover:text-text transition-colors flex items-center justify-center gap-2">
                <span className="text-lg leading-none">+</span> Agregar bloque
            </button>

            {open && (
                <div className="absolute left-0 right-0 mt-2 z-20 bg-white rounded-xl shadow-2xl border border-text/[0.08] p-4 space-y-4">
                    {BLOCK_GROUPS.map(group => {
                        const types = SECTION_TYPES_META.filter(t => t.group === group);
                        return (
                            <div key={group}>
                                <p className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-subtle mb-2 px-1">
                                    {group}
                                </p>
                                <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                                    {types.map(({ type, label, icon, desc }) => (
                                        <button key={type} type="button"
                                            onClick={() => { onAdd(type); setOpen(false); }}
                                            className="flex flex-col items-center gap-1.5 p-3 rounded-lg hover:bg-cream transition-colors text-center border border-transparent hover:border-yellow/40">
                                            <span className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold ${TYPE_COLORS[type]}`}>
                                                {icon}
                                            </span>
                                            <span className="text-xs font-bold text-text leading-tight">{label}</span>
                                            <span className="text-[0.6rem] text-subtle leading-tight hidden sm:block">{desc}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
