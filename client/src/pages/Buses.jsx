import React, { useMemo, useState } from 'react';

const SAMPLE_BUSES = [
  { id: 1, number: '42', city: 'Jhansi', route: 'KonchaBhanwar ↔ BusStand', location: 'Bye Pass', seats: 8 },
  { id: 2, number: '7', city: 'Jhansi', route: 'Railway-Station ↔ Manik-Chowk', location: 'BKD Chaurah', seats: 2 },
  { id: 3, number: '15', city: 'Jhansi', route: 'Sipri ↔ Medical College', location: 'Elite Chaurah', seats: 14 },
  { id: 4, number: '101', city: 'Jhansi', route: 'Prem Nagar ↔ Garhmau', location: 'BU', seats: 0 },
  { id: 5, number: '22', city: 'Jhansi', route: 'Awas Vikas ↔ BIET ', location: 'Medical Gate No-3', seats: 5 },
];

const Buses = () => {
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return SAMPLE_BUSES;
    return SAMPLE_BUSES.filter(b =>
      b.number.toLowerCase().includes(s) ||
      b.city.toLowerCase().includes(s) ||
      b.route.toLowerCase().includes(s) ||
      b.location.toLowerCase().includes(s)
    );
  }, [q]);

  return (
    <main className="max-w-5xl mx-auto px-4 py-8 bg-white dark:bg-dark-bg min-h-[calc(100vh-64px)] transition-colors duration-200">
      <div className="mb-4">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-dark-text-primary">Available buses</h2>
        <p className="text-gray-600 dark:text-dark-text-secondary">Search by bus number, route, city or stop location.</p>
      </div>

      <div className="rounded-2xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-surface p-4 shadow-sm">
        <form onSubmit={(e)=>e.preventDefault()} className="flex items-center gap-3">
          <div className="relative flex-1 min-w-0">
            <svg className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-dark-text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
            <input
              type="search"
              value={q}
              onChange={(e)=>setQ(e.target.value)}
              placeholder="Search buses by number, city, route, location"
              className="w-full rounded-xl border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-card pl-10 pr-4 py-3 text-gray-900 dark:text-dark-text-primary placeholder:text-gray-400 dark:placeholder:text-dark-text-muted focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
            />
          </div>
          <button type="submit" className="rounded-xl bg-blue-600 dark:bg-blue-500 px-5 py-3 text-white font-semibold shadow-sm hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">Search</button>
        </form>

        <div className="mt-5 overflow-hidden rounded-xl border border-gray-200 dark:border-dark-border">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-dark-card">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-gray-700 dark:text-dark-text-primary">Bus</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-700 dark:text-dark-text-primary">Route</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-700 dark:text-dark-text-primary">Current location</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-700 dark:text-dark-text-primary">Seats available</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-dark-border">
              {filtered.map(b => (
                <tr key={b.id} className="bg-white dark:bg-dark-surface hover:bg-gray-50 dark:hover:bg-dark-card transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900 dark:text-dark-text-primary">Bus {b.number}</div>
                    <div className="text-sm text-gray-500 dark:text-dark-text-muted">{b.city}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-700 dark:text-dark-text-secondary">{b.route}</td>
                  <td className="px-6 py-4 text-gray-700 dark:text-dark-text-secondary">{b.location}</td>
                  <td className="px-6 py-4">
                    <span className={b.seats > 0 ? 'inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/30 px-3 py-1 text-sm font-medium text-green-700 dark:text-green-400' : 'inline-flex items-center rounded-full bg-red-100 dark:bg-red-900/30 px-3 py-1 text-sm font-medium text-red-700 dark:text-red-400'}>
                      {b.seats > 0 ? `${b.seats} seats` : 'Full'}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-6 text-center text-gray-600 dark:text-dark-text-secondary">No buses found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default Buses;
