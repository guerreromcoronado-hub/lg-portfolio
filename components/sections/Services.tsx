'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { useLanguage } from '@/lib/i18n/context';

export default function Services() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });
    const { dict } = useLanguage();
    const d = dict.services;

    return (
        <section id="services" ref={ref} className="px-6 py-16 md:px-12 md:py-24 lg:px-20 lg:py-32 bg-cream">
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
                    <h2 className="text-[clamp(1.8rem,4vw,2.4rem)] font-bold text-text leading-[1.15] mt-4">
                        {d.headline1}<br />{d.headline2} <em className="italic font-light text-orange">{d.highlight}</em>
                    </h2>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {d.items.map((service, index) => (
                    <motion.div
                        key={service.num}
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                        className="bg-white p-10 rounded-2xl hover:bg-yellow-light transition-colors cursor-default border border-text/[0.06]"
                    >
                        <div className="w-8 h-8 rounded-full bg-orange text-white flex items-center justify-center text-[0.7rem] font-bold tracking-[0.12em] mb-6">
                            {service.num}
                        </div>
                        <h3 className="text-[1.05rem] font-bold text-text mb-[0.8rem] leading-[1.3]">
                            {service.title}
                        </h3>
                        <p className="text-[0.86rem] leading-[1.7] text-muted">
                            {service.description}
                        </p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}

