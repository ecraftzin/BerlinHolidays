// src/services/roomService.js
import { supabase } from '../config/supabaseClient';

/**
 * Room Types Service
 * Handles all database operations for room types
 */

// Get all room types
export const getAllRoomTypes = async () => {
  try {
    const { data, error } = await supabase
      .from('room_types')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching room types:', error);
    return { data: null, error };
  }
};

// Get active room types only
export const getActiveRoomTypes = async () => {
  try {
    const { data, error } = await supabase
      .from('room_types')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching active room types:', error);
    return { data: null, error };
  }
};

// Get single room type by ID
export const getRoomTypeById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('room_types')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching room type:', error);
    return { data: null, error };
  }
};

// Get room type by slug
export const getRoomTypeBySlug = async (slug) => {
  try {
    const { data, error } = await supabase
      .from('room_types')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching room type:', error);
    return { data: null, error };
  }
};

// Create new room type
export const createRoomType = async (roomData) => {
  try {
    const room = {
      ...roomData,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('room_types')
      .insert([room])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating room type:', error);
    return { data: null, error };
  }
};

// Update room type
export const updateRoomType = async (id, roomData) => {
  try {
    const updates = {
      ...roomData,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('room_types')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating room type:', error);
    return { data: null, error };
  }
};

// Delete room type
export const deleteRoomType = async (id) => {
  try {
    const { error } = await supabase
      .from('room_types')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error deleting room type:', error);
    return { error };
  }
};

// Toggle room type active status
export const toggleRoomTypeStatus = async (id, isActive) => {
  try {
    const { data, error } = await supabase
      .from('room_types')
      .update({ is_active: isActive, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error toggling room type status:', error);
    return { data: null, error };
  }
};

// Update room availability
export const updateRoomAvailability = async (id, totalRooms, availableRooms) => {
  try {
    const { data, error } = await supabase
      .from('room_types')
      .update({
        total_rooms: totalRooms,
        available_rooms: availableRooms,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating room availability:', error);
    return { data: null, error };
  }
};

// Get room statistics
export const getRoomStatistics = async () => {
  try {
    const { data: rooms, error } = await supabase
      .from('room_types')
      .select('total_rooms, available_rooms, is_active');

    if (error) throw error;

    const stats = {
      totalRoomTypes: rooms.length,
      activeRoomTypes: rooms.filter(r => r.is_active).length,
      totalRooms: rooms.reduce((sum, r) => sum + (r.total_rooms || 0), 0),
      availableRooms: rooms.reduce((sum, r) => sum + (r.available_rooms || 0), 0),
      occupancyRate: 0,
    };

    if (stats.totalRooms > 0) {
      stats.occupancyRate = ((stats.totalRooms - stats.availableRooms) / stats.totalRooms * 100).toFixed(2);
    }

    return { data: stats, error: null };
  } catch (error) {
    console.error('Error fetching room statistics:', error);
    return { data: null, error };
  }
};

