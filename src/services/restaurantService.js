// src/services/restaurantService.js
import { supabase } from '../config/supabaseClient';

/**
 * Restaurant Service
 * Handles all database operations for restaurant categories and menu items
 */

// ============================================
// Restaurant Categories
// ============================================

// Get all categories
export const getAllCategories = async () => {
  try {
    const { data, error } = await supabase
      .from('restaurant_categories')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching categories:', error);
    return { data: null, error };
  }
};

// Get active categories
export const getActiveCategories = async () => {
  try {
    const { data, error } = await supabase
      .from('restaurant_categories')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching active categories:', error);
    return { data: null, error };
  }
};

// Get category by ID
export const getCategoryById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('restaurant_categories')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching category:', error);
    return { data: null, error };
  }
};

// Create category
export const createCategory = async (categoryData) => {
  try {
    const category = {
      ...categoryData,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('restaurant_categories')
      .insert([category])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating category:', error);
    return { data: null, error };
  }
};

// Update category
export const updateCategory = async (id, categoryData) => {
  try {
    const updates = {
      ...categoryData,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('restaurant_categories')
      .update(updates)
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

// Delete category
export const deleteCategory = async (id) => {
  try {
    const { error } = await supabase
      .from('restaurant_categories')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error deleting category:', error);
    return { error };
  }
};

// Toggle category status
export const toggleCategoryStatus = async (id, isActive) => {
  try {
    const { data, error } = await supabase
      .from('restaurant_categories')
      .update({ is_active: isActive, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error toggling category status:', error);
    return { data: null, error };
  }
};

// ============================================
// Restaurant Menu Items
// ============================================

// Get all menu items
export const getAllMenuItems = async () => {
  try {
    const { data, error } = await supabase
      .from('restaurant_menu_items')
      .select(`
        *,
        category:restaurant_categories(id, name, slug)
      `)
      .order('display_order', { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return { data: null, error };
  }
};

// Get menu items by category
export const getMenuItemsByCategory = async (categoryId) => {
  try {
    const { data, error } = await supabase
      .from('restaurant_menu_items')
      .select('*')
      .eq('category_id', categoryId)
      .order('display_order', { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching menu items by category:', error);
    return { data: null, error };
  }
};

// Get available menu items
export const getAvailableMenuItems = async () => {
  try {
    const { data, error } = await supabase
      .from('restaurant_menu_items')
      .select(`
        *,
        category:restaurant_categories(id, name, slug)
      `)
      .eq('is_available', true)
      .order('display_order', { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching available menu items:', error);
    return { data: null, error };
  }
};

// Get featured menu items
export const getFeaturedMenuItems = async () => {
  try {
    const { data, error } = await supabase
      .from('restaurant_menu_items')
      .select(`
        *,
        category:restaurant_categories(id, name, slug)
      `)
      .eq('is_featured', true)
      .eq('is_available', true)
      .order('display_order', { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching featured menu items:', error);
    return { data: null, error };
  }
};

// Get menu item by ID
export const getMenuItemById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('restaurant_menu_items')
      .select(`
        *,
        category:restaurant_categories(id, name, slug)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching menu item:', error);
    return { data: null, error };
  }
};

// Create menu item
export const createMenuItem = async (itemData) => {
  try {
    const item = {
      ...itemData,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('restaurant_menu_items')
      .insert([item])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating menu item:', error);
    return { data: null, error };
  }
};

// Update menu item
export const updateMenuItem = async (id, itemData) => {
  try {
    const updates = {
      ...itemData,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('restaurant_menu_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating menu item:', error);
    return { data: null, error };
  }
};

// Delete menu item
export const deleteMenuItem = async (id) => {
  try {
    const { error } = await supabase
      .from('restaurant_menu_items')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error deleting menu item:', error);
    return { error };
  }
};

// Toggle menu item availability
export const toggleMenuItemAvailability = async (id, isAvailable) => {
  try {
    const { data, error } = await supabase
      .from('restaurant_menu_items')
      .update({ is_available: isAvailable, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error toggling menu item availability:', error);
    return { data: null, error };
  }
};

// Toggle menu item featured status
export const toggleMenuItemFeatured = async (id, isFeatured) => {
  try {
    const { data, error } = await supabase
      .from('restaurant_menu_items')
      .update({ is_featured: isFeatured, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error toggling menu item featured status:', error);
    return { data: null, error };
  }
};

