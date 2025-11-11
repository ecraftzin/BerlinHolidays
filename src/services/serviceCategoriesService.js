// src/services/serviceCategoriesService.js
import { supabase } from '../config/supabaseClient';

/**
 * Service Categories Service
 * Handles all CRUD operations for service categories
 */

// Get all service categories
export const getAllCategories = async () => {
  try {
    const { data, error } = await supabase
      .from('service_categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching categories:', error);
    return { data: null, error };
  }
};

// Create a new category
export const createCategory = async (name) => {
  try {
    const { data, error } = await supabase
      .from('service_categories')
      .insert([{ name: name.trim() }])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating category:', error);
    return { data: null, error };
  }
};

// Update a category
export const updateCategory = async (id, name) => {
  try {
    const { data, error } = await supabase
      .from('service_categories')
      .update({ name: name.trim() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating category:', error);
    return { data: null, error };
  }
};

// Delete a category
export const deleteCategory = async (id) => {
  try {
    const { error } = await supabase
      .from('service_categories')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error deleting category:', error);
    return { error };
  }
};

export default {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};

