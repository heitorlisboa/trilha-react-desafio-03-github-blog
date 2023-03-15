/* eslint-disable @typescript-eslint/no-var-requires */
const defaultTheme = require('tailwindcss/defaultTheme');
const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    colors: {
      black: '#040f1a',
      'brand-blue': '#3294f8',
      slate: {
        50: '#e7edf4',
        200: '#c4d4e3',
        300: '#afc2d4',
        400: '#7b96b2',
        600: '#3a536b',
        800: '#1c2f41',
        850: '#112131',
        900: '#0b1b2b',
        950: '#071422',
      },
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-nunito)', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [
    plugin(function ({ addComponents }) {
      addComponents({
        '.link-border': {
          position: 'relative',
          '&:hover::after': {
            backgroundSize: '100%',
          },
          '&::after': {
            position: 'absolute',
            top: '100%',
            left: '0px',
            right: '0px',
            height: '1px',
            backgroundImage:
              'linear-gradient(to right, currentColor, currentColor)',
            backgroundSize: '0',
            backgroundPosition: '0 100%',
            backgroundRepeat: 'no-repeat',
            transitionProperty: 'background-size',
            transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
            transitionDuration: '150ms',
            content: "''",
          },
        },
      });
    }),
  ],
};

module.exports = config;
