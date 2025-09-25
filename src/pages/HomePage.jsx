import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Newsletter from '../sections/Newsletter';
import Testimonials from '../sections/Testimonials';
import Footer from '../sections/Footer';

const initialRows = [
  { id: 42, number: 'Bus 42', route: 'KonchaBhanwar to BusStand', status: 'Arriving in 3 minutes' },
  { id: 7, number: 'Bus 7', route: 'Railway-Station to Manik-Chowk', status: 'In 10 minutes' },
  { id: 15, number: 'Bus 15', route: 'Awas Vikas to BIET', status: 'In 20 minutes' },
];

const features = [
  { title: 'Live tracking', desc: 'See buses moving in real-time on Google Maps.', icon: '🛰️' },
  { title: 'Seat availability', desc: 'Know how many seats are free before you board.', icon: '💺' },
  { title: 'Smart search', desc: 'Search by number, route, or stop in seconds.', icon: '🔎' },
  { title: 'Secure bookings', desc: 'Reserve seats and keep your plans flexible.', icon: '🔐' },
];

const popularRoutes = [
  { id: 1, name: 'KonchaBhanwar → BusStand', time: 'Every 8 min', buses: ['42', '18', '81'] },
  { id: 2, name: 'Railway-Station → Manik-Chowk', time: 'Every 10 min', buses: ['7', '53'] },
  { id: 3, name: 'Awas Vikas → BIET', time: 'Every 12 min', buses: ['15', '22'] },
  { id: 4, name: 'Prem Nagar → Garhmau', time: 'Every 15 min', buses: ['101'] },
];

const HomePage = () => {
  const [query, setQuery] = useState('');
  const [rows, setRows] = useState(initialRows);

  const onSearch = (e) => {
    e.preventDefault();
    const q = query.trim().toLowerCase();
    if (!q) { setRows(initialRows); return; }
    setRows(initialRows.filter(r => r.number.toLowerCase().includes(q) || r.route.toLowerCase().includes(q)));
  };

  return (
    <>
      <main className="bg-white text-gray-900">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-blue-50 via-white to-white" />
          <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-200/30 blur-3xl" />

          <div className="max-w-3xl mx-auto px-4 pt-16 pb-12 text-center">
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight">
              Track your <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">bus</span>
            </h2>
            <p className="mt-3 text-2xl text-gray-600">Live bus tracking</p>

            {/* search */}
            <form onSubmit={onSearch} className="mt-8">
              <div className="relative">
                <svg className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Enter bus number or route"
                  className="w-full rounded-2xl border border-gray-200 bg-white/80 pl-12 pr-4 py-4 text-lg shadow-sm ring-1 ring-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="mt-4 w-full rounded-2xl bg-blue-600 px-6 py-4 text-white text-xl font-semibold shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition"
              >
                Search
              </button>
              <p className="mt-3 text-sm text-gray-500">Click a bus below to open the live map.</p>
            </form>
          </div>
        </section>

        {/* Live bus status table */}
        <section className="max-w-5xl mx-auto px-4 pb-20">
          <h3 className="text-4xl font-bold">Live bus status</h3>
          <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-gray-50/80">
                <tr>
                  <th className="px-6 py-4 text-lg font-semibold text-gray-700">Bus Number</th>
                  <th className="px-6 py-4 text-lg font-semibold text-gray-700">Route</th>
                  <th className="px-6 py-4 text-lg font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {rows.map((r, i) => (
                  <tr key={r.id} className={(i % 2 ? 'bg-white' : 'bg-gray-50') + ' hover:bg-blue-50 transition-colors'}>
                    <td className="px-6 py-6 text-xl">
                      <Link to={`/map/${r.id}`} className="text-blue-700 underline hover:text-blue-800">{r.number}</Link>
                    </td>
                    <td className="px-6 py-6 text-xl text-gray-700">{r.route}</td>
                    <td className="px-6 py-6 text-xl text-gray-700">{r.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Popular routes */}
        <section className="max-w-6xl mx-auto px-4 pb-16">
          <div className="flex items-end justify-between">
            <h3 className="text-3xl font-bold">Popular routes</h3>
            <Link to="/buses" className="text-blue-600 hover:underline">See all buses →</Link>
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularRoutes.map(r => (
              <div key={r.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow">
                <h4 className="text-lg font-semibold">{r.name}</h4>
                <p className="text-sm text-gray-600">Frequency: {r.time}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {r.buses.map(b => (
                    <Link key={b} to={`/map/${b}`} className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 hover:bg-blue-100">Bus {b}</Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>


        {/* CTA banner - black background */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-black" />
          <div className="max-w-6xl mx-auto px-4 py-12 text-center">
            <h3 className="text-3xl font-bold text-black">Ready to ride smarter?</h3>
            <p className="mt-2 text-black-200">Track your bus live and book seats ahead of time.</p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/buses" className="rounded-xl bg-white px-6 py-3 font-semibold text-black hover:bg-gray-100">Browse buses</Link>
              <Link to="/bookings" className="rounded-xl bg-white/10 px-6 py-3 font-semibold text-white ring-1 ring-white/30 hover:bg-white/20">Book a seat</Link>
            </div>
          </div>
        </section>
        {/* Feature grid (moved below popular routes) */}
        <section className="max-w-6xl mx-auto px-4 pb-16">
          <h3 className="text-3xl font-bold text-center">Why ride with us</h3>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div key={f.title} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow transition-shadow">
                <div className="text-3xl">{f.icon}</div>
                <h4 className="mt-3 text-xl font-semibold">{f.title}</h4>
                <p className="mt-1 text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>


        <Testimonials />
        <Newsletter />
      </main>

   
    </>
  );
};

export default HomePage;
