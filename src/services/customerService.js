// src/services/customerService.js
import { supabase } from "../config/supabaseClient";

/**
 * Customer Service
 * Handles all database operations for customer profiles and bookings
 */

// ============================================
// Customer Profile Operations
// ============================================

// Get customer profile by user ID
export const getCustomerProfile = async (userId) => {
  try {
    const { data, error } = await supabase
      .from("customer_profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error fetching customer profile:", error);
    return { data: null, error };
  }
};

// Create new customer profile
export const createCustomerProfile = async (profileData) => {
  try {
    const { data, error } = await supabase
      .from("customer_profiles")
      .insert([profileData])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error creating customer profile:", error);
    return { data: null, error };
  }
};

// Update customer profile
export const updateCustomerProfile = async (userId, updates) => {
  try {
    const { data, error } = await supabase
      .from("customer_profiles")
      .update(updates)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error updating customer profile:", error);
    return { data: null, error };
  }
};

// Check if email already exists
export const checkEmailExists = async (email) => {
  try {
    const { data, error } = await supabase
      .from("customer_profiles")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (error) throw error;
    return { exists: !!data, error: null };
  } catch (error) {
    console.error("Error checking email:", error);
    return { exists: false, error };
  }
};

// ============================================
// Booking Operations
// ============================================

// Get customer bookings - matches by user_id OR customer_email
export const getCustomerBookings = async (userId, userEmail = null) => {
  try {
    // If we have an email, search by both user_id OR customer_email
    // This ensures older bookings (before user_id was added) still show up
    if (userEmail) {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .or(`user_id.eq.${userId},customer_email.ilike.${userEmail}`)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } else {
      // Fallback to just user_id if no email provided
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return { data, error: null };
    }
  } catch (error) {
    console.error("Error fetching customer bookings:", error);
    return { data: null, error };
  }
};

// Get single booking by ID
export const getBookingById = async (bookingId) => {
  try {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error fetching booking:", error);
    return { data: null, error };
  }
};

// Create new booking
export const createBooking = async (bookingData) => {
  try {
    const { data, error } = await supabase
      .from("bookings")
      .insert([bookingData])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error creating booking:", error);
    return { data: null, error };
  }
};

// Cancel booking
export const cancelBooking = async (bookingId, userId) => {
  try {
    const { data, error } = await supabase
      .from("bookings")
      .update({ status: "cancelled" })
      .eq("id", bookingId)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error cancelling booking:", error);
    return { data: null, error };
  }
};

export default {
  getCustomerProfile,
  createCustomerProfile,
  updateCustomerProfile,
  checkEmailExists,
  getCustomerBookings,
  getBookingById,
  createBooking,
  cancelBooking,
};

