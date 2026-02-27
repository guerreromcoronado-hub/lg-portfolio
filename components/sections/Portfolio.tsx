'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import Link from 'next/link';
import type { Project } from '@/lib/types/database';
import { useLanguage } from '@/lib/i18n/context';
import { IconTrendingUp } from '@/components/icons';

type PortfolioProps = {
    projects: Project[];
};

const getGradient = (index: number) => {
    const gradients = [
        'radial-gradient(ellipse at 35% 55%, rgba(245,197,24,0.4) 0%, transparent 55%), radial-gradient(ellipse at 75% 25%, rgba(245,160,32,0.3) 0%, transparent 50%), #F0EBE0',
        'radial-gradient(ellipse at 60% 50%, rgba(245,160,32,0.3) 0%, transparent 55%), radial-gradient(ellipse at 20% 30%, rgba(245,197,24,0.2) 0%, transparent 45%), #FAF7F0',
    ];
    return gradients[index % gradients.length];
};

export default function Portfolio({ projects }: PortfolioProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });
    const [hoveredProject, setHoveredProject] = useState<string | null>(null);
    const { dict } = useLanguage();
    const d = dict.portfolio;

    return (
        <section id="portfolio" ref={ref} className="px-6 py-16 md:px-12 md:py-24 lg:px-20 lg:py-32 bg-white">
            <div className="flex justify-between items-end mb-16">
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
                        href="/proyectos"
                        className="text-[0.82rem] text-muted no-underline font-semibold hover:text-orange transition-colors"
                    >
                        {d.viewAll}
                    </Link>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((project, index) => (
                    <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                        onHoverStart={() => setHoveredProject(project.id)}
                        onHoverEnd={() => setHoveredProject(null)}
                    >
                        <Link
                            href={`/proyectos/${project.slug}`}
                            className="block rounded-2xl overflow-hidden relative cursor-pointer border border-text/[0.07] group"
                        >
                            {project.cover_image ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={project.cover_image}
                                    alt={project.title}
                                    className="w-full h-[300px] object-cover"
                                />
                            ) : (
                                <div
                                    className="h-[300px] flex items-center justify-center"
                                    style={{ background: getGradient(index) }}
                                >
                                    <IconTrendingUp size={56} className="text-orange/35" strokeWidth={1.2} />
                                </div>
                            )}
                            <motion.div
                                className="absolute bottom-0 left-0 right-0 px-8 py-8 text-white"
                                style={{
                                    background: 'linear-gradient(transparent, rgba(17,17,17,0.85))'
                                }}
                            >
                                <div className="text-[0.68rem] font-bold tracking-[0.1em] text-yellow mb-[0.4rem] uppercase">
                                    {project.category}
                                </div>
                                <div className="text-[1.1rem] font-bold leading-[1.3]">
                                    {project.title}
                                </div>
                                <motion.div
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: hoveredProject === project.id ? 1 : 0, y: hoveredProject === project.id ? 0 : 6 }}
                                    transition={{ duration: 0.2 }}
                                    className="text-[0.78rem] font-semibold text-white/70 mt-2"
                                >
                                    {d.viewProject}
                                </motion.div>
                            </motion.div>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}

