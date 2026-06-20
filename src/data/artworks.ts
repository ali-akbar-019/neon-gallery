export interface Artwork {
  id: string;
  title: string;
  artist: string;
  year: number;
  medium: string;
  dimensions: string;
  imageUrl: string;
  featured?: boolean;
}

export const artworks: Artwork[] = [
  {
    id: 'aw-001',
    title: 'Fractured Dreamscape',
    artist: 'Kira Nakamura',
    year: 2024,
    medium: 'Digital oil on neural canvas',
    dimensions: '4096 × 5120 px',
    imageUrl: 'https://picsum.photos/seed/surreal1/800/1000',
    featured: true,
  },
  {
    id: 'aw-002',
    title: 'A House With No Floor',
    artist: 'Zeph Moreau',
    year: 2024,
    medium: 'Generative acrylic',
    dimensions: '6144 × 4096 px',
    imageUrl: 'https://picsum.photos/seed/surreal2/900/700',
  },
  {
    id: 'aw-003',
    title: 'Echoes of the Machine',
    artist: 'Asel Dzhaksybekov',
    year: 2023,
    medium: 'AI-assisted photography',
    dimensions: '5000 × 5000 px',
    imageUrl: 'https://picsum.photos/seed/surreal3/700/700',
  },
  {
    id: 'aw-004',
    title: 'Violet Subconscious',
    artist: 'Kira Nakamura',
    year: 2024,
    medium: 'Digital oil on neural canvas',
    dimensions: '3840 × 5120 px',
    imageUrl: 'https://picsum.photos/seed/surreal4/700/900',
  },
  {
    id: 'aw-005',
    title: 'The Room Remembers',
    artist: 'Dante Ferrara',
    year: 2023,
    medium: 'Procedural sculpture',
    dimensions: '4096 × 4096 px',
    imageUrl: 'https://picsum.photos/seed/surreal5/800/800',
  },
  {
    id: 'aw-006',
    title: 'Static Bloom',
    artist: 'Zeph Moreau',
    year: 2024,
    medium: 'Glitch photography',
    dimensions: '6000 × 4000 px',
    imageUrl: 'https://picsum.photos/seed/surreal6/900/600',
  },
  {
    id: 'aw-007',
    title: 'Spectral Tide',
    artist: 'Asel Dzhaksybekov',
    year: 2024,
    medium: 'Generative watercolor',
    dimensions: '4096 × 6000 px',
    imageUrl: 'https://picsum.photos/seed/surreal7/600/900',
  },
  {
    id: 'aw-008',
    title: 'Last Signal',
    artist: 'Dante Ferrara',
    year: 2023,
    medium: 'Digital collage',
    dimensions: '5120 × 3200 px',
    imageUrl: 'https://picsum.photos/seed/surreal8/900/560',
  },
  {
    id: 'aw-009',
    title: 'Interior, Unfinished',
    artist: 'Kira Nakamura',
    year: 2024,
    medium: 'Neural painting',
    dimensions: '4096 × 4096 px',
    imageUrl: 'https://picsum.photos/seed/surreal9/800/800',
  },
];

export const featuredArtwork = artworks.find(a => a.featured) ?? artworks[0];
