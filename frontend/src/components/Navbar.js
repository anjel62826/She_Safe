import React from 'react';
import { Heart, MapPin, Users, BookOpen, AlertCircle, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <nav className="bg-gradient-to-r from-primary to-secondary shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Heart className="text-white" size={32} />
            <span className="text-white font-bold text-2xl">She_Safe</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-6 items-center">
            {isAuthenticated && (
              <>
                <a href="/dashboard" className="text-white hover:bg-accent px-3 py-2 rounded-lg transition">
                  Dashboard
                </a>
                <a href="/buddies" className="text-white hover:bg-accent px-3 py-2 rounded-lg transition">
                  Find Buddies
                </a>
                <a href="/blogs" className="text-white hover:bg-accent px-3 py-2 rounded-lg transition">
                  Experiences
                </a>
                <a href="/messages" className="text-white hover:bg-accent px-3 py-2 rounded-lg transition">
                  Messages
                </a>
              </>
            )}
            <div className="flex gap-2">
              {isAuthenticated ? (
                <>
                  <div className="text-white px-3 py-2">Hi, {user?.firstName}</div>
                  <button
                    onClick={logout}
                    className="bg-white text-primary px-4 py-2 rounded-lg font-medium hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <a href="/login" className="bg-white text-primary px-4 py-2 rounded-lg font-medium hover:bg-gray-100">
                    Login
                  </a>
                  <a href="/signup" className="bg-accent text-white px-4 py-2 rounded-lg font-medium hover:bg-primary">
                    Sign Up
                  </a>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-white border-opacity-30">
            {isAuthenticated && (
              <>
                <a href="/dashboard" className="block text-white hover:bg-accent px-3 py-2 rounded-lg transition">
                  Dashboard
                </a>
                <a href="/buddies" className="block text-white hover:bg-accent px-3 py-2 rounded-lg transition">
                  Find Buddies
                </a>
                <a href="/blogs" className="block text-white hover:bg-accent px-3 py-2 rounded-lg transition">
                  Experiences
                </a>
                <a href="/messages" className="block text-white hover:bg-accent px-3 py-2 rounded-lg transition">
                  Messages
                </a>
              </>
            )}
            {isAuthenticated ? (
              <button
                onClick={logout}
                className="w-full mt-4 bg-white text-primary px-4 py-2 rounded-lg font-medium hover:bg-gray-100"
              >
                Logout
              </button>
            ) : (
              <div className="flex gap-2 mt-4">
                <a href="/login" className="flex-1 bg-white text-primary px-4 py-2 rounded-lg font-medium text-center hover:bg-gray-100">
                  Login
                </a>
                <a href="/signup" className="flex-1 bg-accent text-white px-4 py-2 rounded-lg font-medium text-center hover:bg-primary">
                  Sign Up
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
