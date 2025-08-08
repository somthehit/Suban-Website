import React, { useState } from 'react';
import { X, Calendar, MapPin } from 'lucide-react';

interface BookingModalProps {
  item: any;
  type: 'tour' | 'hotel' | 'activity';
  dateRange: { from: string; to: string };
  onClose: () => void;
  onConfirm: (bookingData: any) => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ item, type, dateRange, onClose, onConfirm }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);

  const handleConfirm = () => {
    onConfirm({
      itemId: item.id,
      itemType: type,
      name,
      email,
      phone,
      guests: { adults, children },
      dateRange
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>
        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  Booking Details
                </h3>
                <div className="mt-2">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                          {item.destination || item.location?.name || item.name}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                          {dateRange.from} - {dateRange.to}
                        </span>
                      </div>
                    </div>
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                    <input
                      type="tel"
                      placeholder="Phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                    <div className="flex space-x-4">
                      <div className="flex-1">
                        <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                          Adults
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={adults}
                          onChange={(e) => setAdults(parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                          Children
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={children}
                          onChange={(e) => setChildren(parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={handleConfirm}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-emerald-600 text-base font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Confirm Booking
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;

