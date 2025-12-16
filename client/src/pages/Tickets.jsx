import React, { useMemo, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

const ROUTES = [
  { id: '42', name: 'KonchaBhanwar ↔ BusStand', fare: 20 },
  { id: '7', name: 'Railway-Station ↔ Manik-Chowk', fare: 18 },
  { id: '15', name: 'Awas Vikas ↔ BIET', fare: 22 },
];

const Tickets = () => {
  const [routeId, setRouteId] = useState('');
  const [pickup, setPickup] = useState('');
  const [drop, setDrop] = useState('');
  const [seats, setSeats] = useState(1);
  const [ticket, setTicket] = useState(null);

  const baseFare = useMemo(() => ROUTES.find(r => r.id === routeId)?.fare || 0, [routeId]);
  const totalFare = baseFare * Math.max(1, seats);

  const onBook = (e) => {
    e.preventDefault();
    if (!routeId || !pickup.trim() || !drop.trim() || seats <= 0) return;
    const id = `T-${Date.now()}`;
    const payload = {
      id,
      routeId,
      routeName: ROUTES.find(r => r.id === routeId)?.name || routeId,
      pickup: pickup.trim(),
      drop: drop.trim(),
      seats,
      totalFare,
      ts: new Date().toISOString(),
    };
    setTicket(payload);
  };

  return (
    <main className="max-w-5xl mx-auto px-4 py-8 bg-white dark:bg-dark-bg min-h-[calc(100vh-64px)] transition-colors duration-200">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-dark-text-primary">Book tickets</h2>
      <p className="text-gray-600 dark:text-dark-text-secondary">Instant QR ticket after booking. Show it on boarding.</p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <form onSubmit={onBook} className="rounded-2xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-surface p-5 shadow-sm space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-primary">Route</label>
            <select value={routeId} onChange={(e)=>setRouteId(e.target.value)} className="mt-1 w-full rounded-xl border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-card px-3 py-2 text-gray-900 dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors">
              <option value="">Select route</option>
              {ROUTES.map(r => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-primary">Pickup</label>
            <input value={pickup} onChange={(e)=>setPickup(e.target.value)} placeholder="Enter pickup" className="mt-1 w-full rounded-xl border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-card px-3 py-2 text-gray-900 dark:text-dark-text-primary placeholder:text-gray-400 dark:placeholder:text-dark-text-muted focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-primary">Drop</label>
            <input value={drop} onChange={(e)=>setDrop(e.target.value)} placeholder="Enter drop" className="mt-1 w-full rounded-xl border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-card px-3 py-2 text-gray-900 dark:text-dark-text-primary placeholder:text-gray-400 dark:placeholder:text-dark-text-muted focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-primary">Seats</label>
            <input type="number" min="1" value={seats} onChange={(e)=>setSeats(Number(e.target.value))} className="mt-1 w-full rounded-xl border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-card px-3 py-2 text-gray-900 dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors" />
          </div>
          <div className="rounded-xl bg-gray-50 dark:bg-dark-card border border-gray-200 dark:border-dark-border px-4 py-3">
            <div className="text-sm text-gray-600 dark:text-dark-text-secondary">Fare per seat: ₹ {baseFare}</div>
            <div className="text-lg font-semibold dark:text-dark-text-primary">Total: ₹ {totalFare}</div>
          </div>
          <button type="submit" className="w-full rounded-xl bg-blue-600 dark:bg-blue-500 px-5 py-3 text-white font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">Book & get QR</button>
        </form>

        <div className="rounded-2xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-surface p-5 shadow-sm min-h-[300px] flex items-center justify-center">
          {ticket ? (
            <div className="text-center">
              <h3 className="text-xl font-semibold dark:text-dark-text-primary">Your ticket</h3>
              <p className="text-sm text-gray-600 dark:text-dark-text-secondary">{ticket.routeName} • {ticket.seats} seat(s)</p>
              <div className="mt-3 bg-white dark:bg-dark-card p-3 inline-block rounded-xl border border-gray-200 dark:border-dark-border">
                <QRCodeSVG value={JSON.stringify(ticket)} size={160} includeMargin={true} />
              </div>
              <p className="mt-2 text-xs text-gray-500 dark:text-dark-text-muted">ID: {ticket.id}</p>
            </div>
          ) : (
            <p className="text-gray-600 dark:text-dark-text-secondary">Book a ticket to see the QR code here.</p>
          )}
        </div>
      </div>
    </main>
  );
};

export default Tickets;
