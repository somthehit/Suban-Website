import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bars3Icon, 
  XMarkIcon, 
  SunIcon, 
  MoonIcon,
  CameraIcon,
  MagnifyingGlassIcon,
  CalendarDaysIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { useTheme } from '../providers/ThemeProvider';
import { APP_CONFIG, ROUTES } from '../../constants';

const navigation = [
  { name: 'Home', href: ROUTES.HOME },
  { name: 'About Me', href: ROUTES.ABOUT },
  { name: 'Blog', href: ROUTES.BLOG },
  { name: 'Gallery', href: ROUTES.GALLERY },
  { name: 'Tourism', href: ROUTES.TOURISM },
  { name: 'Contact', href: ROUTES.CONTACT },
  { name: 'Join Us', href: ROUTES.JOIN_US },
];

// Function to get current BS date and time
const getCurrentBSDateTime = () => {
  const now = new Date();
  // Current BS date (you can implement proper BS calendar conversion later)
  const bsDate = '2082-04-19'; // Today's BS date
  const time = now.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
  return {
    date: bsDate,
    time
  };
};

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(getCurrentBSDateTime());
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    // Update time every minute
    const timeInterval = setInterval(() => {
      setCurrentDateTime(getCurrentBSDateTime());
    }, 60000);

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(timeInterval);
    };
  }, []);

  const isActiveLink = (href: string) => {
    if (href === ROUTES.HOME) {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg shadow-xl border-b border-white/20 dark:border-gray-700/30'
          : 'bg-black/30 backdrop-blur-md'
      }`}
    >
      <div className="container-custom">
        <div className="flex justify-between items-center h-14 lg:h-16">
          {/* Logo */}
          <Link
            to={ROUTES.HOME}
            className={`flex items-center space-x-2 text-xl lg:text-2xl font-bold transition-colors duration-300 ${
              isScrolled 
                ? 'text-emerald-600 dark:text-emerald-400' 
                : 'text-white hover:text-emerald-300'
            }`}
          >
            <div className={`p-2 rounded-full transition-colors duration-300 shadow-sm ${
              isScrolled ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-emerald-500/20 backdrop-blur-sm'
            }`}>
              <CameraIcon className="h-5 w-5" />
            </div>
            <span className="hidden sm:block">Suban Wildlife</span>
            <span className="sm:hidden">Suban</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:scale-105 ${
                  isActiveLink(item.href)
                    ? isScrolled
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300'
                      : 'bg-white/20 text-white border border-white/30'
                    : isScrolled
                      ? 'text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right Section: Date/Time, Search, Theme Toggle & Mobile Menu */}
          <div className="flex items-center space-x-3">
            {/* Date and Time BS - Hidden on small screens */}
            <div className={`hidden md:flex items-center space-x-3 text-xs font-medium ${
              isScrolled 
                ? 'text-gray-600 dark:text-gray-400' 
                : 'text-white/80'
            }`}>
              <div className="flex items-center space-x-1">
                <CalendarDaysIcon className="h-4 w-4" />
                <span>{currentDateTime.date}</span>
              </div>
              <div className="flex items-center space-x-1">
                <ClockIcon className="h-4 w-4" />
                <span>{currentDateTime.time}</span>
              </div>
            </div>

            {/* Search Button */}
            <button
              className={`p-2 rounded-full transition-all duration-200 hover:scale-110 ${
                isScrolled
                  ? 'text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
              aria-label="Search"
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-all duration-200 hover:scale-110 ${
                isScrolled
                  ? 'text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <MoonIcon className="h-5 w-5" />
              ) : (
                <SunIcon className="h-5 w-5" />
              )}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`lg:hidden p-2 rounded-full transition-all duration-200 hover:scale-110 ${
                isScrolled
                  ? 'text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>

            {/* Donate Button - Far Right */}
            <Link
              to={ROUTES.DONATE}
              className={`hidden lg:inline-flex px-4 py-2 rounded-full font-medium transition-all duration-200 hover:scale-105 ${
                isScrolled
                  ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                  : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg'
              }`}
            >
              Donate
            </Link>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                      isActiveLink(item.href)
                        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                        : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                {/* Mobile Donate Button */}
                <Link
                  to={ROUTES.DONATE}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium bg-emerald-600 text-white hover:bg-emerald-500 transition-colors duration-200 text-center"
                >
                  Donate
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
