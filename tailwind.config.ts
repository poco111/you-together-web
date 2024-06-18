import type { Config } from 'tailwindcss';
import { nextui } from '@nextui-org/react';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      width: {
        videoWidth: '680px',
        emptyThumbnailWidth: '150px',
      },
      height: {
        videoHeight: '480px',
        emptyThumbnailHeight: '100px',
      },
      colors: {
        textDanger: 'hsl(339, 90%, 51%)',
      },
      backgroundColor: {
        emptyPlaylist: 'hsl(240 4% 16%)',
        emptyThumbnail: 'hsl(240 4% 16%)',
        application: '#151516',
      },
    },
  },
  darkMode: 'class',
  plugins: [nextui()],
};
export default config;
