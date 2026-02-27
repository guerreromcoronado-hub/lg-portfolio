'use client';

import { UseFormRegister } from 'react-hook-form';
import { TagsInput } from '../../_components/TagsInput';
import { SideCard } from '../../_components/SideCard';
import { SerpPreview } from '../../posts/_components/SerpPreview';

// ─── Shared form interface ─────────────────────────────────────────────────────
// Exported so both new/page.tsx and [id]/page.tsx can import it from here.

export interface ProjectMeta {
    title: string;
    slug: string;
    excerpt: string;
    category: string;
    emoji: string;
    client: string;
    services: string;
    duration: string;
    year: string;
    heroDescription: string;
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
    published: boolean;
    setPublished: (v: boolean) => void;
    featured: boolean;
    setFeatured: (v: boolean) => void;
    coverDisplayed: string | null;
    onCoverClick: () => void;
    onCoverRemove: () => void;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    regMeta: UseFormRegister<ProjectMeta>;
    /** Called on every slug input change (used by edit page to sync currentSlug) */
    onSlugChange?: (slug: string) => void;
    projectTags: string[];
    setProjectTags: (tags: string[]) => void;
    metaTitle: string;
    setMetaTitle: (t: string) => void;
    metaDesc: string;
    setMetaDesc: (d: string) => void;
    slug: string;
    currentSlug?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ProjectSidebar({
    published, setPublished,
    featured, setFeatured,
    coverDisplayed,
    onCoverClick, onCoverRemove,
    fileInputRef, onFileChange,
    regMeta, onSlugChange,
    projectTags, setProjectTags,
    metaTitle, setMetaTitle,
    metaDesc, setMetaDesc,
    slug, currentSlug = '',
}: Props) {
    return (
        <div className="w-full lg:w-[320px] flex-shrink-0 space-y-4">

            {/* Publicación */}
            <SideCard title="Publicación">
                <div className="space-y-3">
                    <label className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer border-2 transition-colors ${published ? 'border-yellow bg-yellow/5' : 'border-transparent hover:bg-cream/50'}`}>
                        <input type="checkbox" checked={published} onChange={e => setPublished(e.target.checked)} className="accent-yellow w-4 h-4" />
                        <div>
                            <p className="text-sm font-semibold text-text">{published ? 'Publicado' : 'Publicar ahora'}</p>
                            <p className="text-xs text-subtle">Visible al público</p>
                        </div>
                    </label>
                    <label className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer border-2 transition-colors ${featured ? 'border-orange bg-orange/5' : 'border-transparent hover:bg-cream/50'}`}>
                        <input type="checkbox" checked={featured} onChange={e => setFeatured(e.target.checked)} className="accent-orange w-4 h-4" />
                        <div>
                            <p className="text-sm font-semibold text-text">Destacado ⭐</p>
                            <p className="text-xs text-subtle">Aparece en el home</p>
                        </div>
                    </label>
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
                <p className="text-[0.65rem] text-subtle mt-2">JPG, PNG o WebP · máx. 5 MB</p>
            </SideCard>

            {/* Resumen */}
            <SideCard title="Resumen">
                <textarea {...regMeta('excerpt', { required: true })} rows={3}
                    className="w-full bg-cream border-[1.5px] border-transparent rounded-lg px-3 py-2 text-sm outline-none focus:border-yellow transition-colors resize-none"
                    placeholder="Descripción breve para las cards del portfolio..." />
            </SideCard>

            {/* Organización */}
            <SideCard title="Organización">
                <div className="space-y-3">
                    <div className="grid grid-cols-[48px_1fr] gap-2">
                        <div>
                            <label className="block text-[0.65rem] font-bold tracking-wider uppercase text-subtle mb-1">Emoji</label>
                            <input {...regMeta('emoji')}
                                className="w-full bg-cream border-[1.5px] border-transparent rounded-lg px-1 py-2 text-xl text-center outline-none focus:border-yellow" />
                        </div>
                        <div>
                            <label className="block text-[0.65rem] font-bold tracking-wider uppercase text-subtle mb-1">Categoría *</label>
                            <input {...regMeta('category', { required: true })}
                                className="w-full bg-cream border-[1.5px] border-transparent rounded-lg px-3 py-2 text-sm outline-none focus:border-yellow"
                                placeholder="Email Marketing" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-[0.65rem] font-bold tracking-wider uppercase text-subtle mb-1">URL (slug)</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[0.65rem] text-subtle font-mono">/proyectos/</span>
                            <input {...regMeta('slug', { required: true })}
                                onChange={e => {
                                    regMeta('slug').onChange(e);
                                    onSlugChange?.(e.target.value);
                                }}
                                className="w-full bg-cream border-[1.5px] border-transparent rounded-lg pl-[5.5rem] pr-3 py-2 text-xs font-mono outline-none focus:border-yellow"
                                placeholder="mi-proyecto" />
                        </div>
                    </div>
                </div>
            </SideCard>

            {/* Detalles del proyecto */}
            <SideCard title="Detalles del proyecto">
                <div className="space-y-3">
                    {([
                        { field: 'client' as const, label: 'Cliente', placeholder: 'Nombre del cliente' },
                        { field: 'services' as const, label: 'Servicios', placeholder: 'Email Marketing, Copy...' },
                        { field: 'duration' as const, label: 'Duración', placeholder: '3 meses' },
                        { field: 'year' as const, label: 'Año', placeholder: '2024' },
                    ] as const).map(({ field, label, placeholder }) => (
                        <div key={field}>
                            <label className="block text-[0.65rem] font-bold tracking-wider uppercase text-subtle mb-1">{label}</label>
                            <input {...regMeta(field)}
                                className="w-full bg-cream border-[1.5px] border-transparent rounded-lg px-3 py-2 text-sm outline-none focus:border-yellow transition-colors"
                                placeholder={placeholder} />
                        </div>
                    ))}
                </div>
            </SideCard>

            {/* Etiquetas */}
            <SideCard title="Etiquetas">
                <TagsInput value={projectTags} onChange={setProjectTags} placeholder="email-marketing, copy..." />
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
                        <p className="text-[0.65rem] font-bold tracking-wider uppercase text-subtle mb-2">Previsualización</p>
                        <SerpPreview title={metaTitle} description={metaDesc} slug={slug || currentSlug} basePath="proyectos" />
                    </div>
                </div>
            </SideCard>

        </div>
    );
}
