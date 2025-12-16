import React, { useMemo } from "react";
import { Link, NavLink } from "react-router-dom";

const Navbar = () => {
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  }, []);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/buses", label: "Buses" },
    { to: "/bookings", label: "My Bookings" },
    { to: "/timetable", label: "Timetable" },
    { to: "/favorites", label: "Favorites" },
  ];

  return (
    <nav className="sticky top-0 z-30 bg-white/90 dark:bg-dark-surface/90 border-b border-gray-200 dark:border-dark-border backdrop-blur">
      <div className="mx-auto max-w-6xl px-5">
        <div className="flex h-16 items-center justify-between gap-8">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo-bus.svg" alt="logo" className="h-9 w-9 drop-shadow-sm" />
            <span className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-dark-text-primary">Where is my bus?</span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex flex-1 justify-center">
            <div className="flex items-center gap-9">
              {navLinks.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg text-sm font-semibold tracking-wide transition-colors
                    ${isActive
                      ? "text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-dark-hover"
                      : "text-gray-700 dark:text-dark-text-primary hover:bg-gray-100 dark:hover:bg-dark-hover hover:text-blue-600 dark:hover:text-blue-400"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">

            {/* Search */}
            <div className="hidden sm:flex items-center gap-2 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card px-3 py-2">
              <svg
                className="h-4 w-4 text-gray-500 dark:text-dark-text-muted"
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
                className="w-40 bg-transparent text-sm text-gray-900 dark:text-dark-text-primary placeholder:text-gray-400 dark:placeholder:text-dark-text-muted focus:outline-none"
              />
            </div>

            {/* CONDITIONAL RENDER */}
            {!user ? (
              <Link
                to="/login"
                className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-white font-semibold shadow-md shadow-blue-600/25 hover:from-blue-700 hover:to-indigo-700 transition"
              >
                Login
              </Link>
            ) : (
              <div className="flex items-center gap-3 bg-gray-100 dark:bg-dark-card px-3 py-2 rounded-xl border border-gray-200 dark:border-dark-border">
                <div className="relative h-8 w-8">
                  {user.profilePicture || user.picture ? (
                    <img
                      src={user.profilePicture || user.picture}
                      alt="avatar"
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
                      {(user.username || user.name || "U").charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-dark-text-primary">
                  {user.username || user.name || user.email}
                </span>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
