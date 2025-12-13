// src/services/availabilityService.js
import { supabase, supabasePublic } from '../config/supabaseClient';

/**
 * Room Availability Service
 * Handles all database operations for room availability
 */

// Helper function to format date in local timezone (YYYY-MM-DD)
// This prevents timezone-related date shifts when using toISOString()
const formatLocalDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Get room availability for date range (for public pages)
// Uses supabasePublic client to avoid auth session issues
export const getRoomAvailabilityForDateRange = async (roomTypeId, startDate, endDate) => {
  try {
    const { data, error } = await supabasePublic
      .from('room_availability')
      .select(`
        *,
        room_type:room_types(id, name, slug, total_rooms)
      `)
      .eq('room_type_id', roomTypeId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching room availability:', error);
    return { data: null, error };
  }
};

// Get all room availability for a month
export const getRoomAvailabilityForMonth = async (year, month) => {
  try {
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const endDate = formatLocalDate(new Date(year, month, 0));

    const { data, error } = await supabase
      .from('room_availability')
      .select(`
        *,
        room_type:room_types(id, name, slug, total_rooms)
      `)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching room availability for month:', error);
    return { data: null, error };
  }
};

// Get availability for specific date
export const getRoomAvailabilityForDate = async (roomTypeId, date) => {
  try {
    const { data, error } = await supabase
      .from('room_availability')
      .select(`
        *,
        room_type:room_types(id, name, slug, total_rooms)
      `)
      .eq('room_type_id', roomTypeId)
      .eq('date', date)
      .single();

    if (error && error.code === 'PGRST116') {
      // No availability record found
      return { data: null, error: null };
    }

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching room availability for date:', error);
    return { data: null, error };
  }
};

// Create or update room availability
export const upsertRoomAvailability = async (availabilityData) => {
  try {
    const availability = {
      ...availabilityData,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('room_availability')
      .upsert([availability], { onConflict: 'room_type_id,date' })
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error upserting room availability:', error);
    return { data: null, error };
  }
};

// Bulk update room availability
export const bulkUpdateRoomAvailability = async (availabilities) => {
  try {
    const availabilitiesWithTimestamp = availabilities.map(avail => {
      const availableRooms = avail.available_rooms || 0;
      const totalRooms = avail.total_rooms || 0;
      
      let status = avail.status;
      if (!status) {
        if (availableRooms === 0) {
          status = 'sold_out';
        } else if (availableRooms <= totalRooms * 0.2) {
          status = 'limited';
        } else {
          status = 'available';
        }
      }

      return {
        ...avail,
        status,
        updated_at: new Date().toISOString(),
      };
    });

    const { data, error } = await supabase
      .from('room_availability')
      .upsert(availabilitiesWithTimestamp, { onConflict: 'room_type_id,date' })
      .select();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error bulk updating room availability:', error);
    return { data: null, error };
  }
};

// Update availability status
export const updateAvailabilityStatus = async (id, status) => {
  try {
    const { data, error } = await supabase
      .from('room_availability')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating availability status:', error);
    return { data: null, error };
  }
};

// Block rooms for specific dates
export const blockRooms = async (roomTypeId, startDate, endDate, blockedCount, notes = '') => {
  try {
    const dates = [];
    const start = new Date(startDate + 'T00:00:00');
    const end = new Date(endDate + 'T00:00:00');

    // Generate array of dates
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dates.push(formatLocalDate(d));
    }

    // Get room type info
    const { data: roomType } = await supabase
      .from('room_types')
      .select('total_rooms')
      .eq('id', roomTypeId)
      .single();

    if (!roomType) throw new Error('Room type not found');

    // Create availability records for each date
    const availabilities = dates.map(date => ({
      room_type_id: roomTypeId,
      date,
      total_rooms: roomType.total_rooms,
      available_rooms: Math.max(0, roomType.total_rooms - blockedCount),
      blocked_rooms: blockedCount,
      booked_rooms: 0,
      status: blockedCount >= roomType.total_rooms ? 'blocked' : 'available',
      notes,
    }));

    const result = await bulkUpdateRoomAvailability(availabilities);
    return result;
  } catch (error) {
    console.error('Error blocking rooms:', error);
    return { data: null, error };
  }
};

// Unblock rooms
export const unblockRooms = async (roomTypeId, startDate, endDate) => {
  try {
    const dates = [];
    const start = new Date(startDate + 'T00:00:00');
    const end = new Date(endDate + 'T00:00:00');

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dates.push(formatLocalDate(d));
    }

    // Get room type info
    const { data: roomType } = await supabase
      .from('room_types')
      .select('total_rooms')
      .eq('id', roomTypeId)
      .single();

    if (!roomType) throw new Error('Room type not found');

    const availabilities = dates.map(date => ({
      room_type_id: roomTypeId,
      date,
      total_rooms: roomType.total_rooms,
      available_rooms: roomType.total_rooms,
      blocked_rooms: 0,
      booked_rooms: 0,
      status: 'available',
      notes: '',
    }));

    const result = await bulkUpdateRoomAvailability(availabilities);
    return result;
  } catch (error) {
    console.error('Error unblocking rooms:', error);
    return { data: null, error };
  }
};

