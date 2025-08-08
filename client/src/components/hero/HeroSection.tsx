import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, AnimatePresence, useMotionValue, useAnimation } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Parallax } from 'swiper/modules';
import {
  CameraIcon,
  MapIcon,
  HeartIcon,
  SparklesIcon,
  GlobeAltIcon,
  EyeIcon,
  PlayIcon,
  PauseIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  ArrowDownIcon,
  StarIcon,
  FireIcon,
  LightBulbIcon,
  BoltIcon
} from '@heroicons/react/24/outline';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/autoplay';

// Enhanced Hero Data with videos and 3D elements
const heroContent = [
  {
    type: 'video',
    url: 'https://player.vimeo.com/external/434045526.sd.mp4?s=c27eecc69fabf212b04de6d905ca6c52efffc7a4&profile_id=165&oauth2_token_id=57447761',
    fallbackImage: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2560&q=80',
    title: 'Into the Wild',
    subtitle: 'Nepal\'s Pristine Wilderness',
    description: 'Journey through untamed landscapes where wildlife roams free',
    theme: 'emerald'
  },
  {
    type: 'image',
    url: 'https://images.unsplash.com/photo-1549366021-9f761d040a94?ixlib=rb-4.0.3&auto=format&fit=crop&w=2560&q=80',
    title: 'Majestic Peaks',
    subtitle: 'Himalayan Giants',
    description: 'Where earth touches sky in Nepal\'s mountain realm',
    theme: 'blue'
  },
  {
    type: 'image',
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2560&q=80',
    title: 'Cultural Heritage',
    subtitle: 'Living Traditions',
    description: 'Ancient wisdom preserved in modern times',
    theme: 'amber'
  }
];


