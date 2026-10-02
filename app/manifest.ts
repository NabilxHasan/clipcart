import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ClipCart — Bangladesh Content Clipping & Distribution Marketplace',
    short_name: 'ClipCart BD',
    description: 'Performance-driven clipping campaigns and short-form video distribution for Bangladeshi creators, podcasters, and brands.',
    start_url: '/',
    display: 'standalone',
    background_color: '#fafafc',
    theme_color: '#e11d48',
    icons: [
      {
        src: '/icon',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/apple-icon',
        sizes: '180x180',
        type: 'image/png',
      },
      {
        src: '/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}
