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
    <section id="newsletter" className="bg-gray-50 dark:bg-dark-surface border-t border-gray-200 dark:border-dark-border transition-colors duration-200">
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h3 className="text-3xl font-bold dark:text-dark-text-primary">Stay in the loop</h3>
        <p className="mt-2 text-gray-600 dark:text-dark-text-secondary">Get updates about new routes and live features.</p>
        <form onSubmit={onSubmit} className="mt-6 flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full flex-1 rounded-xl border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-card px-4 py-3 text-base text-gray-900 dark:text-dark-text-primary placeholder:text-gray-400 dark:placeholder:text-dark-text-muted focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
          />
          <button type="submit" className="rounded-xl bg-blue-600 dark:bg-blue-500 px-6 py-3 text-white font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">Subscribe</button>
        </form>
        {status && <p className="mt-3 text-sm text-gray-700 dark:text-dark-text-secondary">{status}</p>}
      </div>
    </section>
  );
};

export default Newsletter;
