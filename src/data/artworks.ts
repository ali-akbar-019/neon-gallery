export interface Artwork {
  id: string;
  title: string;
  artist: string;
  year: number;
  medium: string;
  dimensions: string;
  imageUrl: string;
  accentColor: 'cyan' | 'magenta' | 'gold';
  featured?: boolean;
}

export const artworks: Artwork[] = [
  {
    id: 'aw-001',
    title: 'Fractured Dreamscape',
    artist: 'Kira Nakamura',
    year: 2024,
    medium: 'Digital Oil on Neural Canvas',
    dimensions: '4096 × 5120px',
    imageUrl: 'https://picsum.photos/seed/surreal1/800/1000',
    accentColor: 'cyan',
    featured: true,
  },
  {
    id: 'aw-002',
    title: 'The Neon Labyrinth',
    artist: 'Zeph Moreau',
    year: 2024,
    medium: 'Generative Acrylic',
    dimensions: '6144 × 4096px',
    imageUrl: 'https://picsum.photos/seed/surreal2/900/700',
    accentColor: 'magenta',
  },
  {
    id: 'aw-003',
    title: 'Echoes of the Machine',
    artist: 'Asel Dzhaksybekov',
    year: 2023,
    medium: 'AI-Assisted Photography',
    dimensions: '5000 × 5000px',
    imageUrl: 'https://picsum.photos/seed/surreal3/700/700',
    accentColor: 'gold',
  },
  {
    id: 'aw-004',
    title: 'Violet Subconscious',
    artist: 'Kira Nakamura',
    year: 2024,
    medium: 'Digital Oil on Neural Canvas',
    dimensions: '3840 × 5120px',
    imageUrl: 'https://picsum.photos/seed/surreal4/700/900',
    accentColor: 'magenta',
  },
  {
    id: 'aw-005',
    title: 'The Void Remembers',
    artist: 'Dante Ferrara',
    year: 2023,
    medium: 'Procedural Sculpture',
    dimensions: '4096 × 4096px',
    imageUrl: 'https://picsum.photos/seed/surreal5/800/800',
    accentColor: 'cyan',
  },
  {
    id: 'aw-006',
    title: 'Golden Static',
    artist: 'Zeph Moreau',
    year: 2024,
    medium: 'Glitch Photography',
    dimensions: '6000 × 4000px',
    imageUrl: 'https://picsum.photos/seed/surreal6/900/600',
    accentColor: 'gold',
  },
  {
    id: 'aw-007',
    title: 'Spectral Tide',
    artist: 'Asel Dzhaksybekov',
    year: 2024,
    medium: 'Generative Watercolor',
    dimensions: '4096 × 6000px',
    imageUrl: 'https://picsum.photos/seed/surreal7/600/900',
    accentColor: 'cyan',
  },
  {
    id: 'aw-008',
    title: 'Last Signal',
    artist: 'Dante Ferrara',
    year: 2023,
    medium: 'Digital Collage',
    dimensions: '5120 × 3200px',
    imageUrl: 'https://picsum.photos/seed/surreal8/900/560',
    accentColor: 'magenta',
  },
  {
    id: 'aw-009',
    title: 'Chromatic Fever',
    artist: 'Kira Nakamura',
    year: 2024,
    medium: 'Neural Painting',
    dimensions: '4096 × 4096px',
    imageUrl: 'https://picsum.photos/seed/surreal9/800/800',
    accentColor: 'gold',
  },
];

export const featuredArtwork = artworks.find(a => a.featured) ?? artworks[0];
