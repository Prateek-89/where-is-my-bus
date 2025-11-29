import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    
    if (!email || !password) {
      setMessage('Please fill in email and password');
      return;
    }

    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);

    if (result.success) {
      navigate('/');
    } else {
      setMessage(result.message || 'Login failed. Please try again.');
    }
  };

  return (
    <main className="min-h-[calc(100vh-64px)] bg-white">
      <section className="max-w-md mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold text-gray-900">Login</h2>
        <p className="mt-1 text-gray-600">Welcome back! Please sign in.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-white text-lg font-semibold shadow-lg shadow-blue-600/30 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
          {message && (
            <p className={`text-sm ${message.includes('success') || message.includes('Logged') ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </p>
          )}
        </form>

        <p className="mt-6 text-sm text-gray-600">
          New here?{' '}
          <Link to="/register" className="text-blue-600 hover:underline">Create an account</Link>
        </p>
      </section>
    </main>
  );
};

export default Login;
