import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-30 border-b border-gray-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo-bus.svg" alt="logo" className="h-7 w-7" />
          <span className="text-xl font-bold text-gray-900">Where is my bus?</span>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-gray-900">
          <Link to="/" className="hover:text-blue-700">Home</Link>
          <Link to="/buses" className="hover:text-blue-700">Buses</Link>
          <Link to="/bookings" className="hover:text-blue-700">My Bookings</Link>
          <Link to="/tickets" className="hover:text-blue-700">Tickets</Link>
          <Link to="/timetable" className="hover:text-blue-700">Timetable</Link>
          <Link to="/favorites" className="hover:text-blue-700">Favorites</Link>
        </div>

        <div className="flex items-center gap-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const input = e.currentTarget.querySelector('input');
              const value = input?.value?.trim();
              if (value) window.location.assign(`/map/${encodeURIComponent(value)}`);
            }}
            className="relative hidden sm:block"
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
              className="w-48 rounded-lg border border-gray-300 bg-white pl-8 pr-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </form>
          <Link to="/login" className="rounded-xl bg-blue-600 px-4 py-2 text-white font-semibold hover:bg-blue-700">Login</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
