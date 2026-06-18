export interface Artist {
  id: string;
  name: string;
  origin: string;
  bio: string;
  specialty: string;
  works: number;
  exhibitions: number;
  collections: number;
  imageUrl: string;
  accentColor: 'cyan' | 'magenta' | 'gold';
}

export const artists: Artist[] = [
  {
    id: 'ar-001',
    name: 'Kira Nakamura',
    origin: 'Osaka, Japan',
    bio: 'Nakamura dissolves the boundary between memory and hallucination, rendering impossible interiors that feel devastatingly familiar.',
    specialty: 'Neural Painting',
    works: 63,
    exhibitions: 11,
    collections: 4,
    imageUrl: 'https://picsum.photos/seed/artist1/600/700',
    accentColor: 'cyan',
  },
  {
    id: 'ar-002',
    name: 'Zeph Moreau',
    origin: 'Lyon, France',
    bio: 'Moreau treats color as a physical force — each canvas a collision between control and entropy, architecture and fever.',
    specialty: 'Generative Acrylic',
    works: 42,
    exhibitions: 7,
    collections: 3,
    imageUrl: 'https://picsum.photos/seed/artist2/600/700',
    accentColor: 'magenta',
  },
  {
    id: 'ar-003',
    name: 'Asel Dzhaksybekov',
    origin: 'Almaty, Kazakhstan',
    bio: 'Operating between steppe mythology and cybernetic futures, Dzhaksybekov builds visual languages no one has spoken before.',
    specialty: 'AI-Assisted Photography',
    works: 38,
    exhibitions: 5,
    collections: 2,
    imageUrl: 'https://picsum.photos/seed/artist3/600/700',
    accentColor: 'gold',
  },
  {
    id: 'ar-004',
    name: 'Dante Ferrara',
    origin: 'Naples, Italy',
    bio: 'Ferrara\u2019s practice is an archaeology of signal: static, noise, and corruption elevated into monuments of raw digital grief.',
    specialty: 'Glitch Sculpture',
    works: 29,
    exhibitions: 9,
    collections: 6,
    imageUrl: 'https://picsum.photos/seed/artist4/600/700',
    accentColor: 'cyan',
  },
];
