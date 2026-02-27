import { getPosts, localizePost } from '@/lib/api/content';
import { getServerDictionary } from '@/lib/i18n/server';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { IconPenLine } from '@/components/icons';

const getGradient = (index: number) => {
    const gradients = [
        'radial-gradient(ellipse, rgba(245,197,24,0.3) 0%, #F0EBE0 70%)',
        'radial-gradient(ellipse, rgba(245,160,32,0.25) 0%, #FAF7F0 70%)',
        'radial-gradient(ellipse, rgba(232,114,74,0.2) 0%, #F0EBE0 70%)',
    ];
    return gradients[index % gradients.length];
};

export const metadata = {
    title: 'Blog | Laura Guerrero',
    description: 'Ideas y recursos sobre email marketing, SEO y estrategia digital.',
};

export default async function BlogPage() {
    const { locale, dict } = await getServerDictionary();
    const d = dict.blogPage;
    const rawPosts = await getPosts();
    const posts = rawPosts.map((p) => localizePost(p, locale));

    return (
        <>
            <Navigation />
            <main className="bg-cream min-h-screen pt-24 pb-16 px-6 md:px-12 lg:px-20">
                {/* Header */}
                <div className="mb-14">
                    <Link href="/" className="text-[0.78rem] text-muted font-semibold hover:text-orange transition-colors">
                        {d.back}
                    </Link>
                    <div className="mt-6">
                        <span className="text-[0.68rem] font-bold tracking-[0.18em] uppercase text-yellow flex items-center gap-2">
                            <span className="block w-6 h-[2px] bg-yellow" />
                            {d.label}
                        </span>
                        <h1 className="text-[clamp(1.8rem,5vw,2.6rem)] font-bold text-text leading-[1.15] mt-4">
                            {d.heading1} <br />{d.heading2} <em className="italic font-light text-orange">{d.highlight}</em>
                        </h1>
                        <p className="text-muted mt-4 text-[0.95rem] max-w-xl">
                            {d.subtitle}
                        </p>
                    </div>
                </div>

                {/* Posts grid */}
                {posts.length === 0 ? (
                    <div className="text-center py-24 text-muted">
                        <div className="flex justify-center mb-4 opacity-30">
                            <IconPenLine size={56} strokeWidth={1.2} />
                        </div>
                        <p className="font-semibold">{d.empty}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.map((post, index) => (
                            <Link
                                key={post.id}
                                href={`/blog/${post.slug}`}
                                className="bg-white rounded-[14px] overflow-hidden border border-text/[0.07] hover:-translate-y-[5px] hover:shadow-[0_12px_36px_rgba(17,17,17,0.08)] transition-all block no-underline"
                            >
                                {/* Thumbnail */}
                                {post.cover_image ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={post.cover_image}
                                        alt={post.title}
                                        className="w-full h-[155px] object-cover"
                                    />
                                ) : (
                                    <div
                                        className="h-[155px] flex items-center justify-center"
                                        style={{ background: getGradient(index) }}
                                    >
                                        <IconPenLine size={44} className="text-orange/40" strokeWidth={1.2} />
                                    </div>
                                )}

                                <div className="p-[1.4rem]">
                                    <div className="text-[0.65rem] font-bold tracking-[0.1em] uppercase text-orange mb-2 opacity-80">
                                        {post.category}
                                    </div>
                                    <h2 className="text-[0.95rem] font-bold leading-[1.4] mb-[0.7rem] text-text">
                                        {post.title}
                                    </h2>
                                    <p className="text-[0.82rem] text-muted leading-[1.6] mb-4">
                                        {post.excerpt}
                                    </p>
                                    <div className="flex items-center gap-3 text-[0.72rem] text-subtle">
                                        <span>⏱ {post.read_time}</span>
                                        {post.published_at && (
                                            <span>
                                                {new Date(post.published_at).toLocaleDateString(
                                                    locale === 'en' ? 'en-US' : 'es-ES',
                                                    { day: 'numeric', month: 'long', year: 'numeric' }
                                                )}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </>
    );
}

