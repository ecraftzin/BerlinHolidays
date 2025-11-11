// src/services/servicesService.js
import { supabase } from '../config/supabaseClient';

/**
 * Services Service
 * Handles all database operations for services
 */

// Get all services
export const getAllServices = async () => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching services:', error);
    return { data: null, error };
  }
};

// Get published services only (for website)
export const getPublishedServices = async () => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('status', 'published')
      .order('display_order', { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching published services:', error);
    return { data: null, error };
  }
};

// Get single service by ID
export const getServiceById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching service:', error);
    return { data: null, error };
  }
};

// Create new service
export const createService = async (serviceData) => {
  try {
    const { data, error } = await supabase
      .from('services')
      .insert([serviceData])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating service:', error);
    return { data: null, error };
  }
};

// Update service
export const updateService = async (id, serviceData) => {
  try {
    const { data, error } = await supabase
      .from('services')
      .update(serviceData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating service:', error);
    return { data: null, error };
  }
};

// Delete service
export const deleteService = async (id) => {
  try {
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error deleting service:', error);
    return { error };
  }
};

// Update service status (publish/draft)
export const updateServiceStatus = async (id, status) => {
  try {
    const { data, error } = await supabase
      .from('services')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating service status:', error);
    return { data: null, error };
  }
};

// Bulk update display order
export const updateServicesOrder = async (services) => {
  try {
    const updates = services.map((service, index) => 
      supabase
        .from('services')
        .update({ display_order: index })
        .eq('id', service.id)
    );

    await Promise.all(updates);
    return { error: null };
  } catch (error) {
    console.error('Error updating services order:', error);
    return { error };
  }
};

