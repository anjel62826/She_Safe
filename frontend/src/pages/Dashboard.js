import React from 'react';
import { AlertCircle, Users, MessageSquare, MapPin, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import MyScheduleModal from '../components/MyScheduleModal';
import ChatBotModal from '../components/ChatBotModal';

const Dashboard = () => {
  const { user } = useAuth();
  const [showScheduleModal, setShowScheduleModal] = React.useState(false);
  const [showChatBot, setShowChatBot] = React.useState(false);
  const [metrics, setMetrics] = React.useState({
    buddyRequests: 3,
    unreadMessages: 5,
    activeAlerts: 0,
    currentTrips: 1
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-light to-gray-50 dark:from-dark dark:to-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary to-secondary rounded-lg shadow-lg p-8 mb-8 text-white">
          <h1 className="text-4xl font-bold mb-2">Welcome back, {user.firstName}! 👋</h1>
          <p className="text-lg opacity-90">Stay safe, stay connected with our community</p>
          {user?.isVerified && (
            <div className="mt-4 inline-block bg-white bg-opacity-20 px-4 py-2 rounded-lg">
              ✓ Verified Badge Holder
            </div>
          )}
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Buddy Requests */}
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Buddy Requests</p>
                <p className="text-3xl font-bold text-primary mt-2">{metrics.buddyRequests}</p>
              </div>
              <Users className="text-primary opacity-30" size={48} />
            </div>
            <a href="/buddies/requests" className="text-primary hover:text-accent text-sm mt-4 inline-block">
              View all →
            </a>
          </div>

          {/* Unread Messages */}
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Unread Messages</p>
                <p className="text-3xl font-bold text-secondary mt-2">{metrics.unreadMessages}</p>
              </div>
              <MessageSquare className="text-secondary opacity-30" size={48} />
            </div>
            <a href="/messages" className="text-secondary hover:text-primary text-sm mt-4 inline-block">
              View all →
            </a>
          </div>

          {/* Active Alerts */}
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Active Alerts</p>
                <p className="text-3xl font-bold text-warning mt-2">{metrics.activeAlerts}</p>
              </div>
              <AlertCircle className="text-warning opacity-30" size={48} />
            </div>
            <a href="/emergency" className="text-warning hover:text-danger text-sm mt-4 inline-block">
              View all →
            </a>
          </div>

          {/* Current Trips */}
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Current Trips</p>
                <p className="text-3xl font-bold text-success mt-2">{metrics.currentTrips}</p>
              </div>
              <MapPin className="text-success opacity-30" size={48} />
            </div>
            <a href="/travel-plans" className="text-success hover:text-green-700 text-sm mt-4 inline-block">
              Manage →
            </a>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <button className="btn btn-primary text-lg py-4 flex items-center justify-center gap-2">
            <AlertCircle size={20} />
            Emergency SOS
          </button>
          <button className="btn btn-secondary text-lg py-4 flex items-center justify-center gap-2">
            <Users size={20} />
            Find Buddy
          </button>
          <button 
            onClick={() => setShowScheduleModal(true)}
            className="btn btn-outline text-lg py-4 flex items-center justify-center gap-2 hover:bg-primary hover:text-white hover:border-primary"
          >
            <Calendar size={20} />
            My Schedule
          </button>
          <button 
            onClick={() => setShowChatBot(true)}
            className="btn btn-outline text-lg py-4 flex items-center justify-center gap-2">
            <MessageSquare size={20} />
            Chat Bot
          </button>
        </div>

        {/* Safety Tips */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 pb-3 border-b">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <p className="text-sm">You accepted Priya's buddy request</p>
                <span className="text-xs text-gray-500 ml-auto">2h ago</span>
              </div>
              <div className="flex items-center gap-3 pb-3 border-b">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <p className="text-sm">New message from Sarah</p>
                <span className="text-xs text-gray-500 ml-auto">4h ago</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-secondary rounded-full"></div>
                <p className="text-sm">Posted a new travel experience</p>
                <span className="text-xs text-gray-500 ml-auto">1d ago</span>
              </div>
            </div>
          </div>

          {/* Safety Tips */}
          <div className="card bg-blue-50 dark:bg-blue-900 border-l-4 border-primary">
            <h2 className="text-xl font-bold mb-4">Today's Safety Tip 💡</h2>
            <p className="text-sm leading-relaxed mb-4">
              Always share your travel itinerary with trusted contacts. Include your flight details, accommodation address, and contact numbers of people you'll meet.
            </p>
            <button className="text-primary hover:text-accent font-medium text-sm">
              View more tips →
            </button>
          </div>
        </div>

        {/* My Schedule Modal */}
        <MyScheduleModal 
          isOpen={showScheduleModal}
          onClose={() => setShowScheduleModal(false)}
          onSuccess={() => {
            // Refresh metrics or travel plans if needed
            console.log('Travel plan created successfully');
          }}
        />

        {/* ChatBot Modal */}
        <ChatBotModal
          isOpen={showChatBot}
          onClose={() => setShowChatBot(false)}
        />
      </div>
    </div>
  );
};

export default Dashboard;
