"use client";

import DisplayCards from "@/components/ui/display-cards";
import { useLanguage } from "@/lib/i18n/context";
import { motion, useInView } from "framer-motion";
import { Sparkles } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";

function WorkedWith() {
    const ref = useRef<HTMLElement | null>(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const { dict } = useLanguage();
    const d = dict.workedWith;

    const cards = [
        {
            logo: (
                <Image
                    src="/high_point_sales_marketing_llc_logo.jpeg"
                    alt="High Point Sales & Marketing"
                    width={300}
                    height={110}
                    className="h-16 w-auto object-contain"
                />
            ),
            icon: <Sparkles className="size-4 text-blue-300" />,
            title: "High Point",
            description: "Sales & Marketing LLC",
            date: d.clientTag,
            iconClassName: "text-blue-500",
            titleClassName: "text-zinc-800",
            className:
                "[grid-area:stack] z-10 -translate-x-[5.5rem] -translate-y-[1.5rem] hover:-translate-y-[6.5rem] before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-white/35 grayscale-[45%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
        },
        {
            logo: (
                <Image
                    src="/outland%20living.webp"
                    alt="Outland Living"
                    width={320}
                    height={110}
                    className="h-16 w-auto object-contain"
                />
            ),
            icon: <Sparkles className="size-4 text-blue-300" />,
            title: "Outland Living",
            description: d.partnerTag,
            date: d.clientTag,
            iconClassName: "text-blue-500",
            titleClassName: "text-zinc-800",
            className:
                "[grid-area:stack] z-20 -translate-x-[1.5rem] translate-y-[0.75rem] hover:-translate-y-[4.5rem] before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-white/35 grayscale-[30%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
        },
        {
            logo: (
                <Image
                    src="/QLO-oficial.png"
                    alt="Quiroga Law Office"
                    width={300}
                    height={110}
                    className="h-16 w-auto object-contain"
                />
            ),
            icon: <Sparkles className="size-4 text-blue-300" />,
            title: "Quiroga",
            description: "Law Office PLLC",
            date: d.clientTag,
            iconClassName: "text-blue-500",
            titleClassName: "text-zinc-800",
            className:
                "[grid-area:stack] z-30 translate-x-[2.5rem] translate-y-[2.75rem] hover:-translate-y-[2.75rem]",
        },
        {
            logo: (
                <Image
                    src="/vaulted.webp"
                    alt="Vaulted"
                    width={300}
                    height={110}
                    className="h-16 w-auto object-contain"
                />
            ),
            icon: <Sparkles className="size-4 text-blue-300" />,
            title: "Vaulted",
            description: d.partnerTag,
            date: d.clientTag,
            iconClassName: "text-blue-500",
            titleClassName: "text-zinc-800",
            className:
                "[grid-area:stack] z-40 translate-x-[6.5rem] translate-y-[4.75rem] hover:-translate-y-[1.5rem]",
        },
    ];

    return (
        <section
            id="clients"
            ref={ref}
            className="relative overflow-hidden px-4 py-11 sm:px-6 sm:py-13 md:px-12 md:py-18 lg:px-20 lg:py-22 bg-white"
        >
            <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                <div className="absolute -left-24 top-8 h-44 w-44 rounded-full bg-yellow/10 blur-3xl sm:-left-28 sm:top-10 sm:h-56 sm:w-56" />
                <div className="absolute right-[-8rem] top-14 h-56 w-56 rounded-full bg-orange/10 blur-3xl sm:right-[-7rem] sm:top-16 sm:h-72 sm:w-72" />
                <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(248,246,241,0.55)_0%,rgba(255,255,255,0)_45%,rgba(248,246,241,0.65)_100%)]" />
            </div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[minmax(280px,1fr)_minmax(0,1.35fr)] gap-8 sm:gap-9 lg:gap-12 items-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                >
                    <span className="text-[0.68rem] font-bold tracking-[0.18em] uppercase text-yellow flex items-center gap-2">
                        <span className="block w-6 h-[2px] bg-yellow" />
                        {d.label}
                    </span>
                    <h2 className="text-[clamp(1.55rem,8vw,2.3rem)] font-bold text-text leading-[1.13] mt-3 sm:mt-4">
                        {d.heading1}<br />
                        {d.heading2}
                    </h2>
                    <p className="mt-4 max-w-[56ch] text-[0.93rem] leading-[1.72] text-muted sm:mt-5 sm:text-[0.96rem] sm:leading-[1.8]">
                        {d.subtitle}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-1.5 sm:mt-7 sm:gap-2">
                        {d.chips.map((chip, index) => (
                            <motion.span
                                key={chip}
                                initial={{ opacity: 0, y: 10 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.35, delay: 0.08 + index * 0.08 }}
                                className="rounded-full border border-text/10 bg-white/85 px-3 py-1.5 text-[0.66rem] font-semibold tracking-[0.07em] uppercase text-subtle sm:px-3.5 sm:text-[0.7rem]"
                            >
                                {chip}
                            </motion.span>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 35, scale: 0.98 }}
                    animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                    transition={{ duration: 0.65, delay: 0.12 }}
                    className="relative rounded-2xl border border-text/[0.08] bg-white/80 px-2 py-5 shadow-[0_14px_50px_-25px_rgba(22,22,22,0.35)] backdrop-blur-sm sm:rounded-3xl sm:px-3 sm:py-7 md:px-4 lg:px-6"
                >
                    <div className="pointer-events-none absolute -top-3 left-8 right-8 h-px bg-gradient-to-r from-transparent via-yellow/60 to-transparent" />
                    <div className="w-full max-w-3xl mx-auto">
                        <div className="relative h-[255px] sm:h-[315px] md:h-auto">
                            <div className="absolute left-1/2 top-0 -translate-x-1/2 origin-top scale-[0.62] sm:scale-[0.78] md:static md:left-auto md:top-auto md:translate-x-0 md:scale-100">
                                <DisplayCards cards={cards} />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

export { WorkedWith };
export default WorkedWith;
