import { theme } from '@chakra-ui/core';

const hsl = (hue: number, saturation: number, lighten: number): string => {
    return `hsla(${hue}, ${saturation}%, ${lighten}%)`;
};

// hsl(240, 21, 21)
// hsl(240, 15, 51)
// hsl(166, 52, 48)

const breakpoints: any = ['360px', '768px', '1024px', '1440px'];
breakpoints.sm = breakpoints[0];
breakpoints.md = breakpoints[1];
breakpoints.lg = breakpoints[2];
breakpoints.xl = breakpoints[3];

export default {
    ...theme,
    ...breakpoints,
    fonts: {
        heading: 'Gordita, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol',
        body:
            'Avenir Next, apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol',
        mono: 'Menlo, monospace',
    },
    fontSizes: {
        xs: '0.75rem',
        sm: '0.875rem',
        md: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '4rem',
    },
};
