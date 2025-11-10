// src/services/faqService.js
import { supabase } from '../config/supabaseClient';

/**
 * FAQ Service
 * Handles all database operations for FAQs
 */

// Get all FAQs
export const getAllFAQs = async () => {
  try {
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return { data: null, error };
  }
};

// Get active FAQs
export const getActiveFAQs = async () => {
  try {
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching active FAQs:', error);
    return { data: null, error };
  }
};

// Get FAQ by ID
export const getFAQById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching FAQ:', error);
    return { data: null, error };
  }
};

// Create new FAQ
export const createFAQ = async (faqData) => {
  try {
    const { data, error } = await supabase
      .from('faqs')
      .insert([faqData])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating FAQ:', error);
    return { data: null, error };
  }
};

// Update FAQ
export const updateFAQ = async (id, faqData) => {
  try {
    const { data, error } = await supabase
      .from('faqs')
      .update({ ...faqData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating FAQ:', error);
    return { data: null, error };
  }
};

// Delete FAQ
export const deleteFAQ = async (id) => {
  try {
    const { error } = await supabase
      .from('faqs')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { data: true, error: null };
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    return { data: null, error };
  }
};

// Toggle FAQ active status
export const toggleFAQStatus = async (id, isActive) => {
  try {
    const { data, error } = await supabase
      .from('faqs')
      .update({ is_active: isActive, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error toggling FAQ status:', error);
    return { data: null, error };
  }
};

