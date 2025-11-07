/**
 * EXAMPLE: How to use Supabase Database Operations
 * 
 * This file shows various database operations you can perform with Supabase.
 * These examples assume you have created the necessary tables in your Supabase dashboard.
 * 
 * DO NOT USE THIS FILE DIRECTLY - Copy the relevant code to your actual components
 */

import React, { useState, useEffect } from 'react';
import { db, supabase } from '../config/supabaseClient';

// ============================================
// EXAMPLE 1: Fetch and Display Rooms
// ============================================
const RoomsListExample = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      
      // Fetch all rooms
      const { data, error } = await db.select('rooms');

      if (error) {
        setError(error.message);
        console.error('Error fetching rooms:', error);
        return;
      }

      setRooms(data || []);
    } catch (err) {
      setError('Failed to load rooms');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading rooms...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {rooms.map((room) => (
        <div key={room.id} className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-2">{room.name}</h3>
          <p className="text-gray-600 mb-4">{room.description}</p>
          <p className="text-2xl font-bold text-[#006938]">${room.price}/night</p>
          <p className="text-sm text-gray-500 mt-2">Capacity: {room.capacity} guests</p>
        </div>
      ))}
    </div>
  );
};

// ============================================
// EXAMPLE 2: Create a Booking
// ============================================
const CreateBookingExample = () => {
  const [formData, setFormData] = useState({
    roomId: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setError('You must be logged in to make a booking');
        setLoading(false);
        return;
      }

      // Calculate total price (you'd fetch room price from database)
      const totalPrice = 150.00; // Example price

      // Create booking
      const { data, error } = await db.insert('bookings', {
        user_id: user.id,
        room_id: formData.roomId,
        check_in: formData.checkIn,
        check_out: formData.checkOut,
        guests: formData.guests,
        total_price: totalPrice,
        status: 'pending',
      });

      if (error) {
        setError(error.message);
        console.error('Booking error:', error);
        return;
      }

      setSuccess(true);
      console.log('Booking created:', data);

      // Reset form
      setFormData({
        roomId: '',
        checkIn: '',
        checkOut: '',
        guests: 1,
      });
    } catch (err) {
      setError('Failed to create booking');
      console.error('Booking error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Book a Room</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Booking created successfully!
        </div>
      )}

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Check-in Date</label>
        <input
          type="date"
          value={formData.checkIn}
          onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
          required
          className="w-full px-4 py-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Check-out Date</label>
        <input
          type="date"
          value={formData.checkOut}
          onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
          required
          className="w-full px-4 py-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Number of Guests</label>
        <input
          type="number"
          min="1"
          value={formData.guests}
          onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value) })}
          required
          className="w-full px-4 py-2 border rounded"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#006938] text-white py-2 rounded hover:bg-[#005530] disabled:opacity-50"
      >
        {loading ? 'Creating booking...' : 'Book Now'}
      </button>
    </form>
  );
};

// ============================================
// EXAMPLE 3: User's Bookings with Real-time Updates
// ============================================
const MyBookingsExample = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('bookings-channel')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'bookings',
        },
        (payload) => {
          console.log('Booking changed:', payload);
          // Refresh bookings when changes occur
          fetchBookings();
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      // Fetch user's bookings with room details
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          rooms (
            name,
            description,
            price
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching bookings:', error);
        return;
      }

      setBookings(data || []);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId);

      if (error) {
        console.error('Cancel error:', error);
        return;
      }

      // Refresh bookings
      fetchBookings();
    } catch (err) {
      console.error('Cancel error:', err);
    }
  };

  if (loading) return <div>Loading bookings...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">My Bookings</h2>

      {bookings.length === 0 ? (
        <p className="text-gray-600">You don't have any bookings yet.</p>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold mb-2">
                    {booking.rooms?.name || 'Room'}
                  </h3>
                  <p className="text-gray-600 mb-2">
                    Check-in: {new Date(booking.check_in).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600 mb-2">
                    Check-out: {new Date(booking.check_out).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600 mb-2">
                    Guests: {booking.guests}
                  </p>
                  <p className="text-2xl font-bold text-[#006938]">
                    ${booking.total_price}
                  </p>
                </div>
                <div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      booking.status === 'confirmed'
                        ? 'bg-green-100 text-green-800'
                        : booking.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {booking.status}
                  </span>
                  {booking.status !== 'cancelled' && (
                    <button
                      onClick={() => cancelBooking(booking.id)}
                      className="mt-4 block text-red-600 hover:text-red-800"
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================
// EXAMPLE 4: Search and Filter Rooms
// ============================================
const SearchRoomsExample = () => {
  const [rooms, setRooms] = useState([]);
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    minCapacity: '',
    available: true,
  });

  const searchRooms = async () => {
    try {
      let query = supabase.from('rooms').select('*');

      // Apply filters
      if (filters.minPrice) {
        query = query.gte('price', parseFloat(filters.minPrice));
      }
      if (filters.maxPrice) {
        query = query.lte('price', parseFloat(filters.maxPrice));
      }
      if (filters.minCapacity) {
        query = query.gte('capacity', parseInt(filters.minCapacity));
      }
      if (filters.available) {
        query = query.eq('available', true);
      }

      // Execute query
      const { data, error } = await query.order('price', { ascending: true });

      if (error) {
        console.error('Search error:', error);
        return;
      }

      setRooms(data || []);
    } catch (err) {
      console.error('Search error:', err);
    }
  };

  return (
    <div>
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-xl font-bold mb-4">Search Filters</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="number"
            placeholder="Min Price"
            value={filters.minPrice}
            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
            className="px-4 py-2 border rounded"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={filters.maxPrice}
            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
            className="px-4 py-2 border rounded"
          />
          <input
            type="number"
            placeholder="Min Capacity"
            value={filters.minCapacity}
            onChange={(e) => setFilters({ ...filters, minCapacity: e.target.value })}
            className="px-4 py-2 border rounded"
          />
          <button
            onClick={searchRooms}
            className="bg-[#006938] text-white py-2 rounded hover:bg-[#005530]"
          >
            Search
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <div key={room.id} className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-2">{room.name}</h3>
            <p className="text-gray-600 mb-4">{room.description}</p>
            <p className="text-2xl font-bold text-[#006938]">${room.price}/night</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export { RoomsListExample, CreateBookingExample, MyBookingsExample, SearchRoomsExample };

