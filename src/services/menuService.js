import { supabase } from "../config/supabaseClient";

// =============================================
// MENU CATEGORIES OPERATIONS
// =============================================

/**
 * Get all menu categories
 */
export const getAllCategories = async () => {
  try {
    const { data, error } = await supabase
      .from("menu_categories")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { data: null, error };
  }
};

/**
 * Get active menu categories only
 */
export const getActiveCategories = async () => {
  try {
    const { data, error } = await supabase
      .from("menu_categories")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error fetching active categories:", error);
    return { data: null, error };
  }
};

/**
 * Get category by ID
 */
export const getCategoryById = async (id) => {
  try {
    const { data, error } = await supabase
      .from("menu_categories")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error fetching category:", error);
    return { data: null, error };
  }
};

/**
 * Create a new category
 */
export const createCategory = async (categoryData) => {
  try {
    const { data, error } = await supabase
      .from("menu_categories")
      .insert([categoryData])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error creating category:", error);
    return { data: null, error };
  }
};

/**
 * Update a category
 */
export const updateCategory = async (id, categoryData) => {
  try {
    const { data, error } = await supabase
      .from("menu_categories")
      .update({ ...categoryData, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error updating category:", error);
    return { data: null, error };
  }
};

/**
 * Delete a category
 */
export const deleteCategory = async (id) => {
  try {
    const { error } = await supabase
      .from("menu_categories")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return { data: true, error: null };
  } catch (error) {
    console.error("Error deleting category:", error);
    return { data: null, error };
  }
};

// =============================================
// MENU ITEMS OPERATIONS
// =============================================

/**
 * Get all menu items
 */
export const getAllMenuItems = async () => {
  try {
    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error fetching menu items:", error);
    return { data: null, error };
  }
};

/**
 * Get active and available menu items only (for website)
 */
export const getActiveMenuItems = async () => {
  try {
    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .eq("is_active", true)
      .eq("is_available", true)
      .order("display_order", { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error fetching active menu items:", error);
    return { data: null, error };
  }
};

/**
 * Get menu items by category
 */
export const getMenuItemsByCategory = async (categoryName) => {
  try {
    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .eq("category_name", categoryName)
      .eq("is_active", true)
      .eq("is_available", true)
      .order("display_order", { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error fetching menu items by category:", error);
    return { data: null, error };
  }
};

/**
 * Get menu item by ID
 */
export const getMenuItemById = async (id) => {
  try {
    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error fetching menu item:", error);
    return { data: null, error };
  }
};

/**
 * Create a new menu item
 */
export const createMenuItem = async (itemData) => {
  try {
    const { data, error } = await supabase
      .from("menu_items")
      .insert([itemData])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error creating menu item:", error);
    return { data: null, error };
  }
};

/**
 * Update a menu item
 */
export const updateMenuItem = async (id, itemData) => {
  try {
    const { data, error } = await supabase
      .from("menu_items")
      .update({ ...itemData, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error updating menu item:", error);
    return { data: null, error };
  }
};

/**
 * Delete a menu item
 */
export const deleteMenuItem = async (id) => {
  try {
    const { error } = await supabase
      .from("menu_items")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return { data: true, error: null };
  } catch (error) {
    console.error("Error deleting menu item:", error);
    return { data: null, error };
  }
};

/**
 * Toggle menu item availability
 */
export const toggleMenuItemAvailability = async (id, isAvailable) => {
  try {
    const { data, error } = await supabase
      .from("menu_items")
      .update({ is_available: isAvailable, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error toggling menu item availability:", error);
    return { data: null, error };
  }
};

/**
 * Get category counts (number of items per category)
 */
export const getCategoryCounts = async () => {
  try {
    const { data, error } = await supabase
      .from("menu_items")
      .select("category_name");

    if (error) throw error;

    // Count items per category
    const counts = data.reduce((acc, item) => {
      acc[item.category_name] = (acc[item.category_name] || 0) + 1;
      return acc;
    }, {});

    return { data: counts, error: null };
  } catch (error) {
    console.error("Error getting category counts:", error);
    return { data: null, error };
  }
};

