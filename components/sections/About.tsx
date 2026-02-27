'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';
import { useLanguage } from '@/lib/i18n/context';

export default function About() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });
    const { dict } = useLanguage();
    const d = dict.about;

    return (
        <section id="about" ref={ref} className="px-6 py-16 md:px-12 md:py-24 lg:px-20 lg:py-32 bg-white grid grid-cols-1 lg:grid-cols-[1fr_1.8fr] gap-10 lg:gap-24 items-start">
            <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6 }}
            >
                <span className="text-[0.68rem] font-bold tracking-[0.18em] uppercase text-yellow flex items-center gap-2">
                    <span className="block w-6 h-[2px] bg-yellow" />
                    {d.label}
                </span>

                <div className="relative mt-8 w-full max-w-xs lg:max-w-none aspect-[3/4] rounded-2xl overflow-hidden shadow-xl">
                    <Image
                        src="/LG.png"
                        alt="Laura Guerrero"
                        fill
                        className="object-cover object-top"
                    />
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                <h2 className="text-[clamp(1.7rem,4vw,2.1rem)] font-bold text-text leading-[1.2] mt-4 mb-6">
                    {d.headline1} <strong className="text-orange">{d.headline2}</strong>
                </h2>
                <p className="text-[0.97rem] leading-[1.85] text-muted mb-4 max-w-[540px]">
                    {d.p1}
                </p>
                <p className="text-[0.97rem] leading-[1.85] text-muted mb-4 max-w-[540px]">
                    {d.p2}
                </p>

                <div className="flex gap-12 mt-10 pt-10 border-t border-text/[0.07]">
                    {d.stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                        >
                            <div className="text-[2.2rem] font-bold text-orange leading-none">
                                {stat.num}
                            </div>
                            <div className="text-[0.72rem] text-subtle mt-[0.3rem] font-medium tracking-[0.04em]">
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}

