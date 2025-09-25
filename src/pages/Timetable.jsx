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
    <main className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-900">Timetable</h2>
      <p className="text-gray-600">Next arrivals are based on an average headway for this route.</p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Route</label>
          <select value={routeId} onChange={(e)=>{ setRouteId(e.target.value); setStop(DATA[e.target.value].stops[0]); }} className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            {Object.entries(DATA).map(([id, r]) => (
              <option key={id} value={id}>{r.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Stop</label>
          <select value={stop} onChange={(e)=>setStop(e.target.value)} className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            {route.stops.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="rounded-xl bg-gray-50 border border-gray-200 px-4 py-3">
          <div className="text-sm text-gray-600">Average frequency</div>
          <div className="text-lg font-semibold">Every {route.headwayMin} minutes</div>
        </div>
      </div>

      <section className="mt-6 rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-sm font-semibold text-gray-700">Arrival time</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-700">Countdown</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {arrivals.map((t, i) => {
              const mm = t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              const remaining = Math.max(0, Math.round((t.getTime() - Date.now()) / 60000));
              return (
                <tr key={i} className="bg-white">
                  <td className="px-6 py-4 text-gray-900">{mm}</td>
                  <td className="px-6 py-4 text-gray-700">{remaining} min</td>
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