interface HeroSectionProps {
  className?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ className = '' }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Parallax scrolling effects
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, -200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 500], [1, 0.8]);
  
  // Mouse parallax effect
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
    setMousePosition({ x, y });
    const cursor = cursorRef.current;
    if (cursor) {
      const x = e.clientX - cursor.offsetWidth / 2;
      const y = e.clientY - cursor.offsetHeight / 2;
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      cursor.style.opacity = '1';
    }
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    const mouseOut = () => {
      if (cursorRef.current) cursorRef.current.style.opacity = '0';
    };
    document.addEventListener('mouseleave', mouseOut);
    const timer = setTimeout(() => setIsLoaded(true), 1000);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', mouseOut);
      clearTimeout(timer);
    };
  }, [handleMouseMove]);
  
  // Typewriter effect
  const [displayText, setDisplayText] = useState('');
  const fullText = 'Into the Wild with Suban';
  
  useEffect(() => {
    if (!isLoaded) return;
    let index = 0;
    const timer = setInterval(() => {
      setDisplayText(fullText.slice(0, index));
      index++;
      if (index > fullText.length) clearInterval(timer);
    }, 80);
    return () => clearInterval(timer);
  }, [isLoaded]);
  
  const currentContent = heroContent[currentSlide];
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroContent.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroContent.length) % heroContent.length);
  
  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(nextSlide, 8000); // Change slide every 8 seconds
    return () => clearInterval(interval);
  }, [currentSlide]);


  return (
    <motion.section 
      ref={containerRef}
      className={`relative w-full h-screen overflow-hidden ${className}`}
      style={{ opacity, scale }}
    >
      {/* Revolutionary Video Background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0 z-0"
        >
          {currentContent.type === 'video' ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                loop
                muted={isMuted}
                playsInline
                className="w-full h-full object-cover"
                poster={currentContent.fallbackImage}
              >
                <source src={currentContent.url} type="video/mp4" />
              </video>
              {/* Video Controls */}
              <div className="absolute top-6 right-6 z-30 flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                  className="bg-black/30 backdrop-blur-md border border-white/20 rounded-full p-3 text-white hover:bg-black/50 transition-all duration-300"
                >
                  {isVideoPlaying ? <PauseIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5" />}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsMuted(!isMuted)}
                  className="bg-black/30 backdrop-blur-md border border-white/20 rounded-full p-3 text-white hover:bg-black/50 transition-all duration-300"
                >
                  {isMuted ? <SpeakerXMarkIcon className="w-5 h-5" /> : <SpeakerWaveIcon className="w-5 h-5" />}
                </motion.button>
              </div>
            </>
          ) : (
            <div 
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url('${currentContent.url}')` }}
            />
          )}
          
          {/* Dynamic Gradient Overlay */}
          <motion.div 
            className={`absolute inset-0 bg-gradient-to-br ${
              currentContent.theme === 'emerald' ? 'from-emerald-900/80 via-green-800/70 to-teal-900/60' :
              currentContent.theme === 'blue' ? 'from-blue-900/80 via-indigo-800/70 to-purple-900/60' :
              'from-amber-900/80 via-orange-800/70 to-red-900/60'
            }`}
            animate={{
              background: [
                `linear-gradient(to bottom right, ${currentContent.theme === 'emerald' ? 'rgba(6, 78, 59, 0.8), rgba(22, 101, 52, 0.7), rgba(15, 118, 110, 0.6)' : currentContent.theme === 'blue' ? 'rgba(30, 58, 138, 0.8), rgba(67, 56, 202, 0.7), rgba(88, 28, 135, 0.6)' : 'rgba(146, 64, 14, 0.8), rgba(194, 65, 12, 0.7), rgba(220, 38, 38, 0.6)'})`
              ]
            }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          />
        </motion.div>
      </AnimatePresence>
      

      {/* Floating Nature Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Animated Leaves */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
            rotate: [0, 10, 0]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-10 w-8 h-8 text-emerald-400/40"
        >
          🍃
        </motion.div>
        
        <motion.div
          animate={{
            y: [0, 15, 0],
            x: [0, -8, 0],
            rotate: [0, -8, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute top-40 right-20 w-6 h-6 text-green-400/50"
        >
          🌿
        </motion.div>
        
        <motion.div
          animate={{
            y: [0, -10, 0],
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-32 left-1/4 w-4 h-4 text-emerald-300/60"
        >
          ✨
        </motion.div>
        
        {/* Fireflies/Sparkles */}
        <motion.div
          animate={{
            opacity: [0.2, 0.8, 0.2],
            scale: [0.8, 1.2, 0.8]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/3 right-1/3 w-2 h-2 bg-emerald-400 rounded-full shadow-lg shadow-emerald-400/50"
        />
        
        <motion.div
          animate={{
            opacity: [0.3, 0.9, 0.3],
            scale: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5
          }}
          className="absolute bottom-1/3 left-1/4 w-3 h-3 bg-green-400 rounded-full shadow-lg shadow-green-400/50"
        />
      </div>

      {/* Main Content Overlay */}
      <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-white px-4">
        <div className="text-center max-w-6xl mx-auto">
          {/* Enhanced Nature Icon */}
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.5 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-8"
          >
            <div className="relative inline-flex items-center justify-center">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-500/30 to-green-600/30 backdrop-blur-xl border-2 border-emerald-400/40 rounded-full flex items-center justify-center">
                <CameraIcon className="w-12 h-12 text-emerald-300" />
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-2 border-dashed border-emerald-400/20 rounded-full"
              />
            </div>
          </motion.div>

          {/* Enhanced Main Heading */}
          <motion.h1 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6 bg-gradient-to-r from-emerald-300 via-green-200 to-teal-300 bg-clip-text text-transparent drop-shadow-2xl"
          >
            {displayText}
            <motion.span 
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-emerald-400"
            >
              |
            </motion.span>
          </motion.h1>
          
          {/* Enhanced Subtitle with Glassmorphism */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-10"
          >
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 max-w-4xl mx-auto">
              <p className="text-xl md:text-2xl lg:text-3xl leading-relaxed text-emerald-100 font-light">
                Explore breathtaking stories and wildlife photography from the heart of
                <span className="text-emerald-300 font-semibold"> Nepal's pristine jungles</span> and 
                <span className="text-green-300 font-semibold"> magnificent mountains</span>
                <span className="text-emerald-300 font-semibold"> and </span>
                <span className="text-green-300 font-semibold"> beautiful culture</span>
              </p>
            </div>
          </motion.div>

          {/* Enhanced Action Buttons */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20"
          >
            <Link 
              to="/gallery" 
              className="group relative bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white px-10 py-5 rounded-2xl font-bold text-xl transition-all duration-500 transform hover:scale-110 shadow-2xl hover:shadow-emerald-500/25 flex items-center gap-3 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <EyeIcon className="w-7 h-7 group-hover:rotate-12 transition-transform duration-500" />
              <span>View Gallery</span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 bg-white rounded-full"
              />
            </Link>
            
            <Link 
              to="/blog" 
              className="group relative bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white px-10 py-5 rounded-2xl font-bold text-xl transition-all duration-500 transform hover:scale-110 shadow-2xl hover:shadow-orange-500/25 flex items-center gap-3 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <HeartIcon className="w-7 h-7 group-hover:scale-125 transition-transform duration-500" />
              <span>Read Stories</span>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 bg-white rounded-full"
              />
            </Link>
          </motion.div>

          {/* Enhanced Stats with Nature Theme */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto mb-20"
          >
            <motion.div 
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-gradient-to-br from-emerald-500/20 to-green-600/20 backdrop-blur-xl border border-emerald-400/30 rounded-2xl p-6 text-center group cursor-pointer"
            >
              <motion.div
                animate={{ rotate: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="text-4xl mb-2"
              >
                📸
              </motion.div>
              <div className="text-3xl font-black text-emerald-300 mb-1">500+</div>
              <div className="text-emerald-100 font-medium">Wildlife Captures</div>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-green-500/20 to-teal-600/20 backdrop-blur-xl border border-green-400/30 rounded-2xl p-6 text-center group cursor-pointer"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                className="text-4xl mb-2"
              >
                🏔️
              </motion.div>
              <div className="text-3xl font-black text-green-300 mb-1">15+</div>
              <div className="text-green-100 font-medium text-center">National Parks</div>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-teal-500/20 to-cyan-600/20 backdrop-blur-xl border border-teal-400/30 rounded-2xl p-6 text-center group cursor-pointer"
            >
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 2 }}
                className="text-4xl mb-2"
              >
                ⭐
              </motion.div>
              <div className="text-3xl font-black text-teal-300 mb-1">8</div>
              <div className="text-teal-100 font-medium">Years Experience</div>
            </motion.div>
          </motion.div>
        </div>

      </div>

      {/* Slide Navigation Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex gap-3">
        {heroContent.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-white border-white shadow-lg shadow-white/50' 
                : 'bg-transparent border-white/50 hover:border-white/80'
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              className="w-full h-full rounded-full bg-white"
              initial={{ scale: 0 }}
              animate={{ scale: index === currentSlide ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>
        ))}
      </div>
      
      {/* Scroll Down Indicator */}
      <motion.div 
        className="absolute bottom-8 right-8 z-30"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.div
          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full p-3 text-white hover:bg-white/20 transition-all duration-300 cursor-pointer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        >
          <ArrowDownIcon className="w-6 h-6" />
        </motion.div>
      </motion.div>

      {/* Advanced Particle System */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Glowing Orbs */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              opacity: [0.1, 0.8, 0.1],
              scale: [0.3, 1.2, 0.3]
            }}
            transition={{
              duration: 3 + Math.random() * 6,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeInOut"
            }}
            className={`absolute w-2 h-2 rounded-full ${
              i % 4 === 0 ? 'bg-emerald-400 shadow-emerald-400/70' :
              i % 4 === 1 ? 'bg-green-400 shadow-green-400/70' :
              i % 4 === 2 ? 'bg-teal-400 shadow-teal-400/70' :
              'bg-cyan-400 shadow-cyan-400/70'
            } shadow-lg filter blur-sm`}
            style={{
              left: `${5 + (i * 8)}%`,
              top: `${10 + (i * 7)}%`
            }}
          />
        ))}
      </div>
      
      {/* Custom Cursor */}
      <motion.div
        ref={cursorRef}
        className="fixed pointer-events-none z-[9999] w-8 h-8 rounded-full mix-blend-difference"
        style={{ opacity: 0 }}
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-green-500 rounded-full shadow-lg shadow-emerald-400/50">
          <div className="absolute inset-1 bg-white/20 rounded-full animate-pulse" />
        </div>
      </motion.div>
    </motion.section>
  );
};

export default HeroSection;
