import React from 'react';
import HeroSection from '../components/hero/HeroSection';
import AboutSection from '../components/about/AboutSection';
import GallerySection from '../components/home/GallerySection';
import BlogSection from '../components/home/BlogSection';
import ContactSection from '../components/home/ContactSection';
import JoinUsSection from '../components/home/JoinUsSection';
import DonateSection from '../components/home/DonateSection';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Immersive Hero Section */}
      <HeroSection />
      
      {/* About Me Section */}
      <AboutSection />
      
      {/* Gallery Section */}
      <GallerySection />

      {/* Blog Section */}
      <BlogSection />

      {/* Contact Section */}
      <ContactSection />

      {/* Join Us Section */}
      <JoinUsSection />

      {/* Donate Section */}
      <DonateSection />
    </div>
  );
};

export default HomePage;
