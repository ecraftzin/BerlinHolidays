// src/services/specialOffersService.js
import { supabase } from '../config/supabaseClient';

/**
 * Special Offers Service
 * Handles all database operations for special offers
 */

// Get all special offers
export const getAllSpecialOffers = async () => {
  try {
    const { data, error } = await supabase
      .from('special_offers')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching special offers:', error);
    return { data: null, error };
  }
};

// Get active special offers
export const getActiveSpecialOffers = async () => {
  try {
    const { data, error } = await supabase
      .from('special_offers')
      .select('*')
      .eq('status', 'active')
      .order('display_order', { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching active special offers:', error);
    return { data: null, error };
  }
};

// Get featured special offers
export const getFeaturedSpecialOffers = async () => {
  try {
    const { data, error } = await supabase
      .from('special_offers')
      .select('*')
      .eq('is_featured', true)
      .eq('status', 'active')
      .order('display_order', { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching featured special offers:', error);
    return { data: null, error };
  }
};

// Get special offer by ID
export const getSpecialOfferById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('special_offers')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching special offer:', error);
    return { data: null, error };
  }
};

// Get special offer by slug
export const getSpecialOfferBySlug = async (slug) => {
  try {
    const { data, error } = await supabase
      .from('special_offers')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching special offer:', error);
    return { data: null, error };
  }
};

// Create special offer
export const createSpecialOffer = async (offerData) => {
  try {
    const offer = {
      ...offerData,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('special_offers')
      .insert([offer])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating special offer:', error);
    return { data: null, error };
  }
};

// Update special offer
export const updateSpecialOffer = async (id, offerData) => {
  try {
    const updates = {
      ...offerData,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('special_offers')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating special offer:', error);
    return { data: null, error };
  }
};

// Delete special offer
export const deleteSpecialOffer = async (id) => {
  try {
    const { error } = await supabase
      .from('special_offers')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error deleting special offer:', error);
    return { error };
  }
};

// Update offer status
export const updateOfferStatus = async (id, status) => {
  try {
    const { data, error } = await supabase
      .from('special_offers')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating offer status:', error);
    return { data: null, error };
  }
};

// Toggle featured status
export const toggleOfferFeatured = async (id, isFeatured) => {
  try {
    const { data, error } = await supabase
      .from('special_offers')
      .update({ is_featured: isFeatured, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error toggling featured status:', error);
    return { data: null, error };
  }
};

// Increment booking count
export const incrementOfferBookings = async (id) => {
  try {
    const { data: offer } = await getSpecialOfferById(id);
    if (!offer) throw new Error('Offer not found');

    const newCount = (offer.current_bookings || 0) + 1;

    const { data, error } = await supabase
      .from('special_offers')
      .update({ current_bookings: newCount, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error incrementing offer bookings:', error);
    return { data: null, error };
  }
};

// Get valid offers for date range
export const getValidOffersForDateRange = async (startDate, endDate) => {
  try {
    const { data, error } = await supabase
      .from('special_offers')
      .select('*')
      .eq('status', 'active')
      .lte('valid_from', endDate)
      .gte('valid_to', startDate)
      .order('discount_value', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching valid offers:', error);
    return { data: null, error };
  }
};

