// src/services/contactService.js
import { supabase } from '../config/supabaseClient';

/**
 * Contact Inquiries Service
 * Handles all database operations for contact form submissions
 */

/**
 * Submit a contact form inquiry
 * @param {Object} formData - The contact form data
 * @param {string} formData.name - Customer's name
 * @param {string} formData.email - Customer's email
 * @param {string} formData.subject - Inquiry subject
 * @param {string} formData.message - Inquiry message
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const submitContactInquiry = async (formData) => {
  try {
    const { data, error } = await supabase
      .from('contact_inquiries')
      .insert([
        {
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          status: 'new',
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error submitting contact inquiry:', error);
    return { data: null, error };
  }
};

/**
 * Get all contact inquiries (for admin dashboard)
 * @returns {Promise<{data: Array|null, error: Error|null}>}
 */
export const getAllContactInquiries = async () => {
  try {
    const { data, error } = await supabase
      .from('contact_inquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching contact inquiries:', error);
    return { data: null, error };
  }
};

/**
 * Get contact inquiries by status
 * @param {string} status - The status to filter by ('new', 'read', 'replied', 'archived')
 * @returns {Promise<{data: Array|null, error: Error|null}>}
 */
export const getContactInquiriesByStatus = async (status) => {
  try {
    const { data, error } = await supabase
      .from('contact_inquiries')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching contact inquiries by status:', error);
    return { data: null, error };
  }
};

/**
 * Update contact inquiry status
 * @param {string} id - The inquiry ID
 * @param {string} status - The new status
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const updateContactInquiryStatus = async (id, status) => {
  try {
    const { data, error } = await supabase
      .from('contact_inquiries')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error updating contact inquiry status:', error);
    return { data: null, error };
  }
};

/**
 * Delete a contact inquiry
 * @param {string} id - The inquiry ID
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const deleteContactInquiry = async (id) => {
  try {
    const { data, error } = await supabase
      .from('contact_inquiries')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error deleting contact inquiry:', error);
    return { data: null, error };
  }
};

/**
 * Get a single contact inquiry by ID
 * @param {string} id - The inquiry ID
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const getContactInquiryById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('contact_inquiries')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching contact inquiry:', error);
    return { data: null, error };
  }
};

