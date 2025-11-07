/**
 * EXAMPLE: How to integrate Supabase Authentication
 * 
 * This file shows how to replace the demo authentication in LoginPage.jsx
 * with real Supabase authentication.
 * 
 * DO NOT USE THIS FILE DIRECTLY - Copy the relevant code to your actual components
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../config/supabaseClient';

// ============================================
// EXAMPLE 1: Login Component with Supabase
// ============================================
const LoginExample = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Use Supabase authentication instead of hardcoded credentials
      const { data, error } = await auth.signIn(email, password);

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      // Successfully logged in
      console.log('User logged in:', data.user);
      
      // Store auth state (optional - Supabase handles this automatically)
      localStorage.setItem('auth', '1');
      
      // Navigate to dashboard
      navigate('/admin/dashboard');
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
        className="w-full px-4 py-2 border rounded mb-4"
      />
      
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
        className="w-full px-4 py-2 border rounded mb-4"
      />
      
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#006938] text-white py-2 rounded hover:bg-[#005530] disabled:opacity-50"
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
};

// ============================================
// EXAMPLE 2: Signup Component with Supabase
// ============================================
const SignupExample = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      // Sign up with Supabase
      const { data, error } = await auth.signUp(
        formData.email,
        formData.password,
        {
          name: formData.name,
          phone: formData.phone,
        }
      );

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      // Successfully signed up
      console.log('User created:', data.user);
      setSuccess('Account created successfully! Please check your email to verify your account.');

      // Navigate to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form onSubmit={handleSignup}>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}
      
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Full Name"
        required
        className="w-full px-4 py-2 border rounded mb-4"
      />
      
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        required
        className="w-full px-4 py-2 border rounded mb-4"
      />
      
      <input
        type="tel"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        placeholder="Phone Number"
        className="w-full px-4 py-2 border rounded mb-4"
      />
      
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
        required
        className="w-full px-4 py-2 border rounded mb-4"
      />
      
      <input
        type="password"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        placeholder="Confirm Password"
        required
        className="w-full px-4 py-2 border rounded mb-4"
      />
      
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#006938] text-white py-2 rounded hover:bg-[#005530] disabled:opacity-50"
      >
        {loading ? 'Creating account...' : 'Sign Up'}
      </button>
    </form>
  );
};

// ============================================
// EXAMPLE 3: Protected Route Component
// ============================================
const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  React.useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { user, error } = await auth.getCurrentUser();

      if (error || !user) {
        // Not authenticated, redirect to login
        navigate('/login');
        return;
      }

      // User is authenticated
      setIsAuthenticated(true);
    } catch (err) {
      console.error('Auth check error:', err);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : null;
};

// ============================================
// EXAMPLE 4: User Profile Component
// ============================================
const UserProfileExample = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  React.useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const { user, error } = await auth.getCurrentUser();

      if (error) {
        console.error('Error loading user:', error);
        return;
      }

      setUser(user);
    } catch (err) {
      console.error('Profile load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await auth.signOut();

      if (error) {
        console.error('Logout error:', error);
        return;
      }

      // Clear local storage
      localStorage.removeItem('auth');
      
      // Navigate to home
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (loading) {
    return <div>Loading profile...</div>;
  }

  if (!user) {
    return <div>No user found</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">User Profile</h2>
      
      <div className="bg-white rounded-lg shadow p-6 mb-4">
        <p className="mb-2">
          <span className="font-semibold">Email:</span> {user.email}
        </p>
        <p className="mb-2">
          <span className="font-semibold">User ID:</span> {user.id}
        </p>
        {user.user_metadata?.name && (
          <p className="mb-2">
            <span className="font-semibold">Name:</span> {user.user_metadata.name}
          </p>
        )}
        {user.user_metadata?.phone && (
          <p className="mb-2">
            <span className="font-semibold">Phone:</span> {user.user_metadata.phone}
          </p>
        )}
      </div>
      
      <button
        onClick={handleLogout}
        className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
};

export { LoginExample, SignupExample, ProtectedRoute, UserProfileExample };

