// src/services/ratePlansService.js
import { supabase } from '../config/supabaseClient';

/**
 * Rate Plans Service
 * Handles all database operations for rate plans and room rates
 */

// ============================================
// Rate Plans
// ============================================

// Get all rate plans
export const getAllRatePlans = async () => {
  try {
    const { data, error } = await supabase
      .from('rate_plans')
      .select('*, room_types(id, name, slug)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching rate plans:', error);
    return { data: null, error };
  }
};

// Get active rate plans
export const getActiveRatePlans = async () => {
  try {
    const { data, error } = await supabase
      .from('rate_plans')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching active rate plans:', error);
    return { data: null, error };
  }
};

// Get rate plan by ID
export const getRatePlanById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('rate_plans')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching rate plan:', error);
    return { data: null, error };
  }
};

// Create rate plan
export const createRatePlan = async (planData) => {
  try {
    const plan = {
      ...planData,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('rate_plans')
      .insert([plan])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating rate plan:', error);
    return { data: null, error };
  }
};

// Update rate plan
export const updateRatePlan = async (id, planData) => {
  try {
    const updates = {
      ...planData,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('rate_plans')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating rate plan:', error);
    return { data: null, error };
  }
};

// Delete rate plan
export const deleteRatePlan = async (id) => {
  try {
    const { error } = await supabase
      .from('rate_plans')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error deleting rate plan:', error);
    return { error };
  }
};

// Toggle rate plan status
export const toggleRatePlanStatus = async (id, isActive) => {
  try {
    const { data, error } = await supabase
      .from('rate_plans')
      .update({ is_active: isActive, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error toggling rate plan status:', error);
    return { data: null, error };
  }
};

// Get valid rate plans for date range
export const getValidRatePlans = async (startDate, endDate) => {
  try {
    const { data, error } = await supabase
      .from('rate_plans')
      .select('*')
      .eq('is_active', true)
      .lte('valid_from', endDate)
      .gte('valid_to', startDate);

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching valid rate plans:', error);
    return { data: null, error };
  }
};

// ============================================
// Room Rates (Calendar)
// ============================================

// Get room rates for date range
export const getRoomRatesForDateRange = async (startDate, endDate, roomTypeId = null) => {
  try {
    let query = supabase
      .from('room_rates')
      .select('*, room_types(id, name, slug)')
      .gte('rate_date', startDate)
      .lte('rate_date', endDate)
      .order('rate_date', { ascending: true });

    if (roomTypeId) {
      query = query.eq('room_type_id', roomTypeId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching room rates:', error);
    return { data: null, error };
  }
};

// Get all room rates for a month
export const getRoomRatesForMonth = async (year, month) => {
  try {
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const endDate = new Date(year, month, 0).toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('room_rates')
      .select(`
        *,
        room_type:room_types(id, name, slug),
        rate_plan:rate_plans(id, name, plan_type)
      `)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching room rates for month:', error);
    return { data: null, error };
  }
};

// Create or update room rate
export const upsertRoomRate = async (rateData) => {
  try {
    const rate = {
      ...rateData,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('room_rates')
      .upsert([rate], { onConflict: 'room_type_id,rate_date' })
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error upserting room rate:', error);
    return { data: null, error };
  }
};

// Bulk update room rates
export const bulkUpdateRoomRates = async (rates) => {
  try {
    const ratesWithTimestamp = rates.map(rate => ({
      ...rate,
      updated_at: new Date().toISOString(),
    }));

    const { data, error } = await supabase
      .from('room_rates')
      .upsert(ratesWithTimestamp, { onConflict: 'room_type_id,date' })
      .select();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error bulk updating room rates:', error);
    return { data: null, error };
  }
};

// Delete room rate
export const deleteRoomRate = async (id) => {
  try {
    const { error } = await supabase
      .from('room_rates')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error deleting room rate:', error);
    return { error };
  }
};

// Get room rate for specific date
export const getRoomRateForDate = async (roomTypeId, date) => {
  try {
    const { data, error } = await supabase
      .from('room_rates')
      .select(`
        *,
        room_type:room_types(id, name, slug, base_price),
        rate_plan:rate_plans(id, name, plan_type, discount_type, discount_value)
      `)
      .eq('room_type_id', roomTypeId)
      .eq('date', date)
      .single();

    if (error && error.code === 'PGRST116') {
      // No rate found, return null
      return { data: null, error: null };
    }

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching room rate for date:', error);
    return { data: null, error };
  }
};

