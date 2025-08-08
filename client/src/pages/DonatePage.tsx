import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CurrencyDollarIcon,
  BanknotesIcon,
  GlobeAltIcon,
  AcademicCapIcon,
  HeartIcon,
  UserGroupIcon,
  StarIcon,
  DevicePhoneMobileIcon,
  QrCodeIcon
} from '@heroicons/react/24/outline';
import { donationAPI } from '../services/api';
import toast from 'react-hot-toast';

interface PaymentMethod {
  id: string;
  name: string;
  type: 'bank' | 'digital' | 'crypto' | 'mobile';
  details: {
    accountNumber?: string;
    accountName?: string;
    bankName?: string;
    routingNumber?: string;
    walletAddress?: string;
    phoneNumber?: string;
    email?: string;
    branch?: string;
  };
  qrCodeUrl?: string;
  accountInfo?: string;
  isActive: boolean;
  createdAt: string;
}

interface Donor {
  id: string;
  name: string;
  email?: string;
  country?: string;
  avatar?: string;
  total_donated: number;
  donation_count: number;
  is_anonymous: boolean;
  last_donation?: string;
}

interface DonationStats {
  totalDonations: number;
  totalDonors: number;
  averageDonation: number;
  activeMethods: number;
}

const DonatePage: React.FC = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [donors, setDonors] = useState<Donor[]>([]);
  const [stats, setStats] = useState<DonationStats>({
    totalDonations: 0,
    totalDonors: 0,
    averageDonation: 0,
    activeMethods: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all data in parallel
        const [paymentMethodsRes, donorsRes, statsRes] = await Promise.all([
          donationAPI.getPaymentMethods(),
          donationAPI.getDonors(),
          donationAPI.getDonationStats()
        ]);
        
        // Set payment methods (only active ones)
        const activeMethods = (paymentMethodsRes.data || []).filter((method: PaymentMethod) => method.isActive);
        setPaymentMethods(activeMethods);
        
        // Set donors data
        const donorsData = donorsRes.data || [];
        setDonors(donorsData.slice(0, 6)); // Show only first 6 donors
        
        // Set stats
        setStats(statsRes.data || {
          totalDonations: 0,
          totalDonors: 0,
          averageDonation: 0,
          activeMethods: 0
        });
        
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load donation data');
        toast.error('Failed to load donation information');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  const getPaymentMethodIcon = (type: PaymentMethod['type']) => {
    switch (type) {
      case 'bank':
        return <GlobeAltIcon className="w-6 h-6 text-blue-500" />;
      case 'digital':
        return <BanknotesIcon className="w-6 h-6 text-green-500" />;
      case 'crypto':
        return <CurrencyDollarIcon className="w-6 h-6 text-orange-500" />;
      case 'mobile':
        return <DevicePhoneMobileIcon className="w-6 h-6 text-purple-500" />;
      default:
        return <CurrencyDollarIcon className="w-6 h-6 text-gray-500" />;
    }
  };
  
  const getPaymentMethodColor = (type: PaymentMethod['type']) => {
    switch (type) {
      case 'bank':
        return 'from-blue-500 to-indigo-500';
      case 'digital':
        return 'from-green-500 to-teal-500';
      case 'crypto':
        return 'from-orange-500 to-red-500';
      case 'mobile':
        return 'from-purple-500 to-pink-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 dark:from-yellow-900/20 dark:via-orange-900/20 dark:to-red-900/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-200 border-t-yellow-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading donation information...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 dark:from-yellow-900/20 dark:via-orange-900/20 dark:to-red-900/20 flex items-center justify-center">
        <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 max-w-md">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Failed to Load</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 dark:from-yellow-900/20 dark:via-orange-900/20 dark:to-red-900/20">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-20 w-32 h-32 bg-yellow-200/30 dark:bg-yellow-400/10 rounded-full blur-xl" />
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-orange-200/30 dark:bg-orange-400/10 rounded-full blur-xl" />
        <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-red-200/30 dark:bg-red-400/10 rounded-full blur-xl" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-16 lg:py-24 relative">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <CurrencyDollarIcon className="w-4 h-4" />
              Support Conservation
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Make a
              <span className="bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 bg-clip-text text-transparent ml-3">
                Donation
              </span>
            </h1>
            
            <div className="w-24 h-1 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 mx-auto mb-8" />
            
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Help support wildlife conservation efforts and photography projects that raise 
              awareness about Nepal's incredible biodiversity. Every contribution makes a difference.
            </p>
          </div>

          {/* Donation Methods */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* Dynamic Payment Methods */}
            {paymentMethods.map((method, index) => (
              <motion.div
                key={method.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
              >
                <div className="text-center">
                  <div className="flex items-center justify-center mb-3">
                    {getPaymentMethodIcon(method.type)}
                  </div>
                  <h3 className="text-sm font-semibold mb-3 text-gray-900 dark:text-white">
                    {method.name}
                  </h3>
                  
                  {/* QR Code if available */}
                  {method.qrCodeUrl && (
                    <div className="mb-3">
                      <img 
                        src={method.qrCodeUrl} 
                        alt={`${method.name} QR Code`} 
                        className="w-20 h-20 rounded-lg mx-auto mb-2" 
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Scan to pay
                      </p>
                    </div>
                  )}
                  
                  {/* Details */}
                  <div className={`bg-gradient-to-r ${getPaymentMethodColor(method.type)} text-white p-3 rounded-lg`}>
                    <p className="text-xs font-medium mb-1">Account Info</p>
                    <p className="text-sm font-bold truncate">{method.accountInfo || 'Contact for details'}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Donation Stats */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 mt-8"
          >
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-3">
              <CurrencyDollarIcon className="w-6 h-6 text-yellow-500" />
              Donation Impact
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600 mb-2">
                  {formatCurrency(stats.totalDonations)}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Raised</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600 mb-2">
                  {stats.totalDonors}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Generous Donors</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600 mb-2">
                  {formatCurrency(stats.averageDonation)}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Average Donation</p>
              </div>
            </div>
          </motion.div>

          {/* Recent Donors */}
          {donors.length > 0 && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 mt-8"
            >
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-3">
                <UserGroupIcon className="w-6 h-6 text-blue-500" />
                Recent Supporters
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {donors.map((donor, index) => (
                  <div
                    key={donor.id}
                    className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg flex items-center gap-3"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                      {donor.avatar ? (
                        <img src={donor.avatar} alt={donor.name} className="w-10 h-10 rounded-full" />
                      ) : (
                        <span className="text-white font-semibold text-sm">
                          {getInitials(donor.is_anonymous ? 'Anonymous' : donor.name)}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">
                        {donor.is_anonymous ? 'Anonymous' : donor.name}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {formatCurrency(donor.total_donated)} • {donor.donation_count} donations
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* How donations help */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 mt-8"
          >
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-3">
              <HeartIcon className="w-6 h-6 text-red-500" />
              How Your Donation Helps
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">📷</span>
                </div>
                <h4 className="font-semibold mb-2">Photography Equipment</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Fund professional camera gear for wildlife documentation
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🌿</span>
                </div>
                <h4 className="font-semibold mb-2">Conservation Projects</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Support local wildlife conservation and habitat protection
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🎓</span>
                </div>
                <h4 className="font-semibold mb-2">Education Programs</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Fund educational workshops about wildlife and conservation
                </p>
              </div>
            </div>
          </motion.div>

          {/* Thank you message */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="text-center bg-yellow-50 dark:bg-yellow-900/20 p-8 rounded-lg mt-8"
          >
            <h3 className="text-lg font-semibold mb-2">Thank You!</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Your generous donation helps preserve Nepal's wildlife for future generations. 
              Together, we can make a difference in conservation efforts.
            </p>
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
};

export default DonatePage;
