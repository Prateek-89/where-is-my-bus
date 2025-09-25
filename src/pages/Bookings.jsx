import React, { useMemo, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

const AVAILABLE = [
  { id: 1, number: '42', route: 'KonchaBhanwar ↔ BusStand', location: 'Bye Pass', seats: 8 },
  { id: 2, number: '7', route: 'Railway-Station ↔ Manik-Chowk', location: 'BKD Chaurah', seats: 2 },
  { id: 3, number: '15', route: 'Sipri ↔ Medical College', location: 'Elite Chaurah', seats: 14 },
  { id: 4, number: '101', route: 'Prem Nagar ↔ Garhmau', location: 'BU', seats: 0 },
  { id: 5, number: '22', route: 'Awas Vikas ↔ BIET', location: 'Medical Gate No-3', seats: 5 },
];

function estimateFarePerSeat(pickup, drop) {
  const a = pickup.trim().toLowerCase();
  const b = drop.trim().toLowerCase();
  if (!a || !b) return 0;
  if (a === b) return 10; // same stop
  // simple heuristic based on string distance/length to simulate distance tiers
  const lenGap = Math.abs(a.length - b.length);
  if (lenGap <= 2) return 15; // nearby
  if (lenGap <= 6) return 20; // medium
  return 25; // far
}

const Bookings = () => {
  const [busId, setBusId] = useState('');
  const [pickup, setPickup] = useState('');
  const [drop, setDrop] = useState('');
  const [seats, setSeats] = useState(1);
  const [items, setItems] = useState([]);
  const [ticket, setTicket] = useState(null);
  const chosen = useMemo(() => AVAILABLE.find(b => String(b.id) === String(busId)), [busId]);

  const farePerSeat = useMemo(() => estimateFarePerSeat(pickup, drop), [pickup, drop]);
  const totalFare = farePerSeat * Math.max(0, seats || 0);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!chosen) return;
    if (!pickup.trim() || !drop.trim()) return;
    if (seats <= 0) return;
    if (chosen.seats < seats) return;
    const newItem = {
      id: Date.now(),
      bus: `Bus ${chosen.number}`,
      route: chosen.route,
      location: chosen.location,
      pickup: pickup.trim(),
      drop: drop.trim(),
      seats,
      farePerSeat,
      totalFare,
      ts: new Date().toISOString(),
    };
    setItems(prev => [newItem, ...prev]);
    setTicket(newItem);
    setBusId(''); setPickup(''); setDrop(''); setSeats(1);
  };

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-900">My Bookings</h2>
      <p className="text-gray-600">Book seats based on location and availability. A QR ticket will be generated.</p>

      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Bus and base location</label>
            <select
              value={busId}
              onChange={(e)=>setBusId(e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a bus</option>
              {AVAILABLE.map(b => (
                <option key={b.id} value={b.id}>{`Bus ${b.number} — ${b.location}`}</option>
              ))}
            </select>
            {chosen && chosen.seats === 0 && <p className="mt-1 text-sm text-red-600">This bus is full.</p>}
            {chosen && chosen.seats > 0 && <p className="mt-1 text-sm text-gray-500">Available seats: {chosen.seats}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Pickup location</label>
            <input
              type="text"
              value={pickup}
              onChange={(e)=>setPickup(e.target.value)}
              placeholder="e.g., Elite Chaurah"
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Drop location</label>
            <input
              type="text"
              value={drop}
              onChange={(e)=>setDrop(e.target.value)}
              placeholder="e.g., Medical Gate No-3"
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Seats</label>
            <input
              type="number"
              min="1"
              value={seats}
              onChange={(e)=>setSeats(Number(e.target.value))}
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="md:col-span-6">
            <button
              type="submit"
              disabled={!chosen || seats <= 0 || (chosen && seats > chosen.seats) || !pickup.trim() || !drop.trim()}
              className="w-full rounded-xl bg-blue-600 px-5 py-3 text-white font-semibold shadow-sm hover:bg-blue-700 disabled:opacity-50"
            >
              Book seat & generate QR
            </button>
          </div>
        </form>
      </div>

      {ticket && (
        <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm text-center">
          <h3 className="text-xl font-semibold">Your ticket</h3>
          <p className="text-sm text-gray-600">{ticket.bus} • {ticket.seats} seat(s)</p>
          <div className="mt-3 bg-white p-3 inline-block rounded-xl border">
            <QRCodeSVG value={JSON.stringify(ticket)} size={180} includeMargin={true} />
          </div>
          <p className="mt-2 text-xs text-gray-500">ID: {ticket.id}</p>
        </section>
      )}

      <section className="mt-8">
        <h3 className="text-2xl font-semibold">Your recent bookings</h3>
        <div className="mt-4 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-sm font-semibold text-gray-700">Bus</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-700">Pickup</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-700">Drop</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-700">Seats</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-700">Fare/seat</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-700">Total</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-700">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {items.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-6 text-center text-gray-600">No bookings yet</td>
                </tr>
              )}
              {items.map(it => (
                <tr key={it.id} className="bg-white hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-900">{it.bus}</td>
                  <td className="px-6 py-4 text-gray-700">{it.pickup}</td>
                  <td className="px-6 py-4 text-gray-700">{it.drop}</td>
                  <td className="px-6 py-4 text-gray-700">{it.seats}</td>
                  <td className="px-6 py-4 text-gray-700">₹ {it.farePerSeat}</td>
                  <td className="px-6 py-4 text-gray-900 font-semibold">₹ {it.totalFare}</td>
                  <td className="px-6 py-4 text-gray-700">{new Date(it.ts).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
};

export default Bookings;
