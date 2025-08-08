import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, MapPin, Users, Star, Clock, DollarSign } from 'lucide-react';
import SearchBar from '../components/tourism/SearchBar';
import FilterSidebar from '../components/tourism/FilterSidebar';
import TourCard from '../components/tourism/TourCard';
import HotelCard from '../components/tourism/HotelCard';
import ActivityCard from '../components/tourism/ActivityCard';
import BookingModal from '../components/tourism/BookingModal';

interface Tour {
  id: string;
  title: string;
  destination: string;
  duration: { days: number; nights: number };
  price: { adult: number; child: number; currency: string };
  images: { url: string; alt: string }[];
  rating: number;
  reviewCount: number;
  category: string;
  difficulty: string;
  shortDescription: string;
}

interface Hotel {
  id: string;
  name: string;
  location: { city: string; address: string };
  starRating: number;
  rating: number;
  reviewCount: number;
  images: { url: string; alt: string }[];
  category: string;
  rooms: { type: string; pricePerNight: number }[];
}

interface Activity {
  id: string;
  title: string;
  location: { name: string };
  duration: { hours: number; type: string };
  price: { amount: number; currency: string };
  images: { url: string; alt: string }[];
  rating: number;
  reviewCount: number;
  category: string;
  difficulty: string;
  shortDescription: string;
}

