'use client';

import { UseFormRegister } from 'react-hook-form';
import { TagsInput } from '../../_components/TagsInput';
import { SideCard } from '../../_components/SideCard';
import { SerpPreview } from './SerpPreview';

// ─── Shared types ─────────────────────────────────────────────────────────────
// Exported so both new/page.tsx and [id]/page.tsx can import from here.

export type PublishStatus = 'draft' | 'active' | 'scheduled';

export interface PostFormData {
    title: string;
    slug: string;
    excerpt: string;
    category: string;
    emoji: string;
    read_time: string;
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
    publishStatus: PublishStatus;
    setPublishStatus: (s: PublishStatus) => void;
    scheduleDate: string;
    setScheduleDate: (d: string) => void;
    coverDisplayed: string | null;
    onCoverClick: () => void;
    onCoverRemove: () => void;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    uploadProgress?: number;
    register: UseFormRegister<PostFormData>;
    tags: string[];
    setTags: (tags: string[]) => void;
    metaTitle: string;
    setMetaTitle: (t: string) => void;
    metaDesc: string;
    setMetaDesc: (d: string) => void;
    slug: string;
    currentSlug?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function PostSidebar({
    publishStatus, setPublishStatus,
    scheduleDate, setScheduleDate,
    coverDisplayed, onCoverClick, onCoverRemove,
    fileInputRef, onFileChange, uploadProgress = 0,
    register, tags, setTags,
    metaTitle, setMetaTitle,
    metaDesc, setMetaDesc,
    slug, currentSlug = '',
}: Props) {
    const STATUSES = [
        { value: 'draft' as PublishStatus, label: 'Borrador', hint: 'No visible al público' },
        { value: 'active' as PublishStatus, label: 'Activo', hint: 'Visible al público' },
        { value: 'scheduled' as PublishStatus, label: 'Programado', hint: 'Se publicará en fecha elegida' },
    ];

    return (
        <div className="w-full lg:w-[320px] flex-shrink-0 space-y-4">

            {/* Estado de publicación */}
            <SideCard title="Estado de publicación">
                <div className="space-y-2">
                    {STATUSES.map(({ value, label, hint }) => (
                        <label key={value}
                            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer border-2 transition-colors ${publishStatus === value ? 'border-yellow bg-yellow/5' : 'border-transparent hover:bg-cream/50'}`}>
                            <input type="radio" name="publish_status" value={value} checked={publishStatus === value}
                                onChange={() => setPublishStatus(value)} className="accent-yellow w-4 h-4" />
                            <div>
                                <p className="text-sm font-semibold text-text">{label}</p>
                                <p className="text-xs text-subtle">{hint}</p>
                            </div>
                        </label>
                    ))}
                    {publishStatus === 'scheduled' && (
                        <input type="datetime-local" value={scheduleDate}
                            onChange={e => setScheduleDate(e.target.value)}
                            className="w-full bg-cream border-[1.5px] border-yellow rounded-lg px-3 py-2 text-sm outline-none focus:border-yellow" />
                    )}
                </div>
            </SideCard>

            {/* Imagen destacada */}
            <SideCard title="Imagen destacada">
                {coverDisplayed ? (
                    <div className="relative rounded-lg overflow-hidden group -mx-4 -mt-3 mb-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={coverDisplayed} alt="Portada" className="w-full h-36 object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button type="button" onClick={onCoverClick}
                                className="bg-white text-text text-xs font-bold px-3 py-1.5 rounded-full">↻ Cambiar</button>
                            <button type="button" onClick={onCoverRemove}
                                className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">× Quitar</button>
                        </div>
                    </div>
                ) : (
                    <button type="button" onClick={onCoverClick}
                        className="w-full border-2 border-dashed border-text/10 rounded-lg h-28 flex flex-col items-center justify-center gap-2 hover:border-yellow hover:bg-cream/40 transition-colors text-subtle">
                        <span className="text-2xl">🖼</span>
                        <span className="text-xs font-semibold">Subir imagen</span>
                    </button>
                )}
                <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden" onChange={onFileChange} />
                {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="mt-2 h-1 bg-cream rounded-full overflow-hidden">
                        <div className="h-full bg-yellow" style={{ width: `${uploadProgress}%` }} />
                    </div>
                )}
                <p className="text-[0.65rem] text-subtle mt-2">JPG, PNG o WebP · máx. 5 MB · 1200×500 rec.</p>
            </SideCard>

            {/* Resumen */}
            <SideCard title="Resumen">
                <textarea {...register('excerpt', { required: true })} rows={3}
                    className="w-full bg-cream border-[1.5px] border-transparent rounded-lg px-3 py-2 text-sm outline-none focus:border-yellow transition-colors resize-none"
                    placeholder="Descripción corta del post (aparece en las cards del blog)..." />
            </SideCard>

            {/* Organización */}
            <SideCard title="Organización">
                <div className="space-y-3">
                    <div className="grid grid-cols-[52px_1fr] gap-2">
                        <div>
                            <label className="block text-[0.65rem] font-bold tracking-wider uppercase text-subtle mb-1">Emoji</label>
                            <input {...register('emoji')}
                                className="w-full bg-cream border-[1.5px] border-transparent rounded-lg px-1 py-2 text-xl text-center outline-none focus:border-yellow transition-colors" />
                        </div>
                        <div>
                            <label className="block text-[0.65rem] font-bold tracking-wider uppercase text-subtle mb-1">Categoría *</label>
                            <input {...register('category', { required: true })}
                                className="w-full bg-cream border-[1.5px] border-transparent rounded-lg px-3 py-2 text-sm outline-none focus:border-yellow transition-colors"
                                placeholder="Email Marketing" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-[0.65rem] font-bold tracking-wider uppercase text-subtle mb-1">Tiempo de lectura</label>
                        <input {...register('read_time')}
                            className="w-full bg-cream border-[1.5px] border-transparent rounded-lg px-3 py-2 text-sm outline-none focus:border-yellow transition-colors"
                            placeholder="7 min" />
                    </div>
                </div>
            </SideCard>

            {/* Etiquetas */}
            <SideCard title="Etiquetas">
                <TagsInput value={tags} onChange={setTags} placeholder="email-marketing, copywriting..." />
                <p className="text-[0.65rem] text-subtle mt-2">Pulsa Enter o coma para añadir cada etiqueta.</p>
            </SideCard>

            {/* SEO */}
            <SideCard title="SEO" collapsible>
                <div className="space-y-3">
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label className="text-[0.65rem] font-bold tracking-wider uppercase text-subtle">Meta título</label>
                            <span className={`text-[0.6rem] font-mono ${metaTitle.length > 60 ? 'text-red-500' : 'text-subtle'}`}>
                                {metaTitle.length}/60
                            </span>
                        </div>
                        <input value={metaTitle} onChange={e => setMetaTitle(e.target.value)}
                            className="w-full bg-cream border-[1.5px] border-transparent rounded-lg px-3 py-2 text-sm outline-none focus:border-yellow transition-colors"
                            placeholder="Título para Google (máx. 60 chars)" />
                    </div>
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label className="text-[0.65rem] font-bold tracking-wider uppercase text-subtle">Meta descripción</label>
                            <span className={`text-[0.6rem] font-mono ${metaDesc.length > 160 ? 'text-red-500' : 'text-subtle'}`}>
                                {metaDesc.length}/160
                            </span>
                        </div>
                        <textarea value={metaDesc} onChange={e => setMetaDesc(e.target.value)} rows={3}
                            className="w-full bg-cream border-[1.5px] border-transparent rounded-lg px-3 py-2 text-sm outline-none focus:border-yellow transition-colors resize-none"
                            placeholder="Descripción para Google (máx. 160 chars)" />
                    </div>
                    <div>
                        <label className="block text-[0.65rem] font-bold tracking-wider uppercase text-subtle mb-1">URL (handle)</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[0.65rem] text-subtle font-mono">/blog/</span>
                            <input {...register('slug', { required: true })}
                                className="w-full bg-cream border-[1.5px] border-transparent rounded-lg pl-10 pr-3 py-2 text-xs font-mono outline-none focus:border-yellow transition-colors"
                                placeholder="mi-post-url" />
                        </div>
                    </div>
                    <div>
                        <p className="text-[0.65rem] font-bold tracking-wider uppercase text-subtle mb-2">Previsualización</p>
                        <SerpPreview title={metaTitle} description={metaDesc} slug={slug || currentSlug} />
                    </div>
                </div>
            </SideCard>

        </div>
    );
}
