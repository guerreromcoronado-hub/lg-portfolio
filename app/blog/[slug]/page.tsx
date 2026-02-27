import { notFound } from 'next/navigation';
import BlogNavigation from '@/components/BlogNavigation';
import ProgressBar from '@/components/ProgressBar';
import Footer from '@/components/Footer';
import { getPostBySlug, localizePost } from '@/lib/api/content';
import { getServerDictionary } from '@/lib/i18n/server';
import { IconUser, IconPenLine } from '@/components/icons';

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const { locale, dict } = await getServerDictionary();
    const d = dict.blogArticle;
    const rawPost = await getPostBySlug(slug);

    if (!rawPost || !rawPost.published) {
        notFound();
    }

    const post = localizePost(rawPost, locale);
    const content = post.content as {
        intro?: string;
        sections?: Array<{
            type: string;
            content?: string;
            title?: string;
            items?: Array<{
                number: string;
                title: string;
                description: string;
                fix: string;
            }>;
        }>;
    };

    return (
        <>
            <ProgressBar />
            <BlogNavigation />

            {/* Hero */}
            <section className="pt-28 pb-10 px-6 md:px-16 lg:px-20 text-center relative">
                {/* Ambient Background */}
                <div className="fixed inset-0 -z-10 pointer-events-none">
                    <div className="absolute inset-0 bg-[--cream]" />
                    <div className="absolute top-0 left-0 right-0 h-screen bg-[radial-gradient(ellipse_60%_50%_at_70%_30%,rgba(245,197,24,0.12)_0%,transparent_65%),radial-gradient(ellipse_40%_40%_at_20%_70%,rgba(245,160,32,0.08)_0%,transparent_60%)]" />
                </div>

                <div className="max-w-3xl mx-auto relative">
                    <div className="inline-block border-2 border-[#590F23]/30 text-[--orange] text-xs px-4 py-1.5 rounded-full font-bold tracking-wider mb-8">
                        [{post.category}]
                    </div>
                    <h1 className="text-[clamp(2rem,6vw,3.8rem)] font-bold text-[--text] leading-[1.12] mb-6">
                        {post.title}
                    </h1>
                    <p className="text-base leading-relaxed text-[--muted] max-w-xl mx-auto mb-10">
                        {post.excerpt}
                    </p>
                    <div className="flex items-center justify-center gap-4 text-xs text-[--subtle] font-medium">
                        <div className="flex items-center gap-2">
                            <div className="w-9 h-9 rounded-full bg-[--beige] border-2 border-[#590F23]/15 flex items-center justify-center text-[--muted]">
                                <IconUser size={16} strokeWidth={1.6} />
                            </div>
                            <span>Laura Guerrero</span>
                        </div>
                        <span className="opacity-35">·</span>
                        <span>{post.read_time} {d.readTime}</span>
                        <span className="opacity-35">·</span>
                        <span>{new Date(post.published_at || post.created_at).toLocaleDateString(locale === 'en' ? 'en-US' : 'es-ES', { year: 'numeric', month: 'long' })}</span>
                    </div>
                </div>
            </section>

            {/* Cover Image */}
            <section className="mx-4 md:mx-12 lg:mx-20 mb-10">
                <div className="h-[340px] rounded-2xl overflow-hidden relative">
                    {post.cover_image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={post.cover_image}
                            alt={post.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[radial-gradient(ellipse_at_30%_55%,rgba(245,197,24,0.4)_0%,transparent_55%),radial-gradient(ellipse_at_75%_25%,rgba(245,160,32,0.3)_0%,transparent_50%),radial-gradient(ellipse_at_80%_80%,rgba(232,114,74,0.2)_0%,transparent_45%),var(--beige)]">
                            <IconPenLine size={72} className="text-orange/30" strokeWidth={1} />
                        </div>
                    )}
                </div>
            </section>

            {/* Content */}
            <section className="py-12 md:py-16 bg-white">
                <div className="px-4 md:px-12 lg:px-20">
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_255px] gap-8 lg:gap-20">
                        {/* Main Content */}
                        <div className="space-y-8">
                            {/* Intro */}
                            {content.intro && typeof content.intro === 'string' && (
                                <p className="text-[0.97rem] leading-[1.9] text-[--text] mb-5">
                                    {content.intro}
                                </p>
                            )}

                            {/* Sections */}
                            {content.sections && content.sections.map((section, sectionIndex) => (
                                <div key={sectionIndex}>
                                    {/* Heading */}
                                    {section.type === 'heading' && typeof section.content === 'string' && (
                                        <h2 className="text-[1.35rem] font-bold text-[--text] mt-11 mb-4 first:mt-0">
                                            {section.content}
                                        </h2>
                                    )}

                                    {/* Quote */}
                                    {section.type === 'quote' && typeof section.content === 'string' && (
                                        <div className="border-l-[3px] border-[--yellow] pl-7 py-3 my-10">
                                            <p className="text-[1.08rem] font-semibold text-[--orange] italic leading-[1.5] mb-0">
                                                {section.content}
                                            </p>
                                        </div>
                                    )}

                                    {/* Paragraph */}
                                    {section.type === 'paragraph' && typeof section.content === 'string' && (
                                        <p className="text-[0.97rem] leading-[1.9] text-[--text] mb-5">
                                            {section.content}
                                        </p>
                                    )}

                                    {/* List */}
                                    {section.type === 'list' && section.items && (
                                        <ul className="my-6 flex flex-col gap-2">
                                            {(section.items as unknown as string[]).map((item, index) => (
                                                <li key={index} className="flex items-start gap-3 text-[0.97rem] text-[--text] leading-[1.8]">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-[--orange] flex-shrink-0 mt-[0.65rem]" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    )}

                                    {/* Highlight */}
                                    {section.type === 'highlight' && typeof section.content === 'string' && (
                                        <div className="bg-[--cream] border-l-[3px] border-[--orange] rounded-r-xl p-6 my-10">
                                            <h4 className="text-[0.7rem] font-bold tracking-[0.14em] uppercase text-[--orange] mb-3">
                                                ↗ {section.title}
                                            </h4>
                                            <p className="text-[0.92rem] text-[--text] leading-[1.8] font-medium">
                                                {section.content}
                                            </p>
                                        </div>
                                    )}

                                    {/* Error List */}
                                    {section.type === 'error-list' && section.items && (
                                        <div className="flex flex-col gap-[1.1rem] my-6">
                                            {(section.items as Array<{ number: string; title: string; description: string; fix: string }>).map((item, index) => (
                                                <div
                                                    key={index}
                                                    className="flex gap-5 bg-[--cream] rounded-xl p-[1.4rem] border border-black/[0.06] hover:border-[#590F23]/20 transition-colors"
                                                >
                                                    <div className="w-9 h-9 rounded-full bg-[#FF6B35] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                                                        {item.number}
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="text-[0.92rem] font-bold text-[--text] mb-1.5">
                                                            {item.title}
                                                        </h3>
                                                        <p className="text-[0.86rem] text-[--muted] leading-[1.7] mb-3">
                                                            {item.description}
                                                        </p>
                                                        <div className="bg-[--yellow-light] border-l-[3px] border-[--yellow] rounded-r-lg p-3">
                                                            <p className="text-[0.82rem] text-[--text] font-semibold leading-[1.6]">
                                                                ✓ {item.fix}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Sidebar */}
                        <div>
                            <div className="sticky top-[5.5rem] space-y-5">
                                {/* TOC — dynamic: picks up headings + error-list items */}
                                {(() => {
                                    if (!content.sections) return null;

                                    const tocItems: { num?: string; label: string }[] = [];

                                    content.sections.forEach(s => {
                                        if (s.type === 'heading' && typeof s.content === 'string') {
                                            tocItems.push({ label: s.content });
                                        } else if (s.type === 'error-list' && s.items) {
                                            (s.items as Array<{ number: string; title: string }>).forEach(item => {
                                                if (item.title) tocItems.push({ num: item.number, label: item.title });
                                            });
                                        }
                                    });

                                    if (tocItems.length === 0) return null;

                                    return (
                                        <div className="bg-white rounded-[14px] p-[1.6rem] border-[1.5px] border-[--yellow]">
                                            <h4 className="text-[0.65rem] font-bold tracking-[0.16em] uppercase text-[--subtle] mb-5">
                                                {d.toc}
                                            </h4>
                                            <ul className="divide-y divide-black/[0.05]">
                                                {tocItems.map((item, index) => (
                                                    <li key={index} className="flex items-start gap-3 py-2.5">
                                                        {item.num && (
                                                            <span className="text-[0.68rem] font-bold text-[--subtle] min-w-[1.8rem] pt-px">
                                                                {item.num}
                                                            </span>
                                                        )}
                                                        <span className="text-[0.82rem] text-[--muted] leading-snug hover:text-[--orange] transition-colors cursor-pointer">
                                                            {item.label}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    );
                                })()}

                                {/* CTA */}
                                <div className="bg-[#590F23] rounded-[14px] p-[1.8rem] relative overflow-hidden">
                                    <div
                                        className="absolute top-[-30px] right-[-30px] w-[130px] h-[130px] rounded-full pointer-events-none"
                                        style={{ background: 'radial-gradient(circle, rgba(245,197,24,0.5) 0%, transparent 70%)', filter: 'blur(20px)' }}
                                    />
                                    <div
                                        className="absolute bottom-[-30px] left-[-20px] w-[110px] h-[110px] rounded-full pointer-events-none"
                                        style={{ background: 'radial-gradient(circle, rgba(245,197,24,0.3) 0%, transparent 70%)', filter: 'blur(16px)' }}
                                    />
                                    <p className="text-[0.63rem] font-bold tracking-[0.18em] uppercase text-white/60 mb-3 relative z-10">
                                        {d.ctaTitle}
                                    </p>
                                    <p className="text-[0.86rem] leading-[1.7] text-white/90 font-medium mb-5 relative z-10">
                                        {d.ctaText}
                                    </p>
                                    <a
                                        href="/#contact"
                                        className="block bg-[--yellow] text-[--text] py-3 px-4 rounded-full text-[0.82rem] font-bold tracking-[0.04em] text-center hover:bg-[#e0b510] transition-colors relative z-10"
                                    >
                                        {d.ctaButton}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}
