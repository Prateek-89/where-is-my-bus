import React, { useState } from 'react';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('Please enter a valid email');
      return;
    }
    setStatus('Thanks! You\'re subscribed.');
    setEmail('');
  };

  return (
    <section id="newsletter" className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h3 className="text-3xl font-bold">Stay in the loop</h3>
        <p className="mt-2 text-gray-600">Get updates about new routes and live features.</p>
        <form onSubmit={onSubmit} className="mt-6 flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full flex-1 rounded-xl border border-gray-300 px-4 py-3 text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit" className="rounded-xl bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700">Subscribe</button>
        </form>
        {status && <p className="mt-3 text-sm text-gray-700">{status}</p>}
      </div>
    </section>
  );
};

export default Newsletter;
