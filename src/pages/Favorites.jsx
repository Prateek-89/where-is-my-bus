import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const KEY = 'wm_bus_favorites_v1';

const Favorites = () => {
  const [routes, setRoutes] = useState([]);
  const [stops, setStops] = useState([]);
  const [routeInput, setRouteInput] = useState('');
  const [stopInput, setStopInput] = useState('');

  useEffect(() => {
    try {
      const { routes: r = [], stops: s = [] } = JSON.parse(localStorage.getItem(KEY)) || {};
      setRoutes(r); setStops(s);
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify({ routes, stops }));
  }, [routes, stops]);

  const addRoute = () => {
    const v = routeInput.trim(); if (!v) return; if (routes.includes(v)) return; setRoutes([v, ...routes]); setRouteInput('');
  };
  const addStop = () => {
    const v = stopInput.trim(); if (!v) return; if (stops.includes(v)) return; setStops([v, ...stops]); setStopInput('');
  };

  const removeRoute = (v) => setRoutes(routes.filter(x => x !== v));
  const removeStop = (v) => setStops(stops.filter(x => x !== v));

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-900">Favorites</h2>
      <p className="text-gray-600">Save routes and stops for quick access.</p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="text-xl font-semibold">Routes</h3>
          <div className="mt-3 flex gap-2">
            <input value={routeInput} onChange={(e)=>setRouteInput(e.target.value)} placeholder="e.g., 42" className="flex-1 rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <button onClick={addRoute} className="rounded-xl bg-blue-600 px-4 py-2 text-white font-semibold hover:bg-blue-700">Add</button>
          </div>
          <ul className="mt-4 space-y-2">
            {routes.map(r => (
              <li key={r} className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2">
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">Route {r}</span>
                  <Link to={`/map/${r}`} className="text-sm text-blue-600 hover:underline">Track</Link>
                </div>
                <button onClick={()=>removeRoute(r)} className="text-sm text-gray-600 hover:text-gray-900">Remove</button>
              </li>
            ))}
            {routes.length === 0 && <li className="text-gray-600 text-sm">No favorite routes yet.</li>}
          </ul>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="text-xl font-semibold">Stops</h3>
          <div className="mt-3 flex gap-2">
            <input value={stopInput} onChange={(e)=>setStopInput(e.target.value)} placeholder="e.g., Elite Chaurah" className="flex-1 rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <button onClick={addStop} className="rounded-xl bg-blue-600 px-4 py-2 text-white font-semibold hover:bg-blue-700">Add</button>
          </div>
          <ul className="mt-4 space-y-2">
            {stops.map(s => (
              <li key={s} className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2">
                <span className="text-sm text-gray-900">{s}</span>
                <button onClick={()=>removeStop(s)} className="text-sm text-gray-600 hover:text-gray-900">Remove</button>
              </li>
            ))}
            {stops.length === 0 && <li className="text-gray-600 text-sm">No favorite stops yet.</li>}
          </ul>
        </div>
      </div>
    </main>
  );
};

export default Favorites;
