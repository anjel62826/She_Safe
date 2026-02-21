import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Shield, Users, MessageSquare, MapPin, AlertCircle, BookOpen, Smartphone, Calendar } from 'lucide-react';

const Home = () => {
  return (
    <div className="bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary via-secondary to-accent text-white py-20 px-4">
        <div className="container mx-auto text-center max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Your Safe Travel Companion</h1>
          <p className="text-xl mb-8 opacity-90">
            Connect safely with verified women travelers, get real-time emergency support, and explore the world with confidence
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/signup" className="btn btn-primary text-lg px-8 py-3">
              Get Started
            </Link>
            <Link to="/learn-more" className="btn bg-white text-primary text-lg px-8 py-3 hover:bg-gray-100">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Our Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Feature 1 */}
            <Link to="/verify" className="card group" role="button">
              <div className="bg-gradient-to-br from-primary to-secondary rounded-lg p-4 mb-4 w-16 h-16 flex items-center justify-center group-hover:scale-105 transition">
                <Shield className="text-white" size={32} />
              </div>
              <h3 className="font-bold text-lg mb-2">Verified Safety</h3>
              <p className="text-gray-600 dark:text-gray-400">DigiLocker verified profiles to prevent scams and fake accounts</p>
            </Link>

            {/* Feature 2 */}
            <Link to="/buddies/find" className="card group" role="button">
              <div className="bg-gradient-to-br from-secondary to-accent rounded-lg p-4 mb-4 w-16 h-16 flex items-center justify-center group-hover:scale-105 transition">
                <Users className="text-white" size={32} />
              </div>
              <h3 className="font-bold text-lg mb-2">Buddy Finder</h3>
              <p className="text-gray-600 dark:text-gray-400">Find verified travel companions based on destination and interests</p>
            </Link>

            {/* Feature 3: My Schedule */}
            <Link to="/travel-plans" className="card ring-2 ring-primary ring-opacity-50 hover:ring-opacity-100 transition group" role="button">
              <div className="bg-gradient-to-br from-primary to-secondary rounded-lg p-4 mb-4 w-16 h-16 flex items-center justify-center group-hover:scale-105 transition">
                <Calendar className="text-white" size={32} />
              </div>
              <h3 className="font-bold text-lg mb-2">My Schedule</h3>
              <p className="text-gray-600 dark:text-gray-400">Post your travel plans and find buddies with matching dates</p>
            </Link>

            {/* Feature 4 */}
            <Link to="/emergency" className="card group" role="button">
              <div className="bg-gradient-to-br from-accent to-primary rounded-lg p-4 mb-4 w-16 h-16 flex items-center justify-center group-hover:scale-105 transition">
                <AlertCircle className="text-white" size={32} />
              </div>
              <h3 className="font-bold text-lg mb-2">Emergency SOS</h3>
              <p className="text-gray-600 dark:text-gray-400">One-tap emergency button with instant location sharing and alerts</p>
            </Link>

            {/* Feature 5 */}
            <Link to="/tracking" className="card group" role="button">
              <div className="bg-gradient-to-br from-primary to-accent rounded-lg p-4 mb-4 w-16 h-16 flex items-center justify-center group-hover:scale-105 transition">
                <MapPin className="text-white" size={32} />
              </div>
              <h3 className="font-bold text-lg mb-2">Live Tracking</h3>
              <p className="text-gray-600 dark:text-gray-400">Real-time GPS tracking and safe route recommendations</p>
            </Link>

            {/* Feature 6 */}
            <Link to="/chat" className="card group" role="button">
              <div className="bg-gradient-to-br from-secondary to-primary rounded-lg p-4 mb-4 w-16 h-16 flex items-center justify-center group-hover:scale-105 transition">
                <MessageSquare className="text-white" size={32} />
              </div>
              <h3 className="font-bold text-lg mb-2">AI Chatbot</h3>
              <p className="text-gray-600 dark:text-gray-400">24/7 safety tips and emergency guidance</p>
            </Link>

            {/* Feature 7 */}
            <div className="card">
              <div className="bg-gradient-to-br from-primary to-secondary rounded-lg p-4 mb-4 w-16 h-16 flex items-center justify-center">
                <Heart className="text-white" size={32} />
              </div>
              <h3 className="font-bold text-lg mb-2">Community Support</h3>
              <p className="text-gray-600 dark:text-gray-400">Connect with the She_Safe community for support and advice</p>
            </div>

            {/* Feature 8 */}
            <div className="card">
              <div className="bg-gradient-to-br from-secondary to-accent rounded-lg p-4 mb-4 w-16 h-16 flex items-center justify-center">
                <Shield className="text-white" size={32} />
              </div>
              <h3 className="font-bold text-lg mb-2">Data Privacy</h3>
              <p className="text-gray-600 dark:text-gray-400">Women-only platform with end-to-end encryption</p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">50K+</div>
              <p className="text-gray-600 dark:text-gray-400">Verified Women Travelers</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-secondary mb-2">10K+</div>
              <p className="text-gray-600 dark:text-gray-400">Buddy Connections</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">95%</div>
              <p className="text-gray-600 dark:text-gray-400">Safety Rating</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-success mb-2">24/7</div>
              <p className="text-gray-600 dark:text-gray-400">Emergency Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-16 px-4">
        <div className="container mx-auto text-center max-w-2xl">
          <h2 className="text-4xl font-bold mb-4">Ready to Travel Safely?</h2>
          <p className="text-xl mb-8">Join thousands of women travelers who trust She_Safe</p>
          <Link to="/signup" className="btn bg-white text-primary px-8 py-3 text-lg font-bold hover:bg-gray-100">
            Create Your Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4">She_Safe</h4>
              <p className="text-sm opacity-70">Making solo travel safe for women worldwide</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-sm opacity-70">
                <li><a href="#" className="hover:text-primary">Features</a></li>
                <li><a href="#" className="hover:text-primary">Pricing</a></li>
                <li><a href="#" className="hover:text-primary">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm opacity-70">
                <li><a href="#" className="hover:text-primary">About</a></li>
                <li><a href="#" className="hover:text-primary">Blog</a></li>
                <li><a href="#" className="hover:text-primary">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm opacity-70">
                <li><a href="#" className="hover:text-primary">Privacy</a></li>
                <li><a href="#" className="hover:text-primary">Terms</a></li>
                <li><a href="#" className="hover:text-primary">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-sm opacity-70">
            <p>&copy; 2024 She_Safe. All rights reserved. Made with ❤️ for women travelers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
