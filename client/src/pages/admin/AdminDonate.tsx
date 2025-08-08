import React, { useState, useRef, useEffect } from 'react';
import { donationAPI } from '../../services/api';
import toast from 'react-hot-toast';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  QrCodeIcon,
  CreditCardIcon,
  UserGroupIcon,
  EyeIcon,
  EyeSlashIcon,
  PhotoIcon,
  CheckCircleIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  HeartIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon
} from '@heroicons/react/24/outline';

interface PaymentMethod {
  id: string;
  name: string;
  type: 'bank' | 'digital' | 'crypto' | 'mobile';
  details: {
    phone: any;
    accountNumber?: string;
    accountName?: string;
    bankName?: string;
    routingNumber?: string;
    walletAddress?: string;
    phoneNumber?: string;
    email?: string;
  };
  qrCode?: string;
  isActive: boolean;
  createdAt: string;
}

interface Donor {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  totalDonated: number;
  donationCount: number;
  lastDonation: string;
  isAnonymous: boolean;
  country?: string;
  avatar?: string;
  donations: Donation[];
}

interface Donation {
  id: string;
  donorId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  message?: string;
  isAnonymous: boolean;
  status: 'pending' | 'completed' | 'failed';
  transactionId?: string;
  date: string;
}

const AdminDonate: React.FC = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [donors, setDonors] = useState<Donor[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalDonations: 0,
    totalDonors: 0,
    averageDonation: 0,
    activeMethods: 0
  });

  const [activeTab, setActiveTab] = useState<'payment-methods' | 'donors' | 'donations'>('payment-methods');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDonorModal, setShowDonorModal] = useState(false);
  const [editingPayment, setEditingPayment] = useState<PaymentMethod | null>(null);
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'amount' | 'date'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedQRCode, setUploadedQRCode] = useState<string | null>(null);

  // Fetch data on component mount
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchPaymentMethods(),
        fetchDonors(),
        fetchDonations(),
        fetchStats()
      ]);
    } catch (error) {
      console.error('Error fetching donation data:', error);
      toast.error('Failed to load donation data');
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentMethods = async () => {
    try {
      const response = await donationAPI.getAdminPaymentMethods();
      if (response.success) {
        setPaymentMethods(response.data || []);
        console.log('Payment methods loaded:', response.data?.length || 0);
      }
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      toast.error('Failed to load payment methods');
    }
  };

  const fetchDonors = async () => {
    try {
      const response = await donationAPI.getDonors();
      if (response.success) {
        const donorsData = response.data || [];
        // Transform the data to match the interface
        const transformedDonors = donorsData.map((donor: any) => ({
          ...donor,
          totalDonated: donor.total_donated || 0,
          donationCount: donor.donation_count || 0,
          lastDonation: donor.last_donation || new Date().toISOString(),
          isAnonymous: donor.is_anonymous || false,
          donations: donor.donations || [] // Include existing donations
        }));
        setDonors(transformedDonors);
        console.log('Donors loaded:', transformedDonors.length);
      }
    } catch (error) {
      console.error('Error fetching donors:', error);
      toast.error('Failed to load donors data');
    }
  };

  const fetchDonations = async () => {
    try {
      const response = await donationAPI.getDonations();
      if (response.success) {
        const donationsData = response.data || [];
        setDonations(donationsData);
        console.log('Donations loaded:', donationsData.length);
      }
    } catch (error) {
      console.error('Error fetching donations:', error);
      toast.error('Failed to load donations data');
    }
  };

  const fetchStats = async () => {
    try {
      const response = await donationAPI.getDonationStats();
      if (response.success) {
        setStats(response.data || {
          totalDonations: 0,
          totalDonors: 0,
          averageDonation: 0,
          activeMethods: 0
        });
        console.log('Stats loaded:', response.data);
      }
    } catch (error) {
      console.error('Error fetching donation stats:', error);
      toast.error('Failed to load donation statistics');
    }
  };

  const handleAddPaymentMethod = () => {
    setEditingPayment(null);
    setShowPaymentModal(true);
  };

  const handleEditPaymentMethod = (payment: PaymentMethod) => {
    setEditingPayment(payment);
    setShowPaymentModal(true);
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    
    const paymentMethodData = {
      name: formData.get('name') as string,
      type: formData.get('type') as string,
      details: JSON.parse(formData.get('details') as string || '{}'),
      qr_code: uploadedQRCode || editingPayment?.qrCode || null,
      is_active: formData.get('is_active') === 'on'
    };

    try {
      if (editingPayment) {
        // Update existing payment method
        const response = await donationAPI.updatePaymentMethod(editingPayment.id, paymentMethodData);
        if (response.success) {
          setPaymentMethods(prev => prev.map(pm => pm.id === editingPayment.id ? response.data : pm));
          toast.success('Payment Method updated successfully');
        }
      } else {
        // Create new payment method
        const response = await donationAPI.createPaymentMethod(paymentMethodData);
        if (response.success) {
          setPaymentMethods(prev => [...prev, response.data]);
          toast.success('Payment Method created successfully');
        }
      }
      setShowPaymentModal(false);
      setEditingPayment(null);
      setUploadedQRCode(null);
    } catch (error) {
      console.error('Error saving payment method:', error);
      toast.error('Failed to save payment method');
    }
  };

  const handleDeletePaymentMethod = async (id: string) => {
    if (confirm('Are you sure you want to delete this payment method?')) {
      try {
        await donationAPI.deletePaymentMethod(id);
        setPaymentMethods(prevMethods => prevMethods.filter(pm => pm.id !== id));
        toast.success('Payment Method deleted successfully');
      } catch (error) {
        console.error('Error deleting payment method:', error);
        toast.error('Failed to delete payment method');
      }
    }
  };

  const handleTogglePaymentMethod = (id: string) => {
    setPaymentMethods(prev =>
      prev.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p)
    );
  };

  const handleViewDonor = (donor: Donor) => {
    setSelectedDonor(donor);
    setShowDonorModal(true);
  };

  const handleQRUpload = () => {
    const fileInput = fileInputRef.current;
    if (fileInput) {
      fileInput.click();
      fileInput.onchange = async () => {
        const file = fileInput.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setUploadedQRCode(reader.result as string);
            toast.success('QR Code uploaded successfully');
          };
          reader.onerror = () => {
            toast.error('Failed to upload QR Code');
          };
          reader.readAsDataURL(file);
        } else {
          setUploadedQRCode(null);
        }
      };
    }
  };

  const filteredPaymentMethods = paymentMethods.filter(method => {
    const matchesSearch = method.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'active' && method.isActive) ||
      (filterStatus === 'inactive' && !method.isActive);
    return matchesSearch && matchesStatus;
  });

  const sortedDonors = [...donors].sort((a, b) => {
    let aValue, bValue;
    switch (sortBy) {
      case 'amount':
        aValue = a.totalDonated;
        bValue = b.totalDonated;
        break;
      case 'date':
        aValue = new Date(a.lastDonation).getTime();
        bValue = new Date(b.lastDonation).getTime();
        break;
      default:
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const getPaymentMethodIcon = (type: PaymentMethod['type']) => {
    switch (type) {
      case 'bank':
        return <CreditCardIcon className="w-5 h-5" />;
      case 'digital':
        return <GlobeAltIcon className="w-5 h-5" />;
      case 'crypto':
        return <CurrencyDollarIcon className="w-5 h-5" />;
      case 'mobile':
        return <DevicePhoneMobileIcon className="w-5 h-5" />;
      default:
        return <CreditCardIcon className="w-5 h-5" />;
    }
  };

  const totalDonations = donors.reduce((sum, donor) => sum + donor.totalDonated, 0);
  const totalDonors = donors.length;
  const averageDonation = totalDonations / totalDonors;

  // Show loading spinner while data is being fetched
  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading donation data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Donation Management</h1>
        <p className="text-white">Manage payment methods, track donations, and view donor information</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-black">Total Donations</p>
              <p className="text-2xl font-bold text-black">${totalDonations.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-black">Total Donors</p>
              <p className="text-2xl font-bold text-black">{totalDonors}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <HeartIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-black">Average Donation</p>
              <p className="text-2xl font-bold text-black">${averageDonation.toFixed(0)}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <CurrencyDollarIcon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-black">Active Methods</p>
              <p className="text-2xl font-bold text-black">{paymentMethods.filter(p => p.isActive).length}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <CreditCardIcon className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('payment-methods')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'payment-methods'
                ? 'border-blue-500 text-white'
                : 'border-transparent text-white hover:text-white hover:border-gray-300'
            }`}
          >
            <CreditCardIcon className="w-5 h-5 inline mr-2" />
            Payment Methods
          </button>
          <button
            onClick={() => setActiveTab('donors')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'donors'
                ? 'border-blue-500 text-white'
                : 'border-transparent text-white hover:text-white hover:border-gray-300'
            }`}
          >
            <UserGroupIcon className="w-5 h-5 inline mr-2" />
            Donors
          </button>
          <button
            onClick={() => setActiveTab('donations')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'donations'
                ? 'border-blue-500 text-white'
                : 'border-transparent text-white hover:text-white hover:border-gray-300'
            }`}
          >
            <HeartIcon className="w-5 h-5 inline mr-2" />
            Donations
          </button>
        </nav>
      </div>

      {/* Payment Methods Tab */}
      {activeTab === 'payment-methods' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search payment methods..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-black"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <button
              onClick={handleAddPaymentMethod}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Add Payment Method</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPaymentMethods.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <CreditCardIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No Payment Methods</h3>
                <p className="text-gray-300 mb-4">Get started by adding your first payment method.</p>
                <button
                  onClick={handleAddPaymentMethod}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Add Payment Method
                </button>
              </div>
            ) : (
              filteredPaymentMethods.map((method) =>
                <div key={method.id} className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      {getPaymentMethodIcon(method.type)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-black">{method.name}</h3>
                      <p className="text-sm text-black capitalize">{method.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleTogglePaymentMethod(method.id)}
                      className={`p-1 rounded ${
                        method.isActive ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-50'
                      }`}
                    >
                      {method.isActive ? <CheckCircleIcon className="w-5 h-5" /> : <XCircleIcon className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={() => handleEditPaymentMethod(method)}
                      className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeletePaymentMethod(method.id)}
                      className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {method.details.accountNumber && (
                    <div className="text-sm">
                      <span className="text-black font-medium">Account:</span>
                      <span className="ml-2 font-mono text-black">****{method.details.accountNumber.slice(-4)}</span>
                    </div>
                  )}
                  {method.details.email && (
                    <div className="text-sm">
                      <span className="text-black font-medium">Email:</span>
                      <span className="ml-2 text-black">{method.details.email}</span>
                    </div>
                  )}
                  {method.details.walletAddress && (
                    <div className="text-sm">
                      <span className="text-black font-medium">Wallet:</span>
                      <span className="ml-2 font-mono text-black">{method.details.walletAddress.slice(0, 8)}...{method.details.walletAddress.slice(-8)}</span>
                    </div>
                  )}
                  {method.details.phone && (
                    <div className="text-sm">
                      <span className="text-black font-medium">Phone:</span>
                      <span className="ml-2 text-black">{method.details.phone}</span>
                    </div>
                  )}
                </div>

                {method.qrCode && (
                  <div className="flex items-center justify-center mb-4">
                    <img src={method.qrCode} alt="QR Code" className="w-24 h-24 border rounded" />
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-black">
                  <span>Created: {new Date(method.createdAt).toLocaleDateString()}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    method.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {method.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* Donors Tab */}
      {activeTab === 'donors' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="name">Sort by Name</option>
                <option value="amount">Sort by Amount</option>
                <option value="date">Sort by Last Donation</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                {sortOrder === 'asc' ? <ArrowUpIcon className="w-5 h-5" /> : <ArrowDownIcon className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Donor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Total Donated
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Donations
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Last Donation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedDonors.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <UserGroupIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Donors Yet</h3>
                      <p className="text-gray-500">Donors will appear here once donations are received.</p>
                    </td>
                  </tr>
                ) : (
                  sortedDonors.map((donor) =>
                    <tr key={donor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {donor.avatar ? (
                            <img className="h-10 w-10 rounded-full" src={donor.avatar} alt="" />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-700">
                                {donor.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-black">{donor.name}</div>
                          <div className="text-sm text-black">
                            {donor.email || 'No email'}
                            {donor.isAnonymous && (
                              <span className="ml-2 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                                Anonymous
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-black font-semibold">${donor.totalDonated.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-black">{donor.donationCount}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-black">{new Date(donor.lastDonation).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleViewDonor(donor)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <EyeIcon className="w-5 h-5" />
                      </button>
                    </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Donations Tab */}
      {activeTab === 'donations' && (
        <div>
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Donor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Message
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {donors.length === 0 || donors.every(donor => donor.donations.length === 0) ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <HeartIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Donations Yet</h3>
                      <p className="text-gray-500">Individual donations will be displayed here once received.</p>
                    </td>
                  </tr>
                ) : (
                  donors.flatMap(donor => 
                    donor.donations.map(donation =>
                    <tr key={donation.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                        {new Date(donation.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                        {donation.isAnonymous ? 'Anonymous' : donor.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-black">
                        ${donation.amount.toLocaleString()} {donation.currency}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                        {donation.paymentMethod}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          donation.status === 'completed' ? 'bg-green-100 text-green-800' :
                          donation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {donation.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-black max-w-xs truncate">
                        {donation.message || '-'}
                      </td>
                    </tr>
                    )
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Payment Method Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-black">
                {editingPayment ? 'Edit Payment Method' : 'Add Payment Method'}
              </h2>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircleIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Payment Method Name
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingPayment?.name}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-black"
                  placeholder="e.g., Primary Bank Account"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Type
                </label>
                <select
                  name="type"
                  defaultValue={editingPayment?.type || 'bank'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                >
                  <option value="bank">Bank Account</option>
                  <option value="digital">Digital Wallet</option>
                  <option value="crypto">Cryptocurrency</option>
                  <option value="mobile">Mobile Payment</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Account Details
                </label>
                <textarea
                  name="details"
                  rows={3}
                  defaultValue={editingPayment ? JSON.stringify(editingPayment.details, null, 2) : '{}'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-black text-black"
                  placeholder='Enter account details (JSON format) e.g., {"accountNumber": "1234567890", "bankName": "Example Bank"}'
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  QR Code
                </label>
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={handleQRUpload}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-black"
                  >
                    <PhotoIcon className="w-5 h-5" />
                    <span>Upload QR Code</span>
                  </button>
                  {(uploadedQRCode || editingPayment?.qrCode) && (
                    <img 
                      src={uploadedQRCode || editingPayment?.qrCode} 
                      alt="QR Code Preview" 
                      className="w-16 h-16 border rounded" 
                    />
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  name="qr_code"
                  accept="image/*"
                  className="hidden"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  name="is_active"
                  defaultChecked={editingPayment?.isActive ?? true}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-black">
                  Active
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {editingPayment ? 'Update' : 'Add'} Payment Method
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Donor Details Modal */}
      {showDonorModal && selectedDonor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Donor Details</h2>
              <button
                onClick={() => setShowDonorModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircleIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                {selectedDonor.avatar ? (
                  <img className="h-16 w-16 rounded-full" src={selectedDonor.avatar} alt="" />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-xl font-medium text-gray-700">
                      {selectedDonor.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{selectedDonor.name}</h3>
                  <p className="text-gray-600">{selectedDonor.email}</p>
                  {selectedDonor.country && (
                    <p className="text-sm text-gray-500">{selectedDonor.country}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-600 font-medium">Total Donated</p>
                  <p className="text-2xl font-bold text-green-700">${selectedDonor.totalDonated.toLocaleString()}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-600 font-medium">Donations</p>
                  <p className="text-2xl font-bold text-blue-700">{selectedDonor.donationCount}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-purple-600 font-medium">Last Donation</p>
                  <p className="text-sm font-bold text-purple-700">{new Date(selectedDonor.lastDonation).toLocaleDateString()}</p>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-3">Donation History</h4>
                <div className="space-y-2">
                  {selectedDonor.donations.map((donation) => (
                    <div key={donation.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">${donation.amount.toLocaleString()} {donation.currency}</p>
                        <p className="text-sm text-gray-600">{donation.paymentMethod} • {new Date(donation.date).toLocaleDateString()}</p>
                        {donation.message && (
                          <p className="text-sm text-gray-500 mt-1">"{donation.message}"</p>
                        )}
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        donation.status === 'completed' ? 'bg-green-100 text-green-800' :
                        donation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {donation.status}
                      </span>
                    </div>
                  ))}
                  {selectedDonor.donations.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No donation history available</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDonate;
