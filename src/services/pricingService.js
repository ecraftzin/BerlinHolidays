// src/services/pricingService.js
import { supabase } from '../config/supabaseClient';

/**
 * Pricing Plans Service
 * Handles all database operations for pricing plans
 */

// Get all pricing plans
export const getAllPricingPlans = async () => {
  try {
    const { data, error } = await supabase
      .from('pricing_plans')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching pricing plans:', error);
    return { data: null, error };
  }
};

// Get active pricing plans
export const getActivePricingPlans = async () => {
  try {
    const { data, error } = await supabase
      .from('pricing_plans')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching active pricing plans:', error);
    return { data: null, error };
  }
};

// Get pricing plan by ID
export const getPricingPlanById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('pricing_plans')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching pricing plan:', error);
    return { data: null, error };
  }
};

// Create pricing plan
export const createPricingPlan = async (planData) => {
  try {
    const plan = {
      ...planData,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('pricing_plans')
      .insert([plan])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating pricing plan:', error);
    return { data: null, error };
  }
};

// Update pricing plan
export const updatePricingPlan = async (id, planData) => {
  try {
    const updates = {
      ...planData,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('pricing_plans')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating pricing plan:', error);
    return { data: null, error };
  }
};

// Delete pricing plan
export const deletePricingPlan = async (id) => {
  try {
    const { error } = await supabase
      .from('pricing_plans')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error deleting pricing plan:', error);
    return { error };
  }
};

// Toggle pricing plan status
export const togglePricingPlanStatus = async (id, isActive) => {
  try {
    const { data, error } = await supabase
      .from('pricing_plans')
      .update({ is_active: isActive, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error toggling pricing plan status:', error);
    return { data: null, error };
  }
};

// Get valid pricing plans for date range
export const getValidPricingPlans = async (startDate, endDate) => {
  try {
    const { data, error } = await supabase
      .from('pricing_plans')
      .select('*')
      .eq('is_active', true)
      .lte('valid_from', endDate)
      .gte('valid_to', startDate)
      .order('discount_value', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching valid pricing plans:', error);
    return { data: null, error };
  }
};

