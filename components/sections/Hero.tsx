'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/context';

export default function Hero() {
    const { dict } = useLanguage();
    const d = dict.hero;

    return (
        <section className="md:min-h-screen grid grid-cols-1 md:grid-cols-2 pt-[4.5rem] relative overflow-hidden bg-cream">
            {/* Ambient gradient background */}
            <div
                className="absolute inset-0 z-0 pointer-events-none"
                style={{
                    background: `
            radial-gradient(ellipse 55% 70% at 72% 45%, rgba(245,197,24,0.35) 0%, transparent 65%),
            radial-gradient(ellipse 40% 55% at 85% 20%, rgba(245,160,32,0.25) 0%, transparent 60%),
            radial-gradient(ellipse 50% 60% at 20% 75%, rgba(232,114,74,0.18) 0%, transparent 60%)
          `
                }}
            />

            {/* Left content */}
            <div className="flex flex-col justify-center px-6 py-14 md:px-12 md:py-20 md:pl-20 relative z-10">
                <motion.span
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-[0.4rem] text-[0.75rem] font-semibold text-orange tracking-[0.06em] mb-8"
                >
                    {d.badge}
                </motion.span>

                <motion.h1
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-[clamp(2rem,6vw,3.8rem)] font-bold leading-[1.08] text-orange mb-[1.6rem]"
                >
                    {d.headline1}<br />{d.headline2.split(' ').slice(0, -1).join(' ')} <em className="italic font-light">{d.headline2.split(' ').slice(-1)[0]}</em>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-base leading-[1.75] text-muted max-w-[400px] mb-[2.8rem] font-normal"
                >
                    {d.subtitle}
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex gap-4"
                >
                    <Link
                        href="#portfolio"
                        className="bg-yellow text-text px-8 py-[0.9rem] rounded-full no-underline text-[0.88rem] font-bold tracking-[0.03em] hover:bg-[#e0b510] hover:-translate-y-[2px] transition-all"
                    >
                        {d.ctaWork}
                    </Link>
                    <Link
                        href="#blog"
                        className="bg-transparent text-orange px-8 py-[0.9rem] rounded-full border-[1.5px] border-orange/30 no-underline text-[0.88rem] font-semibold hover:border-orange hover:bg-orange/[0.04] transition-all"
                    >
                        {d.ctaBlog}
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="flex gap-[0.6rem] mt-[2.8rem] flex-wrap"
                >
                    {['[SEO]', '[Email Marketing]', '[E-commerce Growth]'].map((tag) => (
                        <span
                            key={tag}
                            className="text-[0.75rem] font-semibold text-muted px-[0.9rem] py-[0.3rem] rounded-full border border-muted/25 tracking-[0.04em] hover:border-orange hover:text-orange transition-all cursor-default"
                        >
                            {tag}
                        </span>
                    ))}
                </motion.div>
            </div>

            {/* Right content - Photo */}
            <div className="relative z-10 flex items-center justify-center py-8 md:py-0">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="relative w-[220px] h-[220px] md:w-[320px] md:h-[320px] rounded-full overflow-hidden shadow-2xl"
                >
                    <Image
                        src="/LG.png"
                        alt="Laura Guerrero"
                        fill
                        className="object-cover object-center"

                        priority
                    />
                </motion.div>

                {/* Decorative dots */}
                <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.6 }}
                    className="absolute bottom-[22%] right-[18%] w-[14px] h-[14px] rounded-full bg-yellow"
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 0.5, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.7 }}
                    className="absolute top-[28%] right-[32%] w-[8px] h-[8px] rounded-full bg-yellow"
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 0.3, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.8 }}
                    className="absolute bottom-[35%] right-[40%] w-[6px] h-[6px] rounded-full bg-yellow"
                />
            </div>

            {/* Scroll hint */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1 }}
                className="hidden md:flex absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex-col items-center gap-2 text-[0.65rem] font-semibold tracking-[0.12em] uppercase text-subtle"
            >
                <div className="w-[1px] h-[36px] bg-subtle animate-scrollPulse" />
                scroll
            </motion.div>
        </section>
    );
}
