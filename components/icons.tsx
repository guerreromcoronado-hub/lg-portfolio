import { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

const base = (size = 18) => ({
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
});

export function IconChart({ size, ...p }: IconProps) {
    return (
        <svg {...base(size)} {...p}>
            <rect x="3" y="12" width="4" height="9" rx="1" />
            <rect x="10" y="7" width="4" height="14" rx="1" />
            <rect x="17" y="3" width="4" height="18" rx="1" />
        </svg>
    );
}

export function IconFileText({ size, ...p }: IconProps) {
    return (
        <svg {...base(size)} {...p}>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
        </svg>
    );
}

export function IconBriefcase({ size, ...p }: IconProps) {
    return (
        <svg {...base(size)} {...p}>
            <rect x="2" y="7" width="20" height="14" rx="2" />
            <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
            <line x1="12" y1="12" x2="12" y2="12" strokeWidth="2.5" />
            <path d="M2 12h20" />
        </svg>
    );
}

export function IconCheckCircle({ size, ...p }: IconProps) {
    return (
        <svg {...base(size)} {...p}>
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
    );
}

export function IconStar({ size, filled = false, ...p }: IconProps & { filled?: boolean }) {
    return (
        <svg {...base(size)} fill={filled ? 'currentColor' : 'none'} {...p}>
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
    );
}

export function IconEye({ size, ...p }: IconProps) {
    return (
        <svg {...base(size)} {...p}>
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    );
}

export function IconEyeOff({ size, ...p }: IconProps) {
    return (
        <svg {...base(size)} {...p}>
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
            <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
    );
}

export function IconClock({ size, ...p }: IconProps) {
    return (
        <svg {...base(size)} {...p}>
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    );
}

export function IconCalendar({ size, ...p }: IconProps) {
    return (
        <svg {...base(size)} {...p}>
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
    );
}

export function IconEdit({ size, ...p }: IconProps) {
    return (
        <svg {...base(size)} {...p}>
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
    );
}

export function IconTrash({ size, ...p }: IconProps) {
    return (
        <svg {...base(size)} {...p}>
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
        </svg>
    );
}

export function IconPlay({ size, ...p }: IconProps) {
    return (
        <svg {...base(size)} {...p}>
            <circle cx="12" cy="12" r="10" />
            <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none" />
        </svg>
    );
}

export function IconPause({ size, ...p }: IconProps) {
    return (
        <svg {...base(size)} {...p}>
            <circle cx="12" cy="12" r="10" />
            <line x1="10" y1="15" x2="10" y2="9" strokeWidth="2" />
            <line x1="14" y1="15" x2="14" y2="9" strokeWidth="2" />
        </svg>
    );
}

export function IconUser({ size, ...p }: IconProps) {
    return (
        <svg {...base(size)} {...p}>
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    );
}

export function IconMail({ size, ...p }: IconProps) {
    return (
        <svg {...base(size)} {...p}>
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <polyline points="2,7 12,13 22,7" />
        </svg>
    );
}

export function IconLinkedIn({ size, ...p }: IconProps) {
    return (
        <svg {...base(size)} {...p}>
            <rect x="2" y="2" width="20" height="20" rx="4" />
            <line x1="8" y1="11" x2="8" y2="17" />
            <line x1="8" y1="7" x2="8" y2="8" />
            <path d="M12 17v-5" />
            <path d="M16 17v-3a2 2 0 0 0-4 0" />
        </svg>
    );
}

export function IconMessageCircle({ size, ...p }: IconProps) {
    return (
        <svg {...base(size)} {...p}>
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
    );
}

export function IconSearch({ size, ...p }: IconProps) {
    return (
        <svg {...base(size)} {...p}>
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
    );
}

export function IconShoppingBag({ size, ...p }: IconProps) {
    return (
        <svg {...base(size)} {...p}>
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
    );
}

export function IconTrendingUp({ size, ...p }: IconProps) {
    return (
        <svg {...base(size)} {...p}>
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
            <polyline points="17 6 23 6 23 12" />
        </svg>
    );
}

export function IconPenLine({ size, ...p }: IconProps) {
    return (
        <svg {...base(size)} {...p}>
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
    );
}
