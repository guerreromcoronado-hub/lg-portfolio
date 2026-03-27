'use client';

import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';
import { ReactNode } from 'react';

interface DisplayCardProps {
    className?: string;
    logo?: ReactNode;
    icon?: ReactNode;
    title?: string;
    description?: string;
    date?: string;
    iconClassName?: string;
    titleClassName?: string;
}

function DisplayCard({
    className,
    logo,
    icon = <Sparkles className="size-4 text-blue-300" />,
    title = 'Featured',
    description = 'Discover amazing content',
    date = 'Just now',
    iconClassName = 'text-blue-500',
    titleClassName = 'text-blue-500',
}: DisplayCardProps) {
    return (
        <div
            className={cn(
                "relative flex h-40 w-[24rem] -skew-y-[8deg] select-none flex-col rounded-xl border-2 border-zinc-300/90 bg-white/40 px-5 py-4 text-zinc-900 shadow-[0_18px_38px_rgba(17,17,17,0.16)] backdrop-blur-xl supports-[backdrop-filter]:bg-white/36 transition-all duration-700 after:absolute after:-right-1 after:top-[-5%] after:h-[110%] after:w-[20rem] after:bg-gradient-to-l after:from-white/30 after:to-transparent after:content-[''] hover:border-zinc-400 hover:bg-white/46",
                className
            )}
        >
            <div className="relative z-10 flex h-full flex-col justify-between">
                <div className="flex items-start justify-between gap-3">
                    <p className={cn('text-[1.85rem] leading-none font-semibold tracking-tight', titleClassName)}>
                        {title}
                    </p>

                    {logo ? (
                        <span className="inline-flex h-16 w-44 shrink-0 items-center justify-end">{logo}</span>
                    ) : (
                        <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-800 text-white">
                            {icon}
                        </span>
                    )}
                </div>

                <div className="space-y-0.5">
                    <p className="truncate text-[1.55rem] leading-none text-zinc-800/95">{description}</p>
                    <p className="text-[1.25rem] leading-none text-zinc-700">{date}</p>
                </div>
            </div>
        </div>
    );
}

interface DisplayCardsProps {
    cards?: DisplayCardProps[];
}

export default function DisplayCards({ cards }: DisplayCardsProps) {
    const defaultCards = [
        {
            className:
                "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
        },
        {
            className:
                "[grid-area:stack] translate-x-16 translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
        },
        {
            className: '[grid-area:stack] translate-x-32 translate-y-20 hover:translate-y-10',
        },
    ];

    const displayCards = cards || defaultCards;

    return (
        <div className="relative grid [grid-template-areas:'stack'] place-items-center min-h-[360px] opacity-100 animate-in fade-in-0 duration-700">
            {displayCards.map((cardProps, index) => (
                <DisplayCard key={index} {...cardProps} />
            ))}
        </div>
    );
}
