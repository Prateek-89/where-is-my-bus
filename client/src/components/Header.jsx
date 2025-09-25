import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
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
            <li>
              <Link
                to="/login"
                className="inline-flex items-center rounded-xl bg-blue-100 px-4 py-2 font-semibold shadow-sm text-black hover:bg-blue-100 transition"
              >
                Login
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
