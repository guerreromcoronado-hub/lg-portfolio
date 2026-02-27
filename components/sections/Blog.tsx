'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import type { Post } from '@/lib/types/database';
import { useLanguage } from '@/lib/i18n/context';
import { IconPenLine, IconClock, IconCalendar } from '@/components/icons';

type BlogProps = {
    posts: Post[];
};

const getGradient = (index: number) => {
    const gradients = [
        'radial-gradient(ellipse, rgba(245,197,24,0.3) 0%, #F0EBE0 70%)',
        'radial-gradient(ellipse, rgba(245,160,32,0.25) 0%, #FAF7F0 70%)',
        'radial-gradient(ellipse, rgba(232,114,74,0.2) 0%, #F0EBE0 70%)',
    ];
    return gradients[index % gradients.length];
};

export default function Blog({ posts }: BlogProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });
    const { dict, locale } = useLanguage();
    const d = dict.blog;

    return (
        <section id="blog" ref={ref} className="px-6 py-16 md:px-12 md:py-24 lg:px-20 lg:py-32 bg-cream">
            <div className="flex justify-between items-end mb-12">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                >
                    <span className="text-[0.68rem] font-bold tracking-[0.18em] uppercase text-yellow flex items-center gap-2">
                        <span className="block w-6 h-[2px] bg-yellow" />
                        {d.label}
                    </span>
                    <h2 className="text-[clamp(1.7rem,4vw,2.2rem)] font-bold text-text mt-4">
                        {d.heading}
                    </h2>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.6 }}
                >
                    <Link
                        href="/blog"
                        className="text-[0.82rem] text-muted no-underline font-semibold hover:text-orange transition-colors"
                    >
                        {d.viewAll}
                    </Link>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
                {posts.map((post, index) => (
                    <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                    >
                        <Link
                            href={`/blog/${post.slug}`}
                            className="bg-white rounded-[14px] overflow-hidden border border-text/[0.07] hover:-translate-y-[5px] hover:shadow-[0_12px_36px_rgba(17,17,17,0.08)] transition-all block no-underline"
                        >
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
                                <h3 className="text-[0.95rem] font-bold leading-[1.4] mb-[0.7rem] text-text">
                                    {post.title}
                                </h3>
                                <p className="text-[0.82rem] text-muted leading-[1.6] mb-4">
                                    {post.excerpt}
                                </p>
                                <div className="flex items-center gap-3 pt-3 border-t border-text/[0.06] text-[0.7rem] text-subtle font-medium">
                                    {post.read_time && (
                                        <span className="flex items-center gap-1">
                                            <IconClock size={11} strokeWidth={2} />
                                            {post.read_time}
                                        </span>
                                    )}
                                    {post.read_time && post.published_at && (
                                        <span className="opacity-30">·</span>
                                    )}
                                    {post.published_at && (
                                        <span className="flex items-center gap-1">
                                            <IconCalendar size={11} strokeWidth={2} />
                                            {new Date(post.published_at).toLocaleDateString(
                                                locale === 'en' ? 'en-US' : 'es-ES',
                                                { day: 'numeric', month: 'short', year: 'numeric' }
                                            )}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}