// Check availability for booking - uses REAL-TIME booking data
export const checkAvailabilityForBooking = async (roomTypeId, startDate, endDate, roomsNeeded = 1) => {
  try {
    // Get room type info for total rooms
    const { data: roomType, error: roomError } = await supabase
      .from('room_types')
      .select('total_rooms, name')
      .eq('id', roomTypeId)
      .single();

    if (roomError || !roomType) {
      throw roomError || new Error('Room type not found');
    }

    // Each room type represents a single physical room
    const totalRooms = roomType.total_rooms || 1;

    // Get all overlapping bookings that are admin-confirmed
    // A booking overlaps if: booking.check_in < endDate AND booking.check_out > startDate
    // Only confirmed and checked_in bookings reduce room availability (NOT pending)
    const { data: allBookings, error: bookingError } = await supabase
      .from('bookings')
      .select('id, check_in_date, check_out_date, number_of_rooms, room_id, room_ids, status')
      .in('status', ['confirmed', 'checked_in'])
      .lt('check_in_date', endDate)
      .gt('check_out_date', startDate);

    if (bookingError) {
      throw bookingError;
    }

    // Generate dates in range (excluding checkout date)
    const dates = [];
    const start = new Date(startDate + 'T00:00:00');
    const end = new Date(endDate + 'T00:00:00');
    for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
      dates.push(formatLocalDate(d));
    }

    const bookings = allBookings || [];

    // Calculate availability for each date based on actual bookings
    const availability = dates.map(date => {
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

      const availableRooms = Math.max(0, totalRooms - bookedRooms);

      return {
        date,
        room_type_id: roomTypeId,
        total_rooms: totalRooms,
        booked_rooms: bookedRooms,
        available_rooms: availableRooms,
        status: availableRooms === 0 ? 'sold_out' : availableRooms <= 2 ? 'limited' : 'available',
      };
    });

    // Check if all dates have enough availability
    const isAvailable = availability.every(avail =>
      avail.available_rooms >= roomsNeeded && avail.status !== 'blocked' && avail.status !== 'sold_out'
    );

    // Find minimum available rooms
    const minAvailable = availability.length > 0
      ? Math.min(...availability.map(a => a.available_rooms))
      : totalRooms;

    return {
      data: {
        isAvailable: isAvailable && minAvailable >= roomsNeeded,
        availability,
        minAvailable,
        totalRooms,
      },
      error: null
    };
  } catch (error) {
    console.error('Error checking availability for booking:', error);
    return { data: null, error };
  }
};

// Delete availability record
export const deleteRoomAvailability = async (id) => {
  try {
    const { error } = await supabase
      .from('room_availability')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error deleting room availability:', error);
    return { error };
  }
};

// Get available room types for date range - uses REAL-TIME booking data
// Uses supabasePublic for public pages to avoid auth session issues
export const getAvailableRoomTypesForDateRange = async (startDate, endDate, roomsNeeded = 1) => {
  try {
    // First, get all active room types
    const { data: roomTypes, error: roomError } = await supabasePublic
      .from('room_types')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (roomError) throw roomError;

    if (!roomTypes || roomTypes.length === 0) {
      return { data: [], error: null };
    }

    // Helper function to format date in local timezone (YYYY-MM-DD)
    const formatLocalDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    // Generate array of dates in the range (excluding checkout date)
    const dates = [];
    const start = new Date(startDate + 'T00:00:00');
    const end = new Date(endDate + 'T00:00:00');
    for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
      dates.push(formatLocalDate(d));
    }

    // Get ALL overlapping bookings across all room types
    // Only confirmed and checked_in bookings reduce room availability (NOT pending)
    const { data: allBookings, error: bookingError } = await supabasePublic
      .from('bookings')
      .select('id, check_in_date, check_out_date, number_of_rooms, room_id, room_ids, status')
      .in('status', ['confirmed', 'checked_in'])
      .lt('check_in_date', endDate)
      .gt('check_out_date', startDate);

    if (bookingError) {
      console.error('Error fetching bookings:', bookingError);
    }

    const bookings = allBookings || [];

    // Check availability for each room type based on actual bookings
    // Each room type represents a single physical room, so we show all rooms
    // that are not booked for the date range, regardless of roomsNeeded
    const availableRooms = [];

    for (const roomType of roomTypes) {
      // Each room type represents a single physical room
      const totalRooms = roomType.total_rooms || 1;

      // Check availability for each date
      let isAvailable = true;
      let minAvailable = totalRooms;

      for (const date of dates) {
        let bookedRooms = 0;

        bookings.forEach(booking => {
          // Check if this booking covers this date
          if (booking.check_in_date <= date && booking.check_out_date > date) {
            // Check if this room type is in the booking's room_ids array
            // room_ids contains the list of all room types in the booking
            const roomIdsArray = booking.room_ids || [];

            if (Array.isArray(roomIdsArray) && roomIdsArray.length > 0) {
              // Count how many times this room type appears in room_ids
              const countInBooking = roomIdsArray.filter(id => id === roomType.id).length;
              bookedRooms += countInBooking;
            } else if (booking.room_id === roomType.id) {
              // Fallback: if room_ids not available, use room_id with number_of_rooms
              bookedRooms += booking.number_of_rooms || 1;
            }
          }
        });

        const availableOnDate = Math.max(0, totalRooms - bookedRooms);
        minAvailable = Math.min(minAvailable, availableOnDate);

        // Room is unavailable if no rooms left on any date
        if (availableOnDate === 0) {
          isAvailable = false;
          break;
        }
      }

      // Show all rooms that have at least 1 available (not fully booked)
      // The roomsNeeded parameter is informational - users can select multiple rooms
      if (isAvailable && minAvailable > 0) {
        availableRooms.push({
          ...roomType,
          available_rooms: minAvailable,
        });
      }
    }

    // The result includes metadata about whether enough rooms are available
    return {
      data: availableRooms,
      error: null,
      totalAvailable: availableRooms.length,
      roomsNeeded: roomsNeeded,
      hasEnoughRooms: availableRooms.length >= roomsNeeded
    };
  } catch (error) {
    console.error('Error getting available room types:', error);
    return { data: null, error };
  }
};

