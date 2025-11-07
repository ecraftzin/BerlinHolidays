# Admin Dashboard Database Integration Guide

This guide explains how to integrate all admin dashboard components with the Supabase database.

## 📋 Overview

All admin dashboard sections have been set up with:
1. **Database Schema** - Tables defined in `ADMIN_DATABASE_SCHEMA.md`
2. **Service Layer** - API functions in `src/services/` directory
3. **Component Integration** - Instructions below for each component

## 🔧 Setup Steps

### Step 1: Create Database Tables

Go to your Supabase Dashboard SQL Editor and run the SQL commands from `ADMIN_DATABASE_SCHEMA.md` to create all required tables.

### Step 2: Enable Row Level Security (Optional)

For production, enable RLS policies as documented in the schema file.

### Step 3: Update Components

Follow the integration patterns below for each component.

---

## 📝 Integration Pattern

Each admin component should follow this pattern:

```javascript
import React, { useState, useEffect } from "react";
import { serviceName } from "../../services";

const ComponentName = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data, error } = await serviceName.getAll();
    if (error) {
      setError(error.message);
      console.error('Error:', error);
    } else {
      setData(data || []);
    }
    setLoading(false);
  };

  const handleCreate = async (formData, isDraft = false) => {
    const { data, error } = await serviceName.create(formData, isDraft);
    if (error) {
      alert('Error creating: ' + error.message);
    } else {
      alert('Created successfully!');
      fetchData(); // Refresh list
    }
  };

  const handleUpdate = async (id, formData, isDraft = false) => {
    const { data, error } = await serviceName.update(id, formData, isDraft);
    if (error) {
      alert('Error updating: ' + error.message);
    } else {
      alert('Updated successfully!');
      fetchData(); // Refresh list
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    
    const { error } = await serviceName.delete(id);
    if (error) {
      alert('Error deleting: ' + error.message);
    } else {
      alert('Deleted successfully!');
      fetchData(); // Refresh list
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    // Your component JSX
  );
};
```

---

## 🔌 Component-Specific Integration

### 1. BlogManagement.jsx

**Service:** `blogService.js`

**Key Changes:**
```javascript
import { getAllBlogPosts, createBlogPost, updateBlogPost, deleteBlogPost } from "../../services";

// In useEffect
useEffect(() => {
  fetchBlogPosts();
}, []);

const fetchBlogPosts = async () => {
  setLoading(true);
  const { data, error } = await getAllBlogPosts();
  if (!error) setBlogPosts(data || []);
  setLoading(false);
};

// In form submit
const handleSubmit = async (e, isDraft = false) => {
  e.preventDefault();
  const formData = {
    title: e.target.title.value,
    slug: e.target.title.value.toLowerCase().replace(/\s+/g, '-'),
    content: e.target.content.value,
    excerpt: e.target.excerpt?.value,
    category: e.target.category.value,
    author: 'Admin',
    featured_image: e.target.image?.value,
  };

  if (selectedPost) {
    await updateBlogPost(selectedPost.id, formData, isDraft);
  } else {
    await createBlogPost(formData, isDraft);
  }
  
  fetchBlogPosts();
  handleCloseModals();
};
```

### 2. SEOManagement.jsx

**Service:** `seoService.js`

**Key Changes:**
```javascript
import { 
  getGlobalSEOSettings, 
  updateGlobalSEOSettings,
  getAllPageSEOSettings,
  createPageSEOSettings,
  updatePageSEOSettings,
  deletePageSEOSettings
} from "../../services";

// Fetch global settings
useEffect(() => {
  fetchGlobalSettings();
  fetchPageSettings();
}, []);

const fetchGlobalSettings = async () => {
  const { data } = await getGlobalSEOSettings();
  if (data) setFormData(data);
};

const handleSaveGlobal = async () => {
  const { error } = await updateGlobalSEOSettings(formData);
  if (!error) alert('Global SEO settings saved!');
};
```

### 3. RoomTypes.jsx

**Service:** `roomService.js`

**Key Changes:**
```javascript
import { 
  getAllRoomTypes, 
  createRoomType, 
  updateRoomType, 
  deleteRoomType,
  toggleRoomTypeStatus
} from "../../services";

const handleSubmit = async (formData) => {
  const roomData = {
    name: formData.name,
    slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
    description: formData.description,
    capacity: parseInt(formData.capacity),
    size: formData.size,
    base_price: parseFloat(formData.basePrice),
    amenities: formData.amenities, // array
    images: formData.images, // array
    total_rooms: parseInt(formData.totalRooms),
    available_rooms: parseInt(formData.availableRooms),
    is_active: true,
  };

  if (editingRoom) {
    await updateRoomType(editingRoom.id, roomData);
  } else {
    await createRoomType(roomData);
  }
};
```

### 4. PricingPlans.jsx

**Service:** `pricingService.js`

**Key Changes:**
```javascript
import { 
  getAllPricingPlans, 
  createPricingPlan, 
  updatePricingPlan, 
  deletePricingPlan 
} from "../../services";

const handleSubmit = async (formData) => {
  const planData = {
    name: formData.name,
    description: formData.description,
    discount_type: formData.discountType,
    discount_value: parseFloat(formData.discountValue),
    valid_from: formData.validFrom,
    valid_to: formData.validTo,
    min_stay: parseInt(formData.minStay),
    is_active: true,
  };

  if (selectedPlan) {
    await updatePricingPlan(selectedPlan.id, planData);
  } else {
    await createPricingPlan(planData);
  }
};
```

