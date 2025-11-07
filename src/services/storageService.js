// src/services/storageService.js
import { supabase } from '../config/supabaseClient';

/**
 * Storage Service
 * Handles all file upload operations to Supabase Storage
 */

// Upload image to Supabase Storage
export const uploadImage = async (file, bucket = 'blog-images', folder = '') => {
  try {
    // Validate file
    if (!file) {
      throw new Error('No file provided');
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      throw new Error('Invalid file type. Please upload a JPEG, PNG, WebP, or GIF image.');
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      throw new Error('File size too large. Maximum size is 5MB.');
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExt = file.name.split('.').pop();
    const fileName = `${timestamp}-${randomString}.${fileExt}`;
    const filePath = folder ? `${folder}/${fileName}` : fileName;

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return {
      data: {
        path: data.path,
        publicUrl: publicUrl,
        fileName: fileName,
      },
      error: null,
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    return { data: null, error };
  }
};

// Upload multiple images
export const uploadMultipleImages = async (files, bucket = 'blog-images', folder = '') => {
  try {
    if (!files || files.length === 0) {
      throw new Error('No files provided');
    }

    const uploadPromises = files.map(file => uploadImage(file, bucket, folder));
    const results = await Promise.all(uploadPromises);

    const successfulUploads = results.filter(r => !r.error);
    const failedUploads = results.filter(r => r.error);

    return {
      data: {
        successful: successfulUploads.map(r => r.data),
        failed: failedUploads.map(r => r.error),
        total: files.length,
        successCount: successfulUploads.length,
        failCount: failedUploads.length,
      },
      error: failedUploads.length > 0 ? new Error(`${failedUploads.length} uploads failed`) : null,
    };
  } catch (error) {
    console.error('Error uploading multiple images:', error);
    return { data: null, error };
  }
};

// Delete image from Supabase Storage
export const deleteImage = async (filePath, bucket = 'blog-images') => {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error deleting image:', error);
    return { error };
  }
};

// Delete multiple images
export const deleteMultipleImages = async (filePaths, bucket = 'blog-images') => {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove(filePaths);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error deleting multiple images:', error);
    return { error };
  }
};

// Get public URL for an image
export const getImageUrl = (filePath, bucket = 'blog-images') => {
  try {
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return { data: publicUrl, error: null };
  } catch (error) {
    console.error('Error getting image URL:', error);
    return { data: null, error };
  }
};

// List all images in a folder
export const listImages = async (folder = '', bucket = 'blog-images') => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(folder, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' },
      });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error listing images:', error);
    return { data: null, error };
  }
};

// Get image metadata
export const getImageMetadata = async (filePath, bucket = 'blog-images') => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list('', {
        search: filePath,
      });

    if (error) throw error;
    return { data: data[0] || null, error: null };
  } catch (error) {
    console.error('Error getting image metadata:', error);
    return { data: null, error };
  }
};

// Update image (replace existing)
export const updateImage = async (file, oldFilePath, bucket = 'blog-images') => {
  try {
    // Delete old image
    await deleteImage(oldFilePath, bucket);

    // Upload new image
    const result = await uploadImage(file, bucket);
    return result;
  } catch (error) {
    console.error('Error updating image:', error);
    return { data: null, error };
  }
};

// Validate image file
export const validateImageFile = (file) => {
  const errors = [];

  // Check if file exists
  if (!file) {
    errors.push('No file provided');
    return { valid: false, errors };
  }

  // Check file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  if (!validTypes.includes(file.type)) {
    errors.push('Invalid file type. Please upload a JPEG, PNG, WebP, or GIF image.');
  }

  // Check file size (5MB max)
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  if (file.size > maxSize) {
    errors.push('File size too large. Maximum size is 5MB.');
  }

  // Check file name
  if (file.name.length > 255) {
    errors.push('File name too long. Maximum length is 255 characters.');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

// Format file size for display
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

// Create image preview URL
export const createImagePreview = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });
};

export default {
  uploadImage,
  uploadMultipleImages,
  deleteImage,
  deleteMultipleImages,
  getImageUrl,
  listImages,
  getImageMetadata,
  updateImage,
  validateImageFile,
  formatFileSize,
  createImagePreview,
};

