import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsProfileOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen]);

  // Get user initials for avatar
  const getUserInitials = () => {
    if (user?.username) {
      return user.username.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-20">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center">
        {/* Left side: Logo + Title */}
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo-bus.svg" alt="Where is my bus?" className="h-8 w-8" />
          <h1 className="text-2xl font-bold text-black">Where is my bus?</h1>
        </Link>

        {/* Right side: Navigation */}
        <nav className="ml-auto">
          <ul className="flex items-center gap-6 text-black">
            <li>
              <Link to="/" className="text-black hover:text-gray-900">Home</Link>
            </li>
            <li>
              <Link to="/buses" className="text-black hover:text-gray-900">Buses</Link>
            </li>
            <li>
              <Link to="/bookings" className="text-black hover:text-gray-900">My Bookings</Link>
            </li>
            <li>
              <Link to="/timetable" className="text-black hover:text-gray-900">Timetable</Link>
            </li>
            <li>
              <Link to="/favorites" className="text-black hover:text-gray-900">Favorites</Link>
            </li>
            <li>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const input = e.currentTarget.querySelector('input');
                  const value = input?.value?.trim();
                  if (value) window.location.assign(`/map/${encodeURIComponent(value)}`);
                }}
                className="relative"
              >
                <svg
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
                <input
                  type="search"
                  placeholder="Search buses"
                  className="w-44 rounded-lg border border-gray-300 bg-white pl-8 pr-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </form>
            </li>
            {isAuthenticated ? (
              <li className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className={`flex items-center gap-3 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2.5 shadow-sm hover:shadow-md hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    isProfileOpen ? 'shadow-md from-blue-100 to-indigo-100' : ''
                  }`}
                >
                  {/* User Avatar with Gradient */}
                  <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold text-sm shadow-lg ring-2 ring-white">
                    {getUserInitials()}
                  </div>
                  {/* Username */}
                  <span className="hidden sm:block text-sm font-semibold text-gray-800">
                    {user?.username || user?.email?.split('@')[0]}
                  </span>
                  {/* Dropdown Arrow */}
                  <svg
                    className={`h-4 w-4 text-gray-600 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Enhanced Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-3 w-64 rounded-2xl bg-white shadow-xl border border-gray-100 overflow-hidden z-50 profile-dropdown">
                    {/* User Info Section with Gradient Background */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-4 text-white">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white font-bold text-lg ring-2 ring-white/30">
                          {getUserInitials()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-bold truncate">
                            {user?.username || 'User'}
                          </p>
                          <p className="text-xs text-blue-100 truncate mt-0.5">
                            {user?.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <Link
                        to="/bookings"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-blue-50 transition-colors group"
                      >
                        <svg className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <span>My Bookings</span>
                        <svg className="ml-auto h-4 w-4 text-gray-300 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                      <Link
                        to="/favorites"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-blue-50 transition-colors group"
                      >
                        <svg className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span>Favorites</span>
                        <svg className="ml-auto h-4 w-4 text-gray-300 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                      <Link
                        to="/tickets"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-blue-50 transition-colors group"
                      >
                        <svg className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                        </svg>
                        <span>My Tickets</span>
                        <svg className="ml-auto h-4 w-4 text-gray-300 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-100"></div>

                    {/* Logout Button */}
                    <div className="p-2">
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-5 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors group"
                      >
                        <svg className="h-5 w-5 text-red-500 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ) : (
              <li>
                <Link
                  to="/login"
                  className="inline-flex items-center rounded-xl bg-blue-100 px-4 py-2 font-semibold shadow-sm text-black hover:bg-blue-200 transition"
                >
                  Login
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
