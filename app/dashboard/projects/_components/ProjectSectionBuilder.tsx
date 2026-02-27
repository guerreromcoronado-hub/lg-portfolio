'use client';

import { useState } from 'react';
import {
    ProjectSection, ProjectSectionType,
    PROJ_SECTION_TYPES, PROJ_TYPE_COLORS, PROJ_BLOCK_GROUPS,
} from './projectSectionTypes';
import {
    ParagraphEditor, HeadingEditor, Heading3Editor, QuoteEditor,
    HighlightEditor, ChallengeEditor, ProcessStepEditor, ResultItemEditor,
    LearningEditor, NumberedListEditor, CalloutEditor, ProjImageEditor,
    ProjVideoEditor, ProjDividerEditor, ProjCodeEditor, ProjHtmlEditor,
} from './ProjectSectionEditors';

// Re-export everything callers need from this barrel file
export type { ProjectSectionType, ProjectSection } from './projectSectionTypes';
export {
    newProjId, makeProjSection, buildProjectContent, sectionsFromProjectDB,
    PROJ_SECTION_TYPES, PROJ_TYPE_COLORS,
    buildMetrics, buildTools, metricsFromDB, toolsFromDB,
} from './projectSectionTypes';
export type { MetricRow, ToolRow } from './projectSectionTypes';

// ─── Section Card ─────────────────────────────────────────────────────────────

export function ProjectSectionCard({
    section, index, total,
    onMoveUp, onMoveDown, onDelete, onChange,
}: {
    section: ProjectSection; index: number; total: number;
    onMoveUp: () => void; onMoveDown: () => void;
    onDelete: () => void; onChange: (s: ProjectSection) => void;
}) {
    const meta = PROJ_SECTION_TYPES.find(t => t.type === section.type)!;

    return (
        <div className="bg-white rounded-xl border border-text/[0.07] overflow-hidden">
            {/* Card header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-text/[0.05] bg-[#FAFAF9]">
                <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold ${PROJ_TYPE_COLORS[section.type]}`}>
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
                {section.type === 'paragraph' && <ParagraphEditor s={section} onChange={onChange} />}
                {section.type === 'heading' && <HeadingEditor s={section} onChange={onChange} />}
                {section.type === 'heading3' && <Heading3Editor s={section} onChange={onChange} />}
                {section.type === 'quote' && <QuoteEditor s={section} onChange={onChange} />}
                {section.type === 'highlight' && <HighlightEditor s={section} onChange={onChange} />}
                {section.type === 'challenge' && <ChallengeEditor s={section} onChange={onChange} />}
                {section.type === 'process-step' && <ProcessStepEditor s={section} onChange={onChange} />}
                {section.type === 'result-item' && <ResultItemEditor s={section} onChange={onChange} />}
                {section.type === 'learning' && <LearningEditor s={section} onChange={onChange} />}
                {section.type === 'numbered-list' && <NumberedListEditor s={section} onChange={onChange} />}
                {section.type === 'callout' && <CalloutEditor s={section} onChange={onChange} />}
                {section.type === 'image' && <ProjImageEditor s={section} onChange={onChange} />}
                {section.type === 'video' && <ProjVideoEditor s={section} onChange={onChange} />}
                {section.type === 'divider' && <ProjDividerEditor />}
                {section.type === 'code' && <ProjCodeEditor s={section} onChange={onChange} />}
                {section.type === 'html' && <ProjHtmlEditor s={section} onChange={onChange} />}
            </div>
        </div>
    );
}

// ─── Add Section Picker (grouped, Shopify-style) ──────────────────────────────

export function AddProjectSectionPicker({ onAdd }: { onAdd: (type: ProjectSectionType) => void }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative">
            <button type="button" onClick={() => setOpen(v => !v)}
                className="w-full border-2 border-dashed border-text/10 rounded-xl py-4 text-sm text-subtle font-semibold hover:border-yellow hover:text-text transition-colors flex items-center justify-center gap-2">
                <span className="text-lg leading-none">+</span> Agregar bloque de contenido
            </button>

            {open && (
                <div className="absolute left-0 right-0 mt-2 z-20 bg-white rounded-xl shadow-xl border border-text/[0.08] p-4 space-y-4">
                    {PROJ_BLOCK_GROUPS.map(group => {
                        const types = group.items
                            .map(t => PROJ_SECTION_TYPES.find(m => m.type === t)!)
                            .filter(Boolean);
                        return (
                            <div key={group.label}>
                                <p className="text-[0.6rem] font-bold uppercase tracking-widest text-subtle mb-2">
                                    {group.label}
                                </p>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                    {types.map(({ type, label, icon, desc }) => (
                                        <button key={type} type="button"
                                            onClick={() => { onAdd(type); setOpen(false); }}
                                            className="flex flex-col items-center gap-1.5 p-3 rounded-lg hover:bg-cream transition-colors text-center border border-transparent hover:border-yellow/40">
                                            <span className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold ${PROJ_TYPE_COLORS[type]}`}>
                                                {icon}
                                            </span>
                                            <span className="text-xs font-bold text-text leading-tight">{label}</span>
                                            <span className="text-[0.65rem] text-subtle leading-tight">{desc}</span>
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
