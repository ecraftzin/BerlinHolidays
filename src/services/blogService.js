// src/services/blogService.js
import { supabase } from '../config/supabaseClient';

/**
 * Blog Posts Service
 * Handles all database operations for blog posts
 */

// Fetch all blog posts
export const getAllBlogPosts = async () => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        blog_categories (
          id,
          name,
          slug
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Transform data to include category name at top level
    const transformedData = data?.map(post => ({
      ...post,
      category_name: post.blog_categories?.name || 'Uncategorized'
    }));

    return { data: transformedData, error: null };
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return { data: null, error };
  }
};

// Fetch published blog posts only
export const getPublishedBlogPosts = async () => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        blog_categories (
          id,
          name,
          slug
        )
      `)
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (error) throw error;

    // Transform data to include category name at top level
    const transformedData = data?.map(post => ({
      ...post,
      category_name: post.blog_categories?.name || 'Uncategorized'
    }));

    return { data: transformedData, error: null };
  } catch (error) {
    console.error('Error fetching published blog posts:', error);
    return { data: null, error };
  }
};

// Fetch single blog post by ID
export const getBlogPostById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        blog_categories (
          id,
          name,
          slug
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    // Transform data to include category name at top level
    const transformedData = data ? {
      ...data,
      category_name: data.blog_categories?.name || 'Uncategorized'
    } : null;

    return { data: transformedData, error: null };
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return { data: null, error };
  }
};

// Fetch single blog post by slug
export const getBlogPostBySlug = async (slug) => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        blog_categories (
          id,
          name,
          slug
        )
      `)
      .eq('slug', slug)
      .single();

    if (error) throw error;

    // Transform data to include category name at top level
    const transformedData = data ? {
      ...data,
      category_name: data.blog_categories?.name || 'Uncategorized'
    } : null;

    return { data: transformedData, error: null };
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return { data: null, error };
  }
};

// Create new blog post
export const createBlogPost = async (postData, isDraft = false) => {
  try {
    const post = {
      ...postData,
      status: isDraft ? 'draft' : 'published',
      published_at: isDraft ? null : new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('blog_posts')
      .insert([post])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating blog post:', error);
    return { data: null, error };
  }
};

// Update existing blog post
export const updateBlogPost = async (id, postData, isDraft = false) => {
  try {
    const updates = {
      ...postData,
      status: isDraft ? 'draft' : 'published',
      published_at: isDraft ? null : (postData.published_at || new Date().toISOString()),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('blog_posts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating blog post:', error);
    return { data: null, error };
  }
};

// Delete blog post
export const deleteBlogPost = async (id) => {
  try {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return { error };
  }
};

// Increment view count
export const incrementBlogPostViews = async (id) => {
  try {
    const { data, error } = await supabase.rpc('increment_blog_views', {
      post_id: id,
    });

    if (error) {
      // Fallback if RPC function doesn't exist
      const { data: post } = await getBlogPostById(id);
      if (post) {
        await supabase
          .from('blog_posts')
          .update({ views: (post.views || 0) + 1 })
          .eq('id', id);
      }
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error incrementing views:', error);
    return { data: null, error };
  }
};

// Search blog posts
export const searchBlogPosts = async (searchTerm) => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        blog_categories (
          id,
          name,
          slug
        )
      `)
      .or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Transform data to include category name at top level
    const transformedData = data?.map(post => ({
      ...post,
      category_name: post.blog_categories?.name || 'Uncategorized'
    }));

    return { data: transformedData, error: null };
  } catch (error) {
    console.error('Error searching blog posts:', error);
    return { data: null, error };
  }
};

// Get blog posts by category
export const getBlogPostsByCategory = async (categoryId) => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        blog_categories (
          id,
          name,
          slug
        )
      `)
      .eq('category_id', categoryId)
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (error) throw error;

    // Transform data to include category name at top level
    const transformedData = data?.map(post => ({
      ...post,
      category_name: post.blog_categories?.name || 'Uncategorized'
    }));

    return { data: transformedData, error: null };
  } catch (error) {
    console.error('Error fetching blog posts by category:', error);
    return { data: null, error };
  }
};

// Get blog statistics
export const getBlogStatistics = async () => {
  try {
    const { data: allPosts, error: allError } = await supabase
      .from('blog_posts')
      .select('id, status, views');

    if (allError) throw allError;

    const stats = {
      total: allPosts.length,
      published: allPosts.filter(p => p.status === 'published').length,
      draft: allPosts.filter(p => p.status === 'draft').length,
      totalViews: allPosts.reduce((sum, p) => sum + (p.views || 0), 0),
    };

    return { data: stats, error: null };
  } catch (error) {
    console.error('Error fetching blog statistics:', error);
    return { data: null, error };
  }
};

// ============================================
// Blog Categories Management
// ============================================

// Get all blog categories
export const getAllBlogCategories = async () => {
  try {
    const { data, error } = await supabase
      .from('blog_categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching blog categories:', error);
    return { data: null, error };
  }
};

// Get active blog categories
export const getActiveBlogCategories = async () => {
  try {
    const { data, error } = await supabase
      .from('blog_categories')
      .select('*')
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching active blog categories:', error);
    return { data: null, error };
  }
};

// Create blog category
export const createBlogCategory = async (categoryData) => {
  try {
    const category = {
      ...categoryData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('blog_categories')
      .insert([category])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating blog category:', error);
    return { data: null, error };
  }
};

// Update blog category
export const updateBlogCategory = async (id, categoryData) => {
  try {
    const updates = {
      ...categoryData,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('blog_categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating blog category:', error);
    return { data: null, error };
  }
};

// Delete blog category
export const deleteBlogCategory = async (id) => {
  try {
    const { error } = await supabase
      .from('blog_categories')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error deleting blog category:', error);
    return { error };
  }
};