const TourismPage: React.FC = () => {
const [activeTab, setActiveTab] = useState<'tours' | 'homestay' | 'activities' | 'events'>('tours');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [filters, setFilters] = useState({
    category: '',
    priceRange: [0, 5000],
    rating: 0,
    difficulty: '',
    destination: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [bookingModal, setBookingModal] = useState({ isOpen: false, item: null, type: '' });
  const [tours, setTours] = useState<Tour[]>([]);
const [homestays, setHomestays] = useState<Hotel[]>([]);
  const [events, setEvents] = useState<Activity[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);

  // Sample data - replace with API calls
  const sampleTours: Tour[] = [
    {
      id: '1',
      title: 'Everest Base Camp Trek',
      destination: 'Everest Region',
      duration: { days: 14, nights: 13 },
      price: { adult: 1500, child: 1200, currency: 'USD' },
      images: [{ url: '/images/everest.jpg', alt: 'Everest Base Camp' }],
      rating: 4.8,
      reviewCount: 245,
      category: 'trekking',
      difficulty: 'challenging',
      shortDescription: 'Experience the world\'s highest peak with our expert guides'
    },
    {
      id: '2',
      title: 'Annapurna Circuit Trek',
      destination: 'Annapurna Region',
      duration: { days: 12, nights: 11 },
      price: { adult: 1200, child: 900, currency: 'USD' },
      images: [{ url: '/images/annapurna.jpg', alt: 'Annapurna Circuit' }],
      rating: 4.7,
      reviewCount: 189,
      category: 'trekking',
      difficulty: 'moderate',
      shortDescription: 'Classic trek through diverse landscapes and cultures'
    },
    {
      id: '3',
      title: 'Chitwan Wildlife Safari',
      destination: 'Chitwan National Park',
      duration: { days: 3, nights: 2 },
      price: { adult: 350, child: 200, currency: 'USD' },
      images: [{ url: '/images/chitwan.jpg', alt: 'Chitwan Safari' }],
      rating: 4.5,
      reviewCount: 156,
      category: 'wildlife',
      difficulty: 'easy',
      shortDescription: 'Spot rhinos, tigers, and exotic wildlife'
    }
  ];

const sampleHomestays: Hotel[] = [
    {
      id: '1',
      name: 'Hotel Yak & Yeti',
      location: { city: 'Kathmandu', address: 'Durbar Marg' },
      starRating: 5,
      rating: 4.6,
      reviewCount: 1234,
      images: [{ url: '/images/hotel-yak-yeti.jpg', alt: 'Hotel Yak & Yeti' }],
      category: 'luxury',
      rooms: [{ type: 'Deluxe Room', pricePerNight: 180 }]
    },
    {
      id: '2',
      name: 'Temple Tree Resort',
      location: { city: 'Pokhara', address: 'Lakeside' },
      starRating: 4,
      rating: 4.4,
      reviewCount: 567,
      images: [{ url: '/images/temple-tree.jpg', alt: 'Temple Tree Resort' }],
      category: 'resort',
      rooms: [{ type: 'Garden View Room', pricePerNight: 120 }]
    }
  ];

  const sampleActivities: Activity[] = [
    {
      id: '1',
      title: 'Paragliding in Pokhara',
      location: { name: 'Pokhara' },
      duration: { hours: 3, type: 'half-day' },
      price: { amount: 85, currency: 'USD' },
      images: [{ url: '/images/paragliding.jpg', alt: 'Paragliding' }],
      rating: 4.7,
      reviewCount: 89,
      category: 'adventure',
      difficulty: 'moderate',
      shortDescription: 'Soar above the beautiful Phewa Lake'
    },
    {
      id: '2',
      title: 'Kathmandu Valley Cultural Tour',
      location: { name: 'Kathmandu' },
      duration: { hours: 8, type: 'full-day' },
      price: { amount: 65, currency: 'USD' },
      images: [{ url: '/images/cultural-tour.jpg', alt: 'Cultural Tour' }],
      rating: 4.5,
      reviewCount: 134,
      category: 'cultural',
      difficulty: 'easy',
      shortDescription: 'Explore UNESCO World Heritage Sites'
    }
  ];

  const sampleEvents: Activity[] = [
    {
      id: '1',
      title: 'Dashain Festival Celebration',
      location: { name: 'Kathmandu' },
      duration: { hours: 6, type: 'full-day' },
      price: { amount: 35, currency: 'USD' },
      images: [{ url: '/images/dashain-festival.jpg', alt: 'Dashain Festival' }],
      rating: 4.8,
      reviewCount: 156,
      category: 'cultural',
      difficulty: 'easy',
      shortDescription: 'Experience Nepal\'s biggest festival celebration'
    },
    {
      id: '2',
      title: 'Holi Color Festival',
      location: { name: 'Bhaktapur' },
      duration: { hours: 4, type: 'half-day' },
      price: { amount: 25, currency: 'USD' },
      images: [{ url: '/images/holi-festival.jpg', alt: 'Holi Festival' }],
      rating: 4.7,
      reviewCount: 89,
      category: 'cultural',
      difficulty: 'easy',
      shortDescription: 'Join the vibrant festival of colors'
    },
    {
      id: '3',
      title: 'Mountain Music Festival',
      location: { name: 'Pokhara' },
      duration: { hours: 8, type: 'full-day' },
      price: { amount: 45, currency: 'USD' },
      images: [{ url: '/images/mountain-music.jpg', alt: 'Mountain Music Festival' }],
      rating: 4.6,
      reviewCount: 67,
      category: 'music',
      difficulty: 'easy',
      shortDescription: 'Live music with stunning mountain backdrop'
    }
  ];

  useEffect(() => {
    setTours(sampleTours);
setHomestays(sampleHomestays);
    setEvents(sampleEvents);
    setActivities(sampleActivities);
  }, []);

  const handleSearch = (query: string, dates: { from: string; to: string }) => {
    setSearchQuery(query);
    setDateRange(dates);
    // Implement search logic here
  };

  const handleBooking = (item: any, type: string) => {
    setBookingModal({ isOpen: true, item, type });
  };

  const tabs = [
    { id: 'tours', label: 'Tours & Treks', icon: MapPin },
{ id: 'homestay', label: 'Homestay', icon: MapPin },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'activities', label: 'Activities', icon: Clock }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-emerald-600 to-blue-600 text-white">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative container mx-auto px-4 py-16">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold mb-4">Discover Nepal</h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Experience breathtaking landscapes, rich culture, and adventure like nowhere else on Earth
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="max-w-4xl mx-auto">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex flex-wrap justify-center mb-8 border-b border-gray-200 dark:border-gray-700">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center px-6 py-3 mx-2 mb-2 rounded-t-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-emerald-600 text-white border-b-2 border-emerald-600'
                    : 'text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400'
                }`}
              >
                <Icon className="w-5 h-5 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Filter Toggle */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </button>
            <span className="text-gray-600 dark:text-gray-300">
              {activeTab === 'tours' && `${tours.length} tours found`}
              {activeTab === 'homestay' && `${homestays.length} homestays found`}
              {activeTab === 'activities' && `${activities.length} activities found`}
              {activeTab === 'events' && `${events.length} events found`}
            </span>
          </div>
        </div>

        {/* Content Layout */}
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          {showFilters && (
            <div className="w-1/4">
              <FilterSidebar
                activeTab={activeTab}
                filters={filters}
                onFiltersChange={setFilters}
              />
            </div>
          )}

          {/* Main Content Grid */}
          <div className={showFilters ? 'w-3/4' : 'w-full'}>
            {activeTab === 'tours' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tours.map((tour) => (
                  <TourCard
                    key={tour.id}
                    tour={tour}
                    onBook={() => handleBooking(tour, 'tour')}
                  />
                ))}
              </div>
            )}

            {activeTab === 'homestay' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {homestays.map((homestay) => (
                  <HotelCard
                    key={homestay.id}
                    hotel={homestay}
                    onBook={() => handleBooking(homestay, 'homestay')}
                  />
                ))}
              </div>
            )}

            {activeTab === 'events' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                  <ActivityCard
                    key={event.id}
                    activity={event}
                    onBook={() => handleBooking(event, 'event')}
                  />
                ))}
              </div>
            )}

            {activeTab === 'activities' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activities.map((activity) => (
                  <ActivityCard
                    key={activity.id}
                    activity={activity}
                    onBook={() => handleBooking(activity, 'activity')}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {bookingModal.isOpen && (
        <BookingModal
          item={bookingModal.item}
          type={bookingModal.type}
          dateRange={dateRange}
          onClose={() => setBookingModal({ isOpen: false, item: null, type: '' })}
          onConfirm={(bookingData) => {
            console.log('Booking confirmed:', bookingData);
            setBookingModal({ isOpen: false, item: null, type: '' });
          }}
        />
      )}
    </div>
  );
};

export default TourismPage;

