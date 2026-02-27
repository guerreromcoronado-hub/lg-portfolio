import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                white: '#FFFFFF',
                cream: '#FAF7F0',
                beige: '#F0EBE0',
                text: '#111111',
                muted: '#6B6560',
                subtle: '#9B9490',
                orange: '#FF6B35',
                yellow: '#F5C518',
                'yellow-light': '#FDF8DC',
            },
            fontFamily: {
                sans: ['var(--font-montserrat)', 'system-ui', 'sans-serif'],
            },
            keyframes: {
                fadeUp: {
                    from: { opacity: '0', transform: 'translateY(16px)' },
                    to: { opacity: '1', transform: 'translateY(0)' },
                },
                scrollPulse: {
                    '0%': { transform: 'scaleY(0)', transformOrigin: 'top' },
                    '50%': { transform: 'scaleY(1)', transformOrigin: 'top' },
                    '51%': { transform: 'scaleY(1)', transformOrigin: 'bottom' },
                    '100%': { transform: 'scaleY(0)', transformOrigin: 'bottom' },
                },
            },
            animation: {
                fadeUp: 'fadeUp 0.5s ease both',
                scrollPulse: 'scrollPulse 1.6s ease infinite',
            },
        },
    },
    plugins: [],
};

export default config;
