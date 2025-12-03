// src/services/bookingService.js
import { supabase } from '../config/supabaseClient';

/**
 * Get all bookings with optional filters
 */
export const getAllBookings = async (filters = {}) => {
  try {
    let query = supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    // Apply filters
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.startDate) {
      query = query.gte('check_in_date', filters.startDate);
    }
    if (filters.endDate) {
      query = query.lte('check_out_date', filters.endDate);
    }

    const { data, error } = await query;

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return { data: null, error };
  }
};

/**
 * Get a single booking by ID
 */
export const getBookingById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching booking:', error);
    return { data: null, error };
  }
};

/**
 * Create a new booking
 */
export const createBooking = async (bookingData) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .insert([{
        user_id: bookingData.user_id || null, // NULL for guest bookings
        customer_name: bookingData.customer_name,
        customer_email: bookingData.customer_email,
        customer_phone: bookingData.customer_phone || null,
        room_id: bookingData.room_id || null,
        room_name: bookingData.room_name || null,
        check_in_date: bookingData.check_in_date,
        check_out_date: bookingData.check_out_date,
        number_of_rooms: bookingData.number_of_rooms || 1,
        number_of_adults: bookingData.number_of_adults || 1,
        number_of_children: bookingData.number_of_children || 0,
        special_requests: bookingData.special_requests || null,
        status: bookingData.status || 'pending',
        total_amount: bookingData.total_amount || null,
      }])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating booking:', error);
    return { data: null, error };
  }
};

/**
 * Update a booking
 */
export const updateBooking = async (id, bookingData) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .update({
        ...bookingData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating booking:', error);
    return { data: null, error };
  }
};

/**
 * Delete a booking
 */
export const deleteBooking = async (id) => {
  try {
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { data: true, error: null };
  } catch (error) {
    console.error('Error deleting booking:', error);
    return { data: null, error };
  }
};

/**
 * Update booking status
 */
export const updateBookingStatus = async (id, status) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .update({ 
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating booking status:', error);
    return { data: null, error };
  }
};

/**
 * Get booking statistics
 */
export const getBookingStats = async () => {
  try {
    const { data: allBookings, error } = await supabase
      .from('bookings')
      .select('status, total_amount');

    if (error) throw error;

    const stats = {
      total: allBookings.length,
      pending: allBookings.filter(b => b.status === 'pending').length,
      confirmed: allBookings.filter(b => b.status === 'confirmed').length,
      cancelled: allBookings.filter(b => b.status === 'cancelled').length,
      completed: allBookings.filter(b => b.status === 'completed').length,
      totalRevenue: allBookings
        .filter(b => b.status !== 'cancelled')
        .reduce((sum, b) => sum + (parseFloat(b.total_amount) || 0), 0),
    };

    return { data: stats, error: null };
  } catch (error) {
    console.error('Error fetching booking stats:', error);
    return { data: null, error };
  }
};

