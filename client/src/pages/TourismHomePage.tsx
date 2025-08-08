import React from 'react';
import TourCard from '../components/TourCard';
import HotelCard from '../components/HotelCard';
import ActivityCard from '../components/ActivityCard';

const HomePage: React.FC = () => {
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold my-6">Explore Nepal</h1>

      {/* Featured Tours */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Featured Tours</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Example TourCards */}
          <TourCard title="Everest Base Camp" imageUrl="/images/everest.jpg" price={1500} />
          <TourCard title="Annapurna Circuit" imageUrl="/images/annapurna.jpg" price={1200} />
          <TourCard title="Langtang Valley" imageUrl="/images/langtang.jpg" price={900} />
        </div>
      </section>

      {/* Featured Hotels */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Top Hotels</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Example HotelCards */}
          <HotelCard title="Luxury Hotel" imageUrl="/images/hotel.jpg" starRating={5} />
          <HotelCard title="Comfort Stay" imageUrl="/images/comfort.jpg" starRating={4} />
          <HotelCard title="Budget Inn" imageUrl="/images/budget.jpg" starRating={3} />
        </div>
      </section>

      {/* Featured Activities */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Exciting Activities</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Example ActivityCards */}
          <ActivityCard title="Paragliding in Pokhara" imageUrl="/images/paragliding.jpg" />
          <ActivityCard title="Jungle Safari Chitwan" imageUrl="/images/safari.jpg" />
          <ActivityCard title="Cultural Tour" imageUrl="/images/cultural.jpg" />
        </div>
      </section>
    </div>
  );
};

export default HomePage;

