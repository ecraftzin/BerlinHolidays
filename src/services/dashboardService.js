// src/services/dashboardService.js
import { supabase } from '../config/supabaseClient';

/**
 * Dashboard Service
 * Handles all database operations for dashboard statistics and overview
 */

// Get dashboard statistics
export const getDashboardStatistics = async () => {
  try {
    // Fetch all necessary data in parallel
    const [
      roomTypesResult,
      blogPostsResult,
      specialOffersResult,
      menuItemsResult,
    ] = await Promise.all([
      supabase.from('room_types').select('id, total_rooms, available_rooms, is_active'),
      supabase.from('blog_posts').select('id, status, views'),
      supabase.from('special_offers').select('id, status'),
      supabase.from('restaurant_menu_items').select('id, is_available'),
    ]);

    // Process room statistics
    const roomTypes = roomTypesResult.data || [];
    const totalRoomTypes = roomTypes.length;
    const activeRoomTypes = roomTypes.filter(r => r.is_active).length;
    const totalRooms = roomTypes.reduce((sum, r) => sum + (r.total_rooms || 0), 0);
    const availableRooms = roomTypes.reduce((sum, r) => sum + (r.available_rooms || 0), 0);
    const bookedRooms = totalRooms - availableRooms;

    // Process blog statistics
    const blogPosts = blogPostsResult.data || [];
    const totalBlogPosts = blogPosts.length;
    const publishedBlogPosts = blogPosts.filter(p => p.status === 'published').length;
    const draftBlogPosts = blogPosts.filter(p => p.status === 'draft').length;
    const totalBlogViews = blogPosts.reduce((sum, p) => sum + (p.views || 0), 0);

    // Process special offers statistics
    const specialOffers = specialOffersResult.data || [];
    const totalSpecialOffers = specialOffers.length;
    const activeSpecialOffers = specialOffers.filter(o => o.status === 'active').length;

    // Process restaurant statistics
    const menuItems = menuItemsResult.data || [];
    const totalMenuItems = menuItems.length;
    const availableMenuItems = menuItems.filter(m => m.is_available).length;

    const statistics = {
      rooms: {
        totalRoomTypes,
        activeRoomTypes,
        totalRooms,
        availableRooms,
        bookedRooms,
        occupancyRate: totalRooms > 0 ? ((bookedRooms / totalRooms) * 100).toFixed(2) : 0,
      },
      blog: {
        totalPosts: totalBlogPosts,
        publishedPosts: publishedBlogPosts,
        draftPosts: draftBlogPosts,
        totalViews: totalBlogViews,
      },
      offers: {
        totalOffers: totalSpecialOffers,
        activeOffers: activeSpecialOffers,
      },
      restaurant: {
        totalMenuItems,
        availableMenuItems,
      },
    };

    return { data: statistics, error: null };
  } catch (error) {
    console.error('Error fetching dashboard statistics:', error);
    return { data: null, error };
  }
};

// Get recent activities
export const getRecentActivities = async (limit = 10) => {
  try {
    // Fetch recent blog posts
    const { data: recentBlogs, error: blogError } = await supabase
      .from('blog_posts')
      .select('id, title, created_at, status')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (blogError) throw blogError;

    // Fetch recent special offers
    const { data: recentOffers, error: offerError } = await supabase
      .from('special_offers')
      .select('id, title, created_at, status')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (offerError) throw offerError;

    // Combine and sort activities
    const activities = [
      ...(recentBlogs || []).map(blog => ({
        id: blog.id,
        type: 'blog',
        title: blog.title,
        status: blog.status,
        createdAt: blog.created_at,
      })),
      ...(recentOffers || []).map(offer => ({
        id: offer.id,
        type: 'offer',
        title: offer.title,
        status: offer.status,
        createdAt: offer.created_at,
      })),
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);

    return { data: activities, error: null };
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    return { data: null, error };
  }
};

// Get upcoming special offers
export const getUpcomingSpecialOffers = async (limit = 5) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('special_offers')
      .select('*')
      .eq('status', 'scheduled')
      .gte('valid_from', today)
      .order('valid_from', { ascending: true })
      .limit(limit);

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching upcoming special offers:', error);
    return { data: null, error };
  }
};

// Get popular blog posts
export const getPopularBlogPosts = async (limit = 5) => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('id, title, views, category, published_at')
      .eq('status', 'published')
      .order('views', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching popular blog posts:', error);
    return { data: null, error };
  }
};

// Get room occupancy trends (last 30 days)
export const getRoomOccupancyTrends = async (days = 30) => {
  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('room_availability')
      .select('date, total_rooms, available_rooms, booked_rooms')
      .gte('date', startDate.toISOString().split('T')[0])
      .lte('date', endDate.toISOString().split('T')[0])
      .order('date', { ascending: true });

    if (error) throw error;

    // Group by date and calculate totals
    const trends = {};
    (data || []).forEach(record => {
      if (!trends[record.date]) {
        trends[record.date] = {
          date: record.date,
          totalRooms: 0,
          availableRooms: 0,
          bookedRooms: 0,
        };
      }
      trends[record.date].totalRooms += record.total_rooms || 0;
      trends[record.date].availableRooms += record.available_rooms || 0;
      trends[record.date].bookedRooms += record.booked_rooms || 0;
    });

    const trendData = Object.values(trends).map(trend => ({
      ...trend,
      occupancyRate: trend.totalRooms > 0 
        ? ((trend.bookedRooms / trend.totalRooms) * 100).toFixed(2)
        : 0,
    }));

    return { data: trendData, error: null };
  } catch (error) {
    console.error('Error fetching room occupancy trends:', error);
    return { data: null, error };
  }
};

// Get low stock alerts (rooms with low availability)
export const getLowAvailabilityAlerts = async (threshold = 2) => {
  try {
    const { data, error } = await supabase
      .from('room_types')
      .select('id, name, total_rooms, available_rooms')
      .lte('available_rooms', threshold)
      .gt('available_rooms', 0)
      .eq('is_active', true);

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching low availability alerts:', error);
    return { data: null, error };
  }
};

// Get content summary
export const getContentSummary = async () => {
  try {
    const [
      blogCount,
      roomCount,
      offerCount,
      menuCount,
      categoryCount,
    ] = await Promise.all([
      supabase.from('blog_posts').select('id', { count: 'exact', head: true }),
      supabase.from('room_types').select('id', { count: 'exact', head: true }),
      supabase.from('special_offers').select('id', { count: 'exact', head: true }),
      supabase.from('restaurant_menu_items').select('id', { count: 'exact', head: true }),
      supabase.from('restaurant_categories').select('id', { count: 'exact', head: true }),
    ]);

    const summary = {
      blogPosts: blogCount.count || 0,
      roomTypes: roomCount.count || 0,
      specialOffers: offerCount.count || 0,
      menuItems: menuCount.count || 0,
      restaurantCategories: categoryCount.count || 0,
    };

    return { data: summary, error: null };
  } catch (error) {
    console.error('Error fetching content summary:', error);
    return { data: null, error };
  }
};