/**
 * Get available rooms for date range - for booking form multi-select
 * Returns list of room types that are available (not fully booked) for selected dates
 * Uses supabasePublic client to avoid auth session issues on public pages
 */
export const getAvailableRoomsForBooking = async (startDate, endDate) => {
  try {
    if (!startDate || !endDate) {
      return { data: [], error: null };
    }

    // Get all active room types
    const { data: roomTypes, error: roomError } = await supabasePublic
      .from('room_types')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (roomError) throw roomError;

    if (!roomTypes || roomTypes.length === 0) {
      return { data: [], error: null };
    }

    // Helper function to format date in local timezone (YYYY-MM-DD)
    const formatLocalDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    // Generate array of dates in the range (excluding checkout date)
    const dates = [];
    const start = new Date(startDate + 'T00:00:00');
    const end = new Date(endDate + 'T00:00:00');
    for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
      dates.push(formatLocalDate(d));
    }

    // Get ALL overlapping bookings across all room types
    // Only confirmed and checked_in bookings reduce room availability (NOT pending)
    const { data: allBookings, error: bookingError } = await supabasePublic
      .from('bookings')
      .select('id, check_in_date, check_out_date, number_of_rooms, room_id, room_ids, status')
      .in('status', ['confirmed', 'checked_in'])
      .lt('check_in_date', endDate)
      .gt('check_out_date', startDate);

    if (bookingError) {
      console.error('Error fetching bookings:', bookingError);
    }

    const bookings = allBookings || [];

    // Filter room types that have at least 1 room available for ALL dates in the range
    const availableRooms = [];

    for (const roomType of roomTypes) {
      // Each room type represents a single physical room
      const totalRooms = roomType.total_rooms || 1;

      // Check availability for each date
      let isAvailable = true;
      let minAvailable = totalRooms;

      for (const date of dates) {
        let bookedRooms = 0;

        bookings.forEach(booking => {
          // Check if this booking covers this date
          if (booking.check_in_date <= date && booking.check_out_date > date) {
            // Check if this room type is in the booking's room_ids array
            // room_ids contains the list of all room types in the booking
            const roomIdsArray = booking.room_ids || [];

            if (Array.isArray(roomIdsArray) && roomIdsArray.length > 0) {
              // Count how many times this room type appears in room_ids
              const countInBooking = roomIdsArray.filter(id => id === roomType.id).length;
              bookedRooms += countInBooking;
            } else if (booking.room_id === roomType.id) {
              // Fallback: if room_ids not available, use room_id with number_of_rooms
              bookedRooms += booking.number_of_rooms || 1;
            }
          }
        });

        const availableOnDate = Math.max(0, totalRooms - bookedRooms);
        minAvailable = Math.min(minAvailable, availableOnDate);

        // If no rooms available on any date, this room type is not available
        if (availableOnDate === 0) {
          isAvailable = false;
          break;
        }
      }

      // Only include rooms that are available for the entire date range
      if (isAvailable && minAvailable > 0) {
        availableRooms.push({
          ...roomType,
          available_rooms: minAvailable,
        });
      }
    }

    return { data: availableRooms, error: null };
  } catch (error) {
    console.error('Error getting available rooms for booking:', error);
    return { data: null, error };
  }
};

