// src/services/availabilityService.js
import { supabase } from '../config/supabaseClient';

/**
 * Room Availability Service
 * Handles all database operations for room availability
 */

// Get room availability for date range
export const getRoomAvailabilityForDateRange = async (roomTypeId, startDate, endDate) => {
  try {
    const { data, error } = await supabase
      .from('room_availability')
      .select(`
        *,
        room_type:room_types(id, name, slug, total_rooms)
      `)
      .eq('room_type_id', roomTypeId)
      .gte('availability_date', startDate)
      .lte('availability_date', endDate)
      .order('availability_date', { ascending: true });

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
    const endDate = new Date(year, month, 0).toISOString().split('T')[0];

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
      .eq('availability_date', date)
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
      .upsert([availability], { onConflict: 'room_type_id,availability_date' })
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
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Generate array of dates
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dates.push(d.toISOString().split('T')[0]);
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
    const start = new Date(startDate);
    const end = new Date(endDate);

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dates.push(d.toISOString().split('T')[0]);
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

// Check availability for booking
export const checkAvailabilityForBooking = async (roomTypeId, startDate, endDate, roomsNeeded = 1) => {
  try {
    const { data, error } = await getRoomAvailabilityForDateRange(roomTypeId, startDate, endDate);

    if (error) throw error;

    // Check if all dates have enough availability
    const isAvailable = data && data.every(avail => 
      avail.available_rooms >= roomsNeeded && avail.status !== 'blocked'
    );

    return { data: { isAvailable, availability: data }, error: null };
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

