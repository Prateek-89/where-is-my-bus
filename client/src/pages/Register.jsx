import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { register, googleLogin } = useAuth();
  const navigate = useNavigate();
  const googleButtonRef = useRef(null);
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

  const handleGoogleCallback = async (response) => {
    try {
      setGoogleLoading(true);
      setMessage('');
      
      const result = await googleLogin(response.credential);
      
      if (result.success) {
        navigate('/');
      } else {
        setMessage(result.message || 'Google sign up failed. Please try again.');
      }
    } catch (error) {
      console.error('Google sign up error:', error);
      setMessage('Failed to process Google sign up. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) {
      console.warn('Google Client ID not found. Ensure VITE_GOOGLE_CLIENT_ID is set.');
      return;
    }

    const initGoogleSignIn = () => {
      if (window.google && GOOGLE_CLIENT_ID && googleButtonRef.current) {
        try {
          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleGoogleCallback,
          });

          window.google.accounts.id.renderButton(
            googleButtonRef.current,
            {
              theme: 'outline',
              size: 'large',
              text: 'signup_with',
              locale: 'en'
            }
          );
        } catch (error) {
          console.error('Error initializing Google Sign-In:', error);
        }
      }
    };

    if (window.google) {
      initGoogleSignIn();
    } else {
      const checkGoogle = setInterval(() => {
        if (window.google) {
          clearInterval(checkGoogle);
          initGoogleSignIn();
        }
      }, 100);

      setTimeout(() => {
        clearInterval(checkGoogle);
        if (!window.google) {
          console.warn('Google Identity Services script did not load.');
        }
      }, 5000);
    }
  }, [GOOGLE_CLIENT_ID]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    
    if (!name.trim() || !email.trim() || !password || !confirm) {
      setMessage('Please fill all fields');
      return;
    }
    if (password !== confirm) {
      setMessage('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setMessage('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    const result = await register(name, email, password);
    setIsLoading(false);

    if (result.success) {
      navigate('/');
    } else {
      setMessage(result.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <main className="min-h-[calc(100vh-64px)] bg-white dark:bg-dark-bg transition-colors duration-200">
      <section className="max-w-md mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-dark-text-primary">Create account</h2>
        <p className="mt-1 text-gray-600 dark:text-dark-text-secondary">Register to manage bookings and track buses.</p>

        {GOOGLE_CLIENT_ID && (
          <div className="mt-6">
            <div ref={googleButtonRef} className="w-full flex justify-center"></div>
            {googleLoading && (
              <p className="mt-2 text-sm text-blue-600 dark:text-blue-400 text-center">Signing up with Google...</p>
            )}
          </div>
        )}

        {GOOGLE_CLIENT_ID && (
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-dark-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-dark-bg text-gray-500 dark:text-dark-text-muted">OR</span>
            </div>
          </div>
        )}

        <form onSubmit={onSubmit} className="mt-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-primary">Full name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-card px-4 py-3 text-gray-900 dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 placeholder:text-gray-400 dark:placeholder:text-dark-text-muted transition-colors"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-primary">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-card px-4 py-3 text-gray-900 dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 placeholder:text-gray-400 dark:placeholder:text-dark-text-muted transition-colors"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-primary">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-card px-4 py-3 text-gray-900 dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 placeholder:text-gray-400 dark:placeholder:text-dark-text-muted transition-colors"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-primary">Confirm password</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-card px-4 py-3 text-gray-900 dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 placeholder:text-gray-400 dark:placeholder:text-dark-text-muted transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 px-6 py-3 text-white text-lg font-semibold shadow-lg shadow-blue-600/30 dark:shadow-blue-500/30 hover:from-blue-700 hover:to-indigo-700 dark:hover:from-blue-600 dark:hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:focus:ring-offset-dark-bg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating account...' : 'Create account'}
          </button>
          {message && (
            <p className={`text-sm ${message.includes('success') || message.includes('created') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {message}
            </p>
          )}
        </form>

        <p className="mt-6 text-sm text-gray-600 dark:text-dark-text-secondary">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline transition-colors">Sign in</Link>
        </p>
      </section>
    </main>
  );
};

export default Register;
