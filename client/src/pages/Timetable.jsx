import React, { useMemo, useState } from 'react';

const DATA = {
  '42': {
    name: 'KonchaBhanwar ↔ BusStand',
    stops: ['KonchaBhanwar', 'Elite Chaurah', 'Bye Pass', 'BusStand'],
    headwayMin: 8,
  },
  '7': {
    name: 'Railway-Station ↔ Manik-Chowk',
    stops: ['Railway-Station', 'BKD Chaurah', 'Market', 'Manik-Chowk'],
    headwayMin: 10,
  },
};

function computeArrivals(now, headwayMin) {
  const list = [];
  let t = new Date(now);
  for (let i = 1; i <= 8; i++) {
    t = new Date(t.getTime() + headwayMin * 60 * 1000);
    list.push(t);
  }
  return list;
}

const Timetable = () => {
  const [routeId, setRouteId] = useState('42');
  const [stop, setStop] = useState('KonchaBhanwar');
  const route = DATA[routeId];
  const arrivals = useMemo(() => computeArrivals(Date.now(), route.headwayMin), [route]);

  return (
    <main className="max-w-5xl mx-auto px-4 py-8 bg-white dark:bg-dark-bg min-h-[calc(100vh-64px)] transition-colors duration-200">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-dark-text-primary">Timetable</h2>
      <p className="text-gray-600 dark:text-dark-text-secondary">Next arrivals are based on an average headway for this route.</p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-primary">Route</label>
          <select value={routeId} onChange={(e)=>{ setRouteId(e.target.value); setStop(DATA[e.target.value].stops[0]); }} className="mt-1 w-full rounded-xl border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-card px-3 py-2 text-gray-900 dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors">
            {Object.entries(DATA).map(([id, r]) => (
              <option key={id} value={id}>{r.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-primary">Stop</label>
          <select value={stop} onChange={(e)=>setStop(e.target.value)} className="mt-1 w-full rounded-xl border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-card px-3 py-2 text-gray-900 dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors">
            {route.stops.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="rounded-xl bg-gray-50 dark:bg-dark-card border border-gray-200 dark:border-dark-border px-4 py-3">
          <div className="text-sm text-gray-600 dark:text-dark-text-secondary">Average frequency</div>
          <div className="text-lg font-semibold dark:text-dark-text-primary">Every {route.headwayMin} minutes</div>
        </div>
      </div>

      <section className="mt-6 rounded-2xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-surface shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-dark-card">
            <tr>
              <th className="px-6 py-3 text-sm font-semibold text-gray-700 dark:text-dark-text-primary">Arrival time</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-700 dark:text-dark-text-primary">Countdown</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-dark-border">
            {arrivals.map((t, i) => {
              const mm = t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              const remaining = Math.max(0, Math.round((t.getTime() - Date.now()) / 60000));
              return (
                <tr key={i} className="bg-white dark:bg-dark-surface">
                  <td className="px-6 py-4 text-gray-900 dark:text-dark-text-primary">{mm}</td>
                  <td className="px-6 py-4 text-gray-700 dark:text-dark-text-secondary">{remaining} min</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </main>
  );
};

export default Timetable;
