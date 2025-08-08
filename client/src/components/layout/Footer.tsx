import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CameraIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  QrCodeIcon,
  HeartIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';
import { APP_CONFIG, ROUTES } from '../../constants';

const quickLinks = [
  { name: 'Home', href: ROUTES.HOME },
  { name: 'About Me', href: ROUTES.ABOUT },
  { name: 'Blog', href: ROUTES.BLOG },
  { name: 'Gallery', href: ROUTES.GALLERY },
];

const moreLinks = [
  { name: 'Contact', href: ROUTES.CONTACT },
  { name: 'Join Us', href: ROUTES.JOIN_US },
  { name: 'Donate', href: ROUTES.DONATE },
];

const socialLinks = [
  {
    name: 'Facebook',
    href: APP_CONFIG.social.facebook,
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M20 10C20 4.477 15.523 0 10 0S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    name: 'Instagram',
    href: APP_CONFIG.social.instagram,
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0zm0 5a5 5 0 100 10 5 5 0 000-10z" clipRule="evenodd" />
        <path d="M10.5 7.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path d="M15.5 6.5a1 1 0 11-2 0 1 1 0 012 0z" />
      </svg>
    ),
  },
  {
    name: 'Twitter',
    href: APP_CONFIG.social.twitter,
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
      </svg>
    ),
  },
  {
    name: 'YouTube',
    href: APP_CONFIG.social.youtube,
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M2 3a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1 1H3a1 1 0 01-1-1V3zm13.5 6L9 5.5v9l6.5-4.5z" clipRule="evenodd" />
      </svg>
    ),
  },
];

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900 text-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-orange-500/10 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-purple-500/10 rounded-full blur-xl transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>
      
      <div className="container-custom py-12 lg:py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand & Description */}
          <div className="lg:col-span-2">
            <Link
              to={ROUTES.HOME}
              className="flex items-center space-x-2 text-xl font-bold text-emerald-400 hover:text-emerald-300 mb-4 transition-colors duration-300"
            >
              <div className="p-2 bg-emerald-500/20 rounded-full">
                <CameraIcon className="h-6 w-6" />
              </div>
              <span>{APP_CONFIG.name}</span>
            </Link>
            <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
              {APP_CONFIG.description}. Capturing the wild beauty of Nepal and 
              sharing conservation stories through stunning photography.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-300">
                <EnvelopeIcon className="h-5 w-5 text-emerald-400" />
                <a href={`mailto:${APP_CONFIG.email}`} className="hover:text-emerald-300 transition-colors">
                  {APP_CONFIG.email}
                </a>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <PhoneIcon className="h-5 w-5 text-emerald-400" />
                <a href={`tel:${APP_CONFIG.phone}`} className="hover:text-emerald-300 transition-colors">
                  {APP_CONFIG.phone}
                </a>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <MapPinIcon className="h-5 w-5 text-emerald-400" />
                <span>Nepal</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-emerald-300 transition-colors duration-300 hover:translate-x-1 transform inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Get Involved
            </h3>
            <ul className="space-y-3">
              {moreLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-emerald-300 transition-colors duration-300 hover:translate-x-1 transform inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Social Links */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-white mb-3">
                Follow Me
              </h4>
              <div className="flex space-x-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-emerald-300 transition-all duration-300 transform hover:scale-110 p-2 bg-white/5 rounded-full hover:bg-emerald-500/20"
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Donation QR Code */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <HeartIcon className="h-5 w-5 text-red-400" />
              Quick Donate
            </h3>
            
            {/* QR Code */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4">
              <div className="bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg p-3 flex items-center justify-center">
                <div className="w-24 h-24 bg-white rounded-lg flex items-center justify-center">
                  <QrCodeIcon className="w-16 h-16 text-gray-700" />
                </div>
              </div>
              <p className="text-xs text-gray-300 text-center mt-2">
                Scan for eSewa
              </p>
            </div>
            
            {/* Donation Info */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-300">
                <BanknotesIcon className="h-4 w-4 text-emerald-400" />
                <span>ID: 9876543210</span>
              </div>
              <Link 
                to={ROUTES.DONATE}
                className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors text-sm"
              >
                View all methods →
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-600">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm">
              <p className="text-gray-400">
                © {currentYear} {APP_CONFIG.author}. All rights reserved.
              </p>
              <div className="flex items-center space-x-2 text-gray-500">
                <span>•</span>
                <span>Designed by</span>
                <a 
                  href="https://github.com/somthehit" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
                >
                  @Som Thehit
                </a>
              </div>
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-emerald-300 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-300 transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
