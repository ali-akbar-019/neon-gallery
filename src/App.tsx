import './styles/global.css';
import { useLenis } from './hooks/useLenis';

import CustomCursor from './components/UI/CustomCursor';
import ScrollProgress from './components/UI/ScrollProgress';
import Navbar from './components/UI/Navbar';

import Hero from './components/Hero';
import Marquee from './components/Marquee';
import FeaturedExhibition from './components/FeaturedExhibition';
import GalleryGrid from './components/GalleryGrid';
import ArtistSpotlight from './components/ArtistSpotlight';
import Stats from './components/Stats';
import Timeline from './components/Timeline';
import Quote from './components/Quote';
import OpenCall from './components/OpenCall';
import Footer from './components/Footer';

export default function App() {
  useLenis();

  return (
    <>
      <CustomCursor />
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <FeaturedExhibition />
        <GalleryGrid />
        <ArtistSpotlight />
        <Stats />
        <Timeline />
        <Quote />
        <OpenCall />
        <Footer />
      </main>
    </>
  );
}
