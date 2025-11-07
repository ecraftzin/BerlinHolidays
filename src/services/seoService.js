// src/services/seoService.js
import { supabase } from '../config/supabaseClient';

/**
 * SEO Settings Service
 * Handles all database operations for SEO settings
 */

// ============================================
// Global SEO Settings
// ============================================

// Get global SEO settings
export const getGlobalSEOSettings = async () => {
  try {
    const { data, error } = await supabase
      .from('seo_global_settings')
      .select('*')
      .limit(1)
      .single();

    if (error && error.code === 'PGRST116') {
      // No settings found, return default
      return { data: null, error: null };
    }

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching global SEO settings:', error);
    return { data: null, error };
  }
};

// Update global SEO settings
export const updateGlobalSEOSettings = async (settings) => {
  try {
    // Check if settings exist
    const { data: existing } = await getGlobalSEOSettings();

    let result;
    if (existing) {
      // Update existing settings
      result = await supabase
        .from('seo_global_settings')
        .update({ ...settings, updated_at: new Date().toISOString() })
        .eq('id', existing.id)
        .select()
        .single();
    } else {
      // Create new settings
      result = await supabase
        .from('seo_global_settings')
        .insert([settings])
        .select()
        .single();
    }

    if (result.error) throw result.error;
    return { data: result.data, error: null };
  } catch (error) {
    console.error('Error updating global SEO settings:', error);
    return { data: null, error };
  }
};

// ============================================
// Page-specific SEO Settings
// ============================================

// Get all page SEO settings
export const getAllPageSEOSettings = async () => {
  try {
    const { data, error } = await supabase
      .from('seo_page_settings')
      .select('*')
      .order('page_path', { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching page SEO settings:', error);
    return { data: null, error };
  }
};

// Get SEO settings for specific page
export const getPageSEOSettings = async (pagePath) => {
  try {
    const { data, error } = await supabase
      .from('seo_page_settings')
      .select('*')
      .eq('page_path', pagePath)
      .single();

    if (error && error.code === 'PGRST116') {
      return { data: null, error: null };
    }

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching page SEO settings:', error);
    return { data: null, error };
  }
};

// Create page SEO settings
export const createPageSEOSettings = async (pageSettings, isDraft = false) => {
  try {
    const settings = {
      ...pageSettings,
      status: isDraft ? 'draft' : 'published',
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('seo_page_settings')
      .insert([settings])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating page SEO settings:', error);
    return { data: null, error };
  }
};

// Update page SEO settings
export const updatePageSEOSettings = async (id, pageSettings, isDraft = false) => {
  try {
    const updates = {
      ...pageSettings,
      status: isDraft ? 'draft' : 'published',
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('seo_page_settings')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating page SEO settings:', error);
    return { data: null, error };
  }
};

// Delete page SEO settings
export const deletePageSEOSettings = async (id) => {
  try {
    const { error } = await supabase
      .from('seo_page_settings')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error deleting page SEO settings:', error);
    return { error };
  }
};

// Get published page SEO settings
export const getPublishedPageSEOSettings = async () => {
  try {
    const { data, error } = await supabase
      .from('seo_page_settings')
      .select('*')
      .eq('status', 'published')
      .order('page_path', { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching published page SEO settings:', error);
    return { data: null, error };
  }
};