### 5. SpecialOffers.jsx

**Service:** `specialOffersService.js`

**Key Changes:**
```javascript
import { 
  getAllSpecialOffers, 
  createSpecialOffer, 
  updateSpecialOffer, 
  deleteSpecialOffer 
} from "../../services";

const handleSubmit = async (formData) => {
  const offerData = {
    title: formData.title,
    slug: formData.title.toLowerCase().replace(/\s+/g, '-'),
    description: formData.description,
    discount_type: formData.discountType,
    discount_value: parseFloat(formData.discountValue),
    valid_from: formData.validFrom,
    valid_to: formData.validTo,
    room_type: formData.roomType,
    status: 'active',
  };

  if (selectedOffer) {
    await updateSpecialOffer(selectedOffer.id, offerData);
  } else {
    await createSpecialOffer(offerData);
  }
};
```

### 6. RestaurantCategories.jsx

**Service:** `restaurantService.js`

**Key Changes:**
```javascript
import { 
  getAllCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} from "../../services";

const handleSubmit = async (formData) => {
  const categoryData = {
    name: formData.name,
    slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
    description: formData.description,
    display_order: parseInt(formData.displayOrder || 0),
    is_active: true,
  };

  if (selectedCategory) {
    await updateCategory(selectedCategory.id, categoryData);
  } else {
    await createCategory(categoryData);
  }
};
```

### 7. RestaurantMenu.jsx

**Service:** `restaurantService.js`

**Key Changes:**
```javascript
import { 
  getAllMenuItems, 
  createMenuItem, 
  updateMenuItem, 
  deleteMenuItem,
  getAllCategories
} from "../../services";

// Fetch categories for dropdown
useEffect(() => {
  fetchCategories();
  fetchMenuItems();
}, []);

const handleSubmit = async (formData) => {
  const itemData = {
    category_id: formData.categoryId,
    name: formData.name,
    slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
    description: formData.description,
    price: parseFloat(formData.price),
    is_vegetarian: formData.isVegetarian || false,
    is_available: true,
  };

  if (selectedItem) {
    await updateMenuItem(selectedItem.id, itemData);
  } else {
    await createMenuItem(itemData);
  }
};
```

### 8. RatePlans.jsx

**Service:** `ratePlansService.js`

**Key Changes:**
```javascript
import { 
  getAllRatePlans, 
  createRatePlan, 
  updateRatePlan, 
  deleteRatePlan 
} from "../../services";
```

### 9. RatesCalendar.jsx

**Service:** `ratePlansService.js`

**Key Changes:**
```javascript
import { 
  getRoomRatesForMonth, 
  upsertRoomRate, 
  bulkUpdateRoomRates 
} from "../../services";

// Fetch rates for current month
const fetchRatesForMonth = async (year, month) => {
  const { data } = await getRoomRatesForMonth(year, month);
  setRates(data || []);
};

// Update single rate
const handleUpdateRate = async (roomTypeId, date, rateData) => {
  await upsertRoomRate({
    room_type_id: roomTypeId,
    date: date,
    base_rate: parseFloat(rateData.baseRate),
    discounted_rate: parseFloat(rateData.discountedRate),
    is_available: true,
  });
};
```

### 10. RoomAvailability.jsx

**Service:** `availabilityService.js`

**Key Changes:**
```javascript
import { 
  getRoomAvailabilityForMonth, 
  upsertRoomAvailability,
  blockRooms,
  unblockRooms
} from "../../services";

// Block rooms for date range
const handleBlockRooms = async (roomTypeId, startDate, endDate, count) => {
  const { error } = await blockRooms(roomTypeId, startDate, endDate, count, 'Blocked by admin');
  if (!error) {
    alert('Rooms blocked successfully!');
    fetchAvailability();
  }
};
```

### 11. DashboardOverview.jsx

**Service:** `dashboardService.js`

**Key Changes:**
```javascript
import { 
  getDashboardStatistics, 
  getRecentActivities,
  getPopularBlogPosts
} from "../../services";

useEffect(() => {
  fetchDashboardData();
}, []);

const fetchDashboardData = async () => {
  const { data: stats } = await getDashboardStatistics();
  const { data: activities } = await getRecentActivities(10);
  const { data: popularPosts } = await getPopularBlogPosts(5);
  
  setStatistics(stats);
  setRecentActivities(activities);
  setPopularPosts(popularPosts);
};
```

---

## 🎯 Important Notes

1. **Error Handling**: Always check for errors and display user-friendly messages
2. **Loading States**: Show loading indicators while fetching data
3. **Form Validation**: Validate form data before submitting
4. **Slug Generation**: Auto-generate slugs from titles/names
5. **Date Formatting**: Use proper date formats for database (YYYY-MM-DD)
6. **Arrays**: PostgreSQL arrays should be passed as JavaScript arrays
7. **Refresh Data**: Always refresh the list after create/update/delete operations

---

## 🚀 Next Steps

1. Create the database tables using the SQL schema
2. Test the service functions in browser console
3. Update each component one by one
4. Test CRUD operations for each section
5. Add proper error handling and loading states
6. Implement search and filter functionality with database queries

---

## 📞 Support

If you encounter any issues:
1. Check browser console for errors
2. Verify Supabase connection
3. Check table names match exactly
4. Ensure RLS policies allow operations
5. Verify data types match schema

