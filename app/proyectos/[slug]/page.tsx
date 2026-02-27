import { notFound } from 'next/navigation';
import Link from 'next/link';
import BlogNavigation from '@/components/BlogNavigation';
import Footer from '@/components/Footer';
import { getProjectBySlug, localizeProject } from '@/lib/api/content';
import { getServerDictionary } from '@/lib/i18n/server';
import type { ProjectContent } from '@/lib/types/database';
import { IconTrendingUp } from '@/components/icons';

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const { locale, dict } = await getServerDictionary();
    const d = dict.projectDetail;
    const rawProject = await getProjectBySlug(slug);

    if (!rawProject || !rawProject.published) {
        notFound();
    }

    const project = localizeProject(rawProject, locale);
    const content = project.content as ProjectContent;

    // Pre-process new-format sections into render groups so we can reproduce
    // the original design (process steps grouped under heading, results in dark grid, etc.)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const contentAny = content as any;
    const hasSections = Array.isArray(contentAny.sections);

    type RenderBlock =
        | { kind: 'single'; section: any }
        | { kind: 'process-group'; steps: any[] }
        | { kind: 'result-group'; items: any[] };

    const renderBlocks: RenderBlock[] = [];
    if (hasSections) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const secs: any[] = contentAny.sections;
        let si = 0;
        while (si < secs.length) {
            const s = secs[si];
            if (s.type === 'process-step') {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const steps: any[] = [];
                while (si < secs.length && secs[si].type === 'process-step') {
                    steps.push(secs[si]);
                    si++;
                }
                renderBlocks.push({ kind: 'process-group', steps });
            } else if (s.type === 'result-item') {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const items: any[] = [];
                while (si < secs.length && secs[si].type === 'result-item') {
                    items.push(secs[si]);
                    si++;
                }
                renderBlocks.push({ kind: 'result-group', items });
            } else {
                renderBlocks.push({ kind: 'single', section: s });
                si++;
            }
        }
    }

    return (
        <>
            <BlogNavigation />

            {/* ─── HERO ─── */}
            <section className="pt-[9rem] pb-12 px-6 md:px-12 lg:px-20 bg-[--cream] relative overflow-hidden">
                {/* Ambient radial gradients */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background:
                            'radial-gradient(ellipse 50% 80% at 85% 30%, rgba(245,197,24,0.22) 0%, transparent 60%), radial-gradient(ellipse 40% 60% at 15% 75%, rgba(245,160,32,0.14) 0%, transparent 55%)',
                    }}
                />

                {/* Breadcrumb */}
                <div className="flex items-center gap-2.5 text-[0.68rem] text-[--subtle] font-semibold tracking-[0.07em] uppercase mb-8 relative z-10">
                    <Link href="/#proyectos" className="hover:text-[--orange] transition-colors">
                        {d.breadcrumbProjects}
                    </Link>
                    <span className="opacity-40">/</span>
                    <span>{project.category}</span>
                    <span className="opacity-40">/</span>
                    <span className="max-w-[12rem] truncate">{project.title.split(' ').slice(0, 5).join(' ')}</span>
                </div>

                {/* Category tag */}
                <div className="inline-block border-[1.5px] border-[#590F23]/30 text-[--orange] text-[0.7rem] px-4 py-1.5 rounded-full font-bold tracking-[0.1em] mb-6 relative z-10">
                    [{project.category}]
                </div>

                {/* Title */}
                <h1 className="text-[clamp(2.2rem,4.5vw,3.8rem)] font-bold text-[--text] leading-[1.1] max-w-[680px] mb-6 relative z-10">
                    {project.title}
                </h1>

                {/* Meta grid */}
                <div className="flex flex-wrap gap-6 md:gap-12 mt-12 pt-12 border-t border-black/[0.08] relative z-10">
                    <div>
                        <label className="block text-[0.63rem] tracking-[0.14em] uppercase text-[--subtle] font-bold mb-1.5">
                            {d.client}
                        </label>
                        <p className="text-[0.88rem] font-semibold text-[--text]">{project.client}</p>
                    </div>
                    <div>
                        <label className="block text-[0.63rem] tracking-[0.14em] uppercase text-[--subtle] font-bold mb-1.5">
                            {d.services}
                        </label>
                        <p className="text-[0.88rem] font-semibold text-[--text]">{project.services}</p>
                    </div>
                    <div>
                        <label className="block text-[0.63rem] tracking-[0.14em] uppercase text-[--subtle] font-bold mb-1.5">
                            {d.duration}
                        </label>
                        <p className="text-[0.88rem] font-semibold text-[--text]">{project.duration}</p>
                    </div>
                    <div>
                        <label className="block text-[0.63rem] tracking-[0.14em] uppercase text-[--subtle] font-bold mb-1.5">
                            {d.year}
                        </label>
                        <p className="text-[0.88rem] font-semibold text-[--text]">{project.year}</p>
                    </div>
                </div>
            </section>

            {/* ─── COVER ─── */}
            <div className="mx-4 md:mx-12 lg:mx-20">
                <div className="h-[400px] rounded-[18px] overflow-hidden relative">
                    {project.cover_image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={project.cover_image}
                            alt={project.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div
                            className="h-full flex items-center justify-center"
                            style={{
                                background:
                                    'radial-gradient(ellipse at 28% 55%, rgba(245,197,24,0.45) 0%, transparent 55%), radial-gradient(ellipse at 72% 25%, rgba(245,160,32,0.35) 0%, transparent 50%), radial-gradient(ellipse at 85% 75%, rgba(232,114,74,0.25) 0%, transparent 45%), var(--beige)',
                            }}
                        >
                            <div className="bg-white rounded-[14px] p-8 w-[370px] shadow-[0_24px_56px_rgba(17,17,17,0.14)] border border-black/[0.07]">
                                {/* Window dots */}
                                <div className="flex gap-1.5 mb-5">
                                    <div className="w-[9px] h-[9px] rounded-full bg-black/10" />
                                    <div className="w-[9px] h-[9px] rounded-full bg-black/10" />
                                    <div className="w-[9px] h-[9px] rounded-full bg-black/10" />
                                </div>
                                {/* Fake lines */}
                                <div className="h-[7px] rounded-[4px] bg-[#590F23]/15 w-[38%] mb-[0.55rem]" />
                                <div className="h-[7px] rounded-[4px] bg-black/[0.07] w-full mb-[0.55rem]" />
                                <div className="h-[7px] rounded-[4px] bg-black/[0.07] w-[80%] mb-[0.55rem]" />
                                <div className="h-[7px] rounded-[4px] bg-black/[0.07] w-[58%] mb-[0.55rem]" />
                                <div className="h-[7px] rounded-[4px] bg-black/[0.07] w-full mb-[0.55rem]" />
                                {/* Stats from results */}
                                {project.results?.main && (
                                    <div className="flex gap-3 mt-5">
                                        {project.results.main.slice(0, 3).map((result, i) => (
                                            <div
                                                key={i}
                                                className="flex-1 bg-[--cream] rounded-[10px] p-3.5 text-center border border-black/[0.06]"
                                            >
                                                <div className="text-[1.3rem] font-bold text-[--orange] leading-none">
                                                    {result.value}
                                                </div>
                                                <div className="text-[0.58rem] text-[--subtle] font-bold tracking-[0.06em] uppercase mt-1 leading-tight">
                                                    {result.label.split(' ').slice(0, 2).join(' ')}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ─── CONTENT GRID ─── */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_270px] gap-8 lg:gap-20 px-6 md:px-12 lg:px-20 py-12 md:py-16 lg:py-24 items-start">

                {/* Article body */}
                <article>
                    {hasSections ? (
                        /* ── NEW FORMAT: content.sections[] rendered with original design ── */
                        <>
                            {/* Hero description (intro paragraph) */}
                            {contentAny.hero?.description && (
                                <p className="text-[0.97rem] leading-[1.9] text-[--text] mb-5">
                                    {String(contentAny.hero.description)}
                                </p>
                            )}

                            {renderBlocks.map((block, bi) => {
                                /* ── Process-step group ── */
                                if (block.kind === 'process-group') {
                                    return (
                                        <div key={bi}>
                                            <h2 className="text-[1.35rem] font-bold text-[--text] mb-4 mt-11">{d.process}</h2>
                                            <div className="flex flex-col gap-[1.1rem] my-6">
                                                {block.steps.map((step: any, si: number) => (
                                                    <div
                                                        key={si}
                                                        className="flex gap-5 bg-[--cream] rounded-xl p-[1.4rem] border border-black/[0.06] hover:border-[#590F23]/20 transition-colors"
                                                    >
                                                        <div className="w-9 h-9 rounded-full bg-[#FF6B35] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                                                            {step.number ? String(step.number) : String(si + 1).padStart(2, '0')}
                                                        </div>
                                                        <div>
                                                            {step.title && (
                                                                <h4 className="text-[0.92rem] font-bold text-[--text] mb-1.5">
                                                                    {String(step.title)}
                                                                </h4>
                                                            )}
                                                            {step.description && (
                                                                <p className="text-[0.86rem] text-[--muted] leading-[1.7]">
                                                                    {String(step.description)}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                }

                                /* ── Result-item group → dark metric grid ── */
                                if (block.kind === 'result-group') {
                                    const cols = Math.min(block.items.length, 3);
                                    return (
                                        <div key={bi}>
                                            <h2 className="text-[1.35rem] font-bold text-[--text] mb-4 mt-11">{d.results}</h2>
                                            <div className="bg-[#111111] rounded-2xl overflow-hidden relative my-6">
                                                <div
                                                    className="absolute top-[-40px] left-[-40px] w-[180px] h-[180px] rounded-full pointer-events-none"
                                                    style={{ background: 'radial-gradient(circle, rgba(255,107,53,0.4) 0%, transparent 70%)', filter: 'blur(20px)' }}
                                                />
                                                <div
                                                    className="absolute bottom-[-40px] right-[-40px] w-[160px] h-[160px] rounded-full pointer-events-none"
                                                    style={{ background: 'radial-gradient(circle, rgba(255,107,53,0.3) 0%, transparent 70%)', filter: 'blur(20px)' }}
                                                />
                                                <div className="flex items-center gap-2 px-7 pt-7 relative z-10">
                                                    <div className="w-4 h-[2px] bg-[#F5C518] flex-shrink-0" />
                                                    <span className="text-[0.66rem] font-bold tracking-[0.18em] uppercase text-[--orange]">
                                                        {d.finalResults}
                                                    </span>
                                                </div>
                                                <div
                                                    className="grid divide-x divide-white/[0.07] relative z-10"
                                                    style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
                                                >
                                                    {block.items.map((item: any, ii: number) => (
                                                        <div key={ii} className="text-center p-6">
                                                            <span className="text-[2.8rem] font-bold text-[#F5C518] leading-none block">
                                                                {String(item.title ?? '')}
                                                            </span>
                                                            <div className="text-[0.73rem] text-white/50 mt-2 leading-[1.4]">
                                                                {String(item.description ?? '')}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }

                                /* ── Single sections ── */
                                const s = block.section;
                                switch (s.type) {
                                    case 'paragraph':
                                        return s.content ? (
                                            <p key={bi} className="text-[0.97rem] leading-[1.9] text-[--text] mb-5">
                                                {String(s.content)}
                                            </p>
                                        ) : null;

                                    case 'heading':
                                        return s.content ? (
                                            <h2 key={bi} className="text-[1.35rem] font-bold text-[--text] mt-11 mb-4">
                                                {String(s.content)}
                                            </h2>
                                        ) : null;

                                    case 'quote':
                                        return s.content ? (
                                            <div key={bi} className="border-l-[3px] border-[--yellow] pl-7 py-3 my-10">
                                                <p className="text-[1.08rem] font-semibold text-[--orange] italic leading-[1.5]">
                                                    &ldquo;{String(s.content)}&rdquo;
                                                </p>
                                            </div>
                                        ) : null;

                                    case 'highlight':
                                        return s.content ? (
                                            <div key={bi} className="bg-[--cream] border-l-[3px] border-[--orange] rounded-r-xl p-6 my-8">
                                                {s.title && (
                                                    <h4 className="text-[0.7rem] font-bold tracking-[0.14em] uppercase text-[--orange] mb-3">
                                                        ↗ {String(s.title)}
                                                    </h4>
                                                )}
                                                <p className="text-[0.92rem] text-[--text] leading-[1.8] font-medium">
                                                    {String(s.content)}
                                                </p>
                                            </div>
                                        ) : null;

                                    case 'challenge':
                                        return s.content ? (
                                            <p key={bi} className="text-[0.97rem] leading-[1.9] text-[--text] mb-5">
                                                {String(s.content)}
                                            </p>
                                        ) : null;

                                    case 'learning':
                                        return s.content ? (
                                            <div key={bi}>
                                                <h2 className="text-[1.35rem] font-bold text-[--text] mt-11 mb-4">{d.learnings}</h2>
                                                <p className="text-[0.97rem] leading-[1.9] text-[--text] mb-5">
                                                    {String(s.content)}
                                                </p>
                                            </div>
                                        ) : null;

                                    default:
                                        return null;
                                }
                            })}
                        </>
                    ) : (
                        /* ── LEGACY FORMAT: fixed content keys ─────────────────── */
                        <>
                            {/* Context */}
                            {content.context && (
                                <>
                                    <h2 className="text-[1.35rem] font-bold text-[--text] mb-4">{d.context}</h2>
                                    <p className="text-[0.97rem] leading-[1.9] text-[--text] mb-5">{content.context}</p>
                                </>
                            )}

                            {/* Pull quote */}
                            {content.quote && (
                                <div className="border-l-[3px] border-[--yellow] pl-7 py-3 my-10">
                                    <p className="text-[1.08rem] font-semibold text-[--orange] italic leading-[1.5]">
                                        &ldquo;{content.quote}&rdquo;
                                    </p>
                                </div>
                            )}

                            {/* Process */}
                            {(content.solution || content.process) && (
                                <>
                                    <h2 className="text-[1.35rem] font-bold text-[--text] mb-4 mt-11">{d.process}</h2>
                                    {content.challenge && (
                                        <p className="text-[0.97rem] leading-[1.9] text-[--text] mb-5">{content.challenge}</p>
                                    )}
                                    <div className="flex flex-col gap-[1.1rem] my-6">
                                        {(content.solution || content.process)!.map((step, index) => (
                                            <div
                                                key={index}
                                                className="flex gap-5 bg-[--cream] rounded-xl p-[1.4rem] border border-black/[0.06] hover:border-[#590F23]/20 transition-colors"
                                            >
                                                <div className="w-9 h-9 rounded-full bg-[#FF6B35] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                                                    {'step' in step && step.step
                                                        ? step.step
                                                        : String(index + 1).padStart(2, '0')}
                                                </div>
                                                <div>
                                                    <h4 className="text-[0.92rem] font-bold text-[--text] mb-1.5">
                                                        {step.title}
                                                    </h4>
                                                    <p className="text-[0.86rem] text-[--muted] leading-[1.7]">
                                                        {step.description}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}

                            {/* Results (legacy top-level column) */}
                            {project.results?.main && (
                                <>
                                    <h2 className="text-[1.35rem] font-bold text-[--text] mb-4 mt-11">{d.results}</h2>
                                    {project.results.summary && (
                                        <p className="text-[0.97rem] leading-[1.9] text-[--text] mb-5">
                                            {project.results.summary}
                                        </p>
                                    )}
                                    <div className="bg-[#111111] rounded-2xl overflow-hidden relative my-10">
                                        <div
                                            className="absolute top-[-40px] left-[-40px] w-[180px] h-[180px] rounded-full pointer-events-none"
                                            style={{ background: 'radial-gradient(circle, rgba(255,107,53,0.4) 0%, transparent 70%)', filter: 'blur(20px)' }}
                                        />
                                        <div
                                            className="absolute bottom-[-40px] right-[-40px] w-[160px] h-[160px] rounded-full pointer-events-none"
                                            style={{ background: 'radial-gradient(circle, rgba(255,107,53,0.3) 0%, transparent 70%)', filter: 'blur(20px)' }}
                                        />
                                        <div className="flex items-center gap-2 px-7 pt-7 relative z-10">
                                            <div className="w-4 h-[2px] bg-[#F5C518] flex-shrink-0" />
                                            <span className="text-[0.66rem] font-bold tracking-[0.18em] uppercase text-[--orange]">
                                                {d.finalResults}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-3 divide-x divide-white/[0.07] relative z-10">
                                            {project.results.main.map((result, i) => (
                                                <div key={i} className="text-center p-6">
                                                    <span className="text-[2.8rem] font-bold text-[#F5C518] leading-none block">
                                                        {result.value}
                                                    </span>
                                                    <div className="text-[0.73rem] text-white/50 mt-2 leading-[1.4]">
                                                        {result.label}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Learnings */}
                            {content.learnings && (
                                <>
                                    <h2 className="text-[1.35rem] font-bold text-[--text] mb-4 mt-11">{d.learnings}</h2>
                                    <p className="text-[0.97rem] leading-[1.9] text-[--text] mb-5">{content.learnings}</p>
                                </>
                            )}
                        </>
                    )}
                </article>

                {/* Sidebar */}
                <aside className="lg:sticky lg:top-[5.5rem] flex flex-col gap-5">
                    {/* Tools */}
                    {project.tools && project.tools.length > 0 && (
                        <div className="bg-white rounded-[14px] p-[1.6rem] border border-black/[0.08]">
                            <h4 className="text-[0.65rem] font-bold tracking-[0.16em] uppercase text-[--subtle] mb-5">
                                {d.tools}
                            </h4>
                            <div>
                                {project.tools.map((tool, i) => (
                                    <span
                                        key={i}
                                        className="inline-block border-[1.5px] border-black/[0.12] text-[--muted] text-[0.72rem] px-3 py-1 rounded-full font-semibold m-0.5 hover:border-[--orange] hover:text-[--orange] transition-colors cursor-default"
                                    >
                                        {tool}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Metrics */}
                    {project.metrics && Object.keys(project.metrics).length > 0 && (
                        <div className="bg-white rounded-[14px] p-[1.6rem] border border-black/[0.08]">
                            <h4 className="text-[0.65rem] font-bold tracking-[0.16em] uppercase text-[--subtle] mb-5">
                                {d.keyMetrics}
                            </h4>
                            <div>
                                {Object.entries(project.metrics as Record<string, string>).map(
                                    ([key, value], i, arr) => (
                                        <div
                                            key={i}
                                            className={`flex justify-between items-center py-2.5 text-[0.82rem] ${i < arr.length - 1 ? 'border-b border-black/[0.06]' : ''}`}
                                        >
                                            <span className="text-[--muted]">{key}</span>
                                            <span className="font-bold text-[--text]">{value}</span>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    )}

                    {/* CTA */}
                    <div className="bg-[#FF6B35] rounded-[14px] p-[1.6rem] text-center relative overflow-hidden">
                        <div
                            className="absolute top-[-30px] right-[-30px] w-[130px] h-[130px] rounded-full pointer-events-none"
                            style={{
                                background: 'radial-gradient(circle, rgba(245,197,24,0.7) 0%, transparent 70%)',
                                filter: 'blur(16px)',
                            }}
                        />
                        <div
                            className="absolute bottom-[-30px] left-[-20px] w-[100px] h-[100px] rounded-full pointer-events-none"
                            style={{
                                background: 'radial-gradient(circle, rgba(245,197,24,0.45) 0%, transparent 70%)',
                                filter: 'blur(14px)',
                            }}
                        />
                        <p className="text-[0.86rem] leading-[1.65] text-white font-medium mb-[1.1rem] relative z-10">
                            {d.ctaText}
                        </p>
                        <a
                            href="/#contact"
                            className="block bg-[#111111] text-white py-3 px-4 rounded-full text-[0.8rem] font-bold tracking-[0.04em] hover:bg-[#333] transition-colors relative z-10"
                        >
                            {d.ctaButton}
                        </a>
                    </div>
                </aside>
            </div>

            <Footer />
        </>
    );
}
