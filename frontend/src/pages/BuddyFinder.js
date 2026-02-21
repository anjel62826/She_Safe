import React, { useState, useEffect } from 'react';
import { Users, MapPin, Calendar, DollarSign, Heart, Star } from 'lucide-react';
import { buddyService } from '../services/api';

const BuddyFinder = () => {
  const [buddies, setBuddies] = useState([]);
  const [filters, setFilters] = useState({
    destination: '',
    budget: 'all',
    interests: [],
    startDate: '',
    endDate: ''
  });
  const [loading, setLoading] = useState(false);
  const [buddyRequests, setBuddyRequests] = useState({});

  useEffect(() => {
    loadBuddies();
  }, [filters]);

  const loadBuddies = async () => {
    setLoading(true);
    try {
      const filterParams = {
        ...(filters.destination && { destination: filters.destination }),
        ...(filters.budget !== 'all' && { budget: filters.budget }),
        ...(filters.interests.length > 0 && { interests: filters.interests })
      };
      const response = await buddyService.findBuddies(filterParams);
      setBuddies(response.buddies);
    } catch (error) {
      console.error('Error loading buddies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async (buddyId) => {
    try {
      await buddyService.sendBuddyRequest(
        buddyId,
        'Hi, would you like to be travel buddies?',
        filters.destination,
        filters.startDate,
        filters.endDate,
        'solo'
      );
      setBuddyRequests(prev => ({ ...prev, [buddyId]: true }));
    } catch (error) {
      alert('Error sending buddy request: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Find Your Travel Buddy</h1>

        {/* Filters */}
        <div className="card mb-8">
          <h2 className="text-xl font-bold mb-6">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Destination</label>
              <input
                type="text"
                value={filters.destination}
                onChange={(e) => setFilters({ ...filters, destination: e.target.value })}
                className="input-field"
                placeholder="e.g., Paris, Thailand..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Budget</label>
              <select
                value={filters.budget}
                onChange={(e) => setFilters({ ...filters, budget: e.target.value })}
                className="input-field"
              >
                <option value="all">All Budgets</option>
                <option value="budget">Budget</option>
                <option value="mid-range">Mid-range</option>
                <option value="luxury">Luxury</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Start Date</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">End Date</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Buddies Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          </div>
        ) : buddies.length === 0 ? (
          <div className="card text-center py-12">
            <Users size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg">No buddies found. Try adjusting your filters!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {buddies.map((buddy) => (
              <div key={buddy._id} className="card overflow-hidden hover:shadow-xl transition">
                {/* Profile Header */}
                <div className="flex items-center gap-4 mb-4 pb-4 border-b">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xl">
                    {buddy.firstName[0]}{buddy.lastName[0]}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">
                      {buddy.firstName} {buddy.lastName}
                      {buddy.isVerified && <span className="text-primary ml-2">✓</span>}
                    </h3>
                    <div className="flex gap-2 mt-1">
                      {buddy.interests && buddy.interests.slice(0, 2).map((interest, i) => (
                        <span key={i} className="badge badge-success text-xs">{interest}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-3 mb-4 text-sm">
                  {buddy.travelHistory && buddy.travelHistory[0] && (
                    <>
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-primary" />
                        <span>{buddy.travelHistory[0].destination}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-primary" />
                        <span>{new Date(buddy.travelHistory[0].startDate).toLocaleDateString()}</span>
                      </div>
                    </>
                  )}
                  {buddy.budget && (
                    <div className="flex items-center gap-2">
                      <DollarSign size={16} className="text-primary" />
                      <span>{buddy.budget}</span>
                    </div>
                  )}
                </div>

                {/* Bio */}
                {buddy.bio && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{buddy.bio}</p>
                )}

                {/* Action Button */}
                <button
                  onClick={() => handleSendRequest(buddy._id)}
                  disabled={buddyRequests[buddy._id]}
                  className="btn btn-secondary w-full py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {buddyRequests[buddy._id] ? '✓ Request Sent' : 'Send Request'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BuddyFinder;
