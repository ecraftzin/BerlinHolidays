// src/services/bookingService.js
import { supabase, supabasePublic } from '../config/supabaseClient';

/**
 * Calculate real-time available rooms for a room type on a specific date range
 * This checks existing bookings to calculate true availability
 * NOTE: Bookings are considered successful immediately - pending, confirmed, and checked_in
 * bookings all reduce room availability (instant blocking, no admin confirmation needed)
 * Uses supabasePublic client to avoid auth session issues
 */
export const calculateRealTimeAvailability = async (roomTypeId, startDate, endDate) => {
  try {
    // Get room type info
    const { data: roomType, error: roomError } = await supabasePublic
      .from('room_types')
      .select('total_rooms, name')
      .eq('id', roomTypeId)
      .single();

    if (roomError || !roomType) {
      console.error('Error fetching room type:', roomError);
      return { data: null, error: roomError || new Error('Room type not found') };
    }

    // Each room type represents a single physical room
    const totalRooms = roomType.total_rooms || 1;

    // Get all overlapping bookings that block rooms
    // A booking overlaps if: booking.check_in < endDate AND booking.check_out > startDate
    // Bookings are successful immediately - pending, confirmed, and checked_in all block rooms
    const { data: allBookings, error: bookingError } = await supabasePublic
      .from('bookings')
      .select('id, check_in_date, check_out_date, number_of_rooms, room_id, room_ids, status')
      .in('status', ['pending', 'confirmed', 'checked_in'])
      .lt('check_in_date', endDate)
      .gt('check_out_date', startDate);

    if (bookingError) {
      console.error('Error fetching bookings:', bookingError);
      return { data: null, error: bookingError };
    }

    // Generate dates in range (excluding checkout date)
    const dates = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
      dates.push(d.toISOString().split('T')[0]);
    }

    const bookings = allBookings || [];

    // Calculate booked rooms for each date
    const dateAvailability = dates.map(date => {
      let bookedRooms = 0;

      bookings.forEach(booking => {
        // Check if this booking covers this date
        if (booking.check_in_date <= date && booking.check_out_date > date) {
          // Check if this room type is in the booking's room_ids array
          const roomIdsArray = booking.room_ids || [];

          if (Array.isArray(roomIdsArray) && roomIdsArray.length > 0) {
            // Count how many times this room type appears in room_ids
            const countInBooking = roomIdsArray.filter(id => id === roomTypeId).length;
            bookedRooms += countInBooking;
          } else if (booking.room_id === roomTypeId) {
            // Fallback: if room_ids not available, use room_id with number_of_rooms
            bookedRooms += booking.number_of_rooms || 1;
          }
        }
      });

      return {
        date,
        totalRooms,
        bookedRooms,
        availableRooms: Math.max(0, totalRooms - bookedRooms),
      };
    });

    // Find minimum available rooms across all dates
    const minAvailable = Math.min(...dateAvailability.map(d => d.availableRooms));

    return {
      data: {
        roomType: roomType.name,
        totalRooms,
        minAvailable,
        isAvailable: minAvailable > 0,
        dateAvailability,
      },
      error: null,
    };
  } catch (error) {
    console.error('Error calculating real-time availability:', error);
    return { data: null, error };
  }
};

/**
 * Check if rooms can be booked (validates against existing bookings)
 */
export const validateBookingAvailability = async (roomTypeId, startDate, endDate, roomsNeeded = 1) => {
  try {
    const result = await calculateRealTimeAvailability(roomTypeId, startDate, endDate);

    if (result.error) {
      return { isAvailable: false, availableRooms: 0, error: result.error };
    }

    const { minAvailable } = result.data;

    return {
      isAvailable: minAvailable >= roomsNeeded,
      availableRooms: minAvailable,
      error: null,
    };
  } catch (error) {
    console.error('Error validating booking availability:', error);
    return { isAvailable: false, availableRooms: 0, error };
  }
};

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
 * Create a new booking with availability validation
 * This prevents overbooking by checking actual bookings before creating a new one
 */
export const createBooking = async (bookingData) => {
  try {
    const roomId = bookingData.room_id;
    const checkInDate = bookingData.check_in_date;
    const checkOutDate = bookingData.check_out_date;
    const roomsNeeded = bookingData.number_of_rooms || 1;

    // Validate availability before creating booking
    if (roomId && checkInDate && checkOutDate) {
      const availability = await validateBookingAvailability(
        roomId,
        checkInDate,
        checkOutDate,
        roomsNeeded
      );

      if (availability.error) {
        console.error('Error checking availability:', availability.error);
        // Continue with booking if availability check fails (fail-safe)
      } else if (!availability.isAvailable) {
        return {
          data: null,
          error: {
            message: `Not enough rooms available. Only ${availability.availableRooms} room(s) available for the selected dates.`,
            code: 'INSUFFICIENT_ROOMS',
            availableRooms: availability.availableRooms,
          },
        };
      }
    }

    // Parse room_ids if provided as JSON string
    let roomIdsArray = null;
    if (bookingData.room_ids) {
      try {
        roomIdsArray = typeof bookingData.room_ids === 'string'
          ? JSON.parse(bookingData.room_ids)
          : bookingData.room_ids;
      } catch (e) {
        console.error('Error parsing room_ids:', e);
        roomIdsArray = null;
      }
    }

    // Create the booking
    const { data, error } = await supabase
      .from('bookings')
      .insert([{
        user_id: bookingData.user_id || null,
        customer_name: bookingData.customer_name,
        customer_email: bookingData.customer_email,
        customer_phone: bookingData.customer_phone || null,
        room_id: bookingData.room_id || null,
        room_ids: roomIdsArray, // Array of all room IDs for multi-room bookings
        room_name: bookingData.room_name || null,
        check_in_date: bookingData.check_in_date,
        check_out_date: bookingData.check_out_date,
        number_of_rooms: bookingData.number_of_rooms || 1,
        number_of_adults: bookingData.number_of_adults || 1,
        number_of_children: bookingData.number_of_children || 0,
        special_requests: bookingData.special_requests || null,
        status: bookingData.status || 'pending',
        total_amount: bookingData.total_amount || null,
        id_proof_url: bookingData.id_proof_url || null, // ID proof document URL
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
      .select();

    if (error) throw error;

    // Check if any rows were updated
    if (!data || data.length === 0) {
      throw new Error('Booking not found or no permission to update');
    }

    return { data: data[0], error: null };
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
      .select();

    if (error) throw error;

    // Check if any rows were updated
    if (!data || data.length === 0) {
      throw new Error('Booking not found or no permission to update');
    }

    return { data: data[0], error: null };
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

