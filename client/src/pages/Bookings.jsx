import React, { useMemo, useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

// Buses will be fetched from API

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
  const { isAuthenticated } = useAuth();
  const [busId, setBusId] = useState('');
  const [pickup, setPickup] = useState('');
  const [drop, setDrop] = useState('');
  const [seats, setSeats] = useState(1);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [bookingData, setBookingData] = useState(null);
  const [availableBuses, setAvailableBuses] = useState([]);
  const [loadingBuses, setLoadingBuses] = useState(true);
  const chosen = useMemo(() => availableBuses.find(b => b._id === busId), [busId, availableBuses]);

  const farePerSeat = useMemo(() => estimateFarePerSeat(pickup, drop), [pickup, drop]);
  const totalFare = farePerSeat * Math.max(0, seats || 0);
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async (orderData) => {
    try {
      if (!window.Razorpay) {
        setMessage('Payment gateway is loading. Please wait a moment and try again.');
        setLoading(false);
        return;
      }

      if (!orderData.orderId || !orderData.keyId) {
        setMessage('Invalid payment order data. Please try again.');
        setLoading(false);
        return;
      }

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'Bus Tracking System',
        description: `Bus Ticket Booking - ₹${(orderData.amount / 100).toFixed(2)}`,
        order_id: orderData.orderId,
        handler: async function (response) {
          try {
            setLoading(true);
            setMessage('Verifying payment...');
            
            const verifyRes = await fetch(`${API_BASE}/api/payments/verify-payment`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
              },
              credentials: 'include',
              body: JSON.stringify({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                bookingId: orderData.bookingId,
              }),
            });

            if (!verifyRes.ok) {
              throw new Error('Payment verification failed');
            }

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              setMessage('✅ Payment successful! Your booking is confirmed.');
              setBookingData(verifyData.data);
              // Refresh bookings list
              fetchBookings();
              // Reset form
              setBusId(''); 
              setPickup(''); 
              setDrop(''); 
              setSeats(1);
            } else {
              setMessage('❌ Payment verification failed. Please contact support with your payment ID.');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            setMessage('❌ Payment verification failed. Please contact support.');
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: '',
        },
        theme: {
          color: '#2563eb',
        },
        modal: {
          ondismiss: async function () {
            // Handle payment cancellation
            try {
              setMessage('Processing cancellation...');
              await fetch(`${API_BASE}/api/payments/payment-failed`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                credentials: 'include',
                body: JSON.stringify({
                  bookingId: orderData.bookingId,
                }),
              });
              setMessage('Payment cancelled. Your booking has been cancelled.');
              setLoading(false);
            } catch (error) {
              console.error('Payment cancellation error:', error);
              setMessage('Payment was cancelled, but there was an error processing it.');
              setLoading(false);
            }
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      
      razorpay.on('payment.failed', function (response) {
        console.error('Payment failed:', response.error);
        setMessage(`Payment failed: ${response.error.description || 'Unknown error'}. Please try again.`);
        setLoading(false);
      });

      razorpay.open();
    } catch (error) {
      console.error('Payment initialization error:', error);
      setMessage('Failed to initialize payment. Please try again.');
      setLoading(false);
    }
  };

  const fetchBuses = async () => {
    try {
      setLoadingBuses(true);
      setMessage(''); // Clear previous messages
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
      };
      
      // Add authorization header only if token exists
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const res = await fetch(`${API_BASE}/api/buses/buses`, {
        headers,
        credentials: 'include',
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      console.log('Buses API response:', data); // Debug log
      
      if (data.success && data.data) {
        setAvailableBuses(data.data);
        if (data.data.length === 0) {
          setMessage('No buses available. Please add buses to the system.');
        }
      } else {
        setMessage(data.message || 'Failed to load buses. Please try again.');
        setAvailableBuses([]);
      }
    } catch (error) {
      console.error('Fetch buses error:', error);
      setMessage(`Failed to load buses: ${error.message}. Please check if the server is running and try again.`);
      setAvailableBuses([]);
    } finally {
      setLoadingBuses(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/bookings/my-bookings`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        // Transform data for display
        const transformed = data.data.map(booking => ({
          id: booking._id,
          bus: `Bus ${booking.bus?.busNumber || 'N/A'}`,
          route: booking.route?.routeName || 'N/A',
          pickup: booking.fromStop?.name || 'N/A',
          drop: booking.toStop?.name || 'N/A',
          seats: 1,
          farePerSeat: booking.fare,
          totalFare: booking.fare,
          ts: booking.bookingDate,
          status: booking.status,
        }));
        setItems(transformed);
      }
    } catch (error) {
      console.error('Fetch bookings error:', error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchBuses();
      fetchBookings();
    }
  }, [isAuthenticated]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    
    if (!isAuthenticated) {
      setMessage('Please login to book tickets');
      return;
    }

    if (!chosen) {
      setMessage('Please select a bus');
      return;
    }
    if (!pickup.trim() || !drop.trim()) {
      setMessage('Please enter pickup and drop locations');
      return;
    }
    if (seats <= 0) {
      setMessage('Please select at least 1 seat');
      return;
    }
    if (chosen.capacity < seats) {
      setMessage('Not enough seats available');
      return;
    }

    if (totalFare < 1) {
      setMessage('Minimum fare is ₹1. Please check your pickup and drop locations.');
      return;
    }

    try {
      setLoading(true);
      setMessage('Creating payment order...');
      
      // Create payment order
      const res = await fetch(`${API_BASE}/api/payments/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        credentials: 'include',
        body: JSON.stringify({
          busId: busId, // Use the actual MongoDB bus ID
          fromStop: {
            name: pickup.trim(),
            coordinates: { latitude: 0, longitude: 0 }
          },
          toStop: {
            name: drop.trim(),
            coordinates: { latitude: 0, longitude: 0 }
          },
          travelDate: new Date().toISOString(),
          seatNumber: `S${seats}`,
          fare: totalFare,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Server error: ${res.status}`);
      }

      const data = await res.json();
      console.log('Payment order response:', data); // Debug log
      
      if (data.success) {
        setMessage('Opening payment gateway...');
        // Open Razorpay payment
        await handlePayment(data);
      } else {
        setMessage(`❌ ${data.message || 'Failed to create booking'}`);
        setLoading(false);
      }
    } catch (error) {
      console.error('Booking error:', error);
      setMessage(error.message || 'Failed to process booking. Please try again.');
      setLoading(false);
    }
  };

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-900">My Bookings</h2>
      <p className="text-gray-600">Book seats based on location and availability. Complete payment to confirm your booking.</p>

      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Bus and base location</label>
            <select
              value={busId}
              onChange={(e)=>setBusId(e.target.value)}
              disabled={loadingBuses}
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <option value="">{loadingBuses ? 'Loading buses...' : availableBuses.length === 0 ? 'No buses available' : 'Select a bus'}</option>
              {availableBuses.map(bus => (
                <option key={bus._id} value={bus._id}>
                  {`Bus ${bus.busNumber} - ${bus.busName}${bus.route ? ` (${bus.route.routeName})` : ''}`}
                </option>
              ))}
            </select>
            {loadingBuses && <p className="mt-1 text-sm text-blue-600">Loading buses...</p>}
            {!loadingBuses && availableBuses.length === 0 && (
              <p className="mt-1 text-sm text-red-600">No buses available. Please contact administrator.</p>
            )}
            {chosen && <p className="mt-1 text-sm text-gray-500">Capacity: {chosen.capacity} seats</p>}
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
            <div className="mb-3 p-3 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Total Fare:</span>
                <span className="text-2xl font-bold text-blue-700">₹{totalFare.toFixed(2)}</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                {seats} seat(s) × ₹{farePerSeat.toFixed(2)} per seat
              </p>
            </div>
            <button
              type="submit"
              disabled={loading || loadingBuses || !chosen || seats <= 0 || (chosen && seats > chosen.capacity) || !pickup.trim() || !drop.trim() || !isAuthenticated || totalFare < 1}
              className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-white font-semibold shadow-lg shadow-blue-600/30 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Processing...' : `Pay ₹${totalFare.toFixed(2)} & Book Seat`}
            </button>
          </div>
        </form>
        {message && (
          <div className={`mt-4 p-4 rounded-xl border ${
            message.includes('success') || message.includes('✅') 
              ? 'bg-green-50 text-green-800 border-green-200' 
              : message.includes('cancelled') || message.includes('Processing')
              ? 'bg-yellow-50 text-yellow-800 border-yellow-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}>
            <div className="flex items-center gap-2">
              {message.includes('✅') && <span className="text-xl">✅</span>}
              {message.includes('❌') && <span className="text-xl">❌</span>}
              <span className="font-medium">{message}</span>
            </div>
          </div>
        )}
      </div>

      {bookingData && (
        <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="text-xl font-semibold text-center mb-4">Booking Confirmed!</h3>
          <div className="space-y-2">
            <p className="text-sm"><span className="font-semibold">Ticket Number:</span> {bookingData.ticket?.ticketNumber}</p>
            <p className="text-sm"><span className="font-semibold">Bus:</span> {bookingData.booking?.bus?.busNumber}</p>
            <p className="text-sm"><span className="font-semibold">Route:</span> {bookingData.booking?.route?.routeName}</p>
            <p className="text-sm"><span className="font-semibold">Status:</span> <span className="text-green-600 font-semibold">{bookingData.booking?.status}</span></p>
          </div>
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
                <th className="px-6 py-3 text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-700">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {items.length === 0 && (
                <tr>
                  <td colSpan="8" className="px-6 py-6 text-center text-gray-600">No bookings yet</td>
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
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      it.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                      it.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      it.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {it.status || 'pending'}
                    </span>
                  </td>
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
