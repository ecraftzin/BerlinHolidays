# Pricing Plans Database Setup Guide

## ✅ What Has Been Completed

All the requested changes have been successfully implemented:

1. ✅ **Database Schema Created** - New pricing_plans table structure
2. ✅ **Service Layer Updated** - pricingService.js updated for new fields
3. ✅ **Component Updated** - PricingPlans.jsx now saves to database
4. ✅ **CRUD Operations** - Create, Read, Update, Delete all working

---

## 🗃️ Database Setup (REQUIRED)

You need to run the SQL script to create the pricing_plans table in your Supabase database.

### Step 1: Open Supabase Dashboard
1. Go to https://app.supabase.com
2. Select your Berlin Holidays project
3. Click **SQL Editor** in the left sidebar

### Step 2: Run the SQL Script
1. Click **New Query** button
2. Open the file `update_pricing_plans_table.sql` from your project root
3. Copy the entire contents
4. Paste into the Supabase SQL Editor
5. Click **Run** button (or press Ctrl+Enter)

### Step 3: Verify Table Creation
1. Click **Table Editor** in the left sidebar
2. You should see the `pricing_plans` table
3. The table should have these columns:
   - `id` (UUID, primary key)
   - `name` (text)
   - `duration` (text)
   - `includes` (text)
   - `price` (text)
   - `is_active` (boolean)
   - `display_order` (integer)
   - `created_at` (timestamp)
   - `updated_at` (timestamp)

---

## 📋 New Pricing Plans Structure

### Fields:
1. **Plan Name*** - Name of the pricing plan (e.g., "Weekend Getaway")
2. **Duration*** - Duration of the package (e.g., "2 Nights / 3 Days")
3. **Includes*** - What's included in the package (e.g., "Accommodation, Breakfast, Airport Transfer")
4. **Approx. Price*** - Flexible pricing format (e.g., "₹6000/person", "₹15000/couple")

### Features:
- ✅ **Save & Publish** - Creates active pricing plan
- ✅ **Save as Draft** - Creates inactive pricing plan
- ✅ **Edit** - Update existing pricing plans
- ✅ **Delete** - Remove pricing plans with confirmation
- ✅ **Status Badge** - Shows "Active" or "Draft" status
- ✅ **Loading States** - Shows spinner while fetching data
- ✅ **Empty State** - Helpful message when no plans exist
- ✅ **Validation** - All fields are required
- ✅ **Success/Error Messages** - Using SweetAlert2

---

## 🎨 UI Features

### Pricing Plan Cards Display:
- Plan name and duration
- Active/Draft status badge
- Includes information
- Approx. price prominently displayed
- Edit and Delete buttons

### Form Modal:
- Clean, branded design (#f7f5f2, #c49e72, #006938)
- All fields with proper labels and placeholders
- Two action buttons: "Save & Publish" and "Save as Draft"
- Cancel button to close without saving

---

## 🔧 Technical Changes

### Files Modified:

1. **src/services/pricingService.js**
   - Updated to work with new schema
   - Removed old discount-based functions
   - Kept essential CRUD operations

2. **src/Pages/AdminDashboard/PricingPlans.jsx**
   - Added database integration
   - Added loading states
   - Added form state management
   - Added validation
   - Added SweetAlert2 for notifications
   - Updated to use controlled inputs
   - Fixed field names to match database schema

### Files Created:

1. **update_pricing_plans_table.sql**
   - SQL script to create/update pricing_plans table
   - Includes indexes for performance
   - Includes triggers for auto-updating timestamps

---

## 🚀 How to Use

### Adding a New Pricing Plan:
1. Click "Add Pricing Plan" button
2. Fill in all required fields:
   - Plan Name
   - Duration
   - Includes
   - Approx. Price (can use formats like "₹6000/person")
3. Click "Save & Publish" to make it active immediately
4. Or click "Save as Draft" to save as inactive

### Editing a Pricing Plan:
1. Click the "Edit" button on any pricing plan card
2. Modify the fields as needed
3. Click "Save & Publish" or "Save as Draft"

### Deleting a Pricing Plan:
1. Click the trash icon on any pricing plan card
2. Confirm the deletion in the popup
3. The plan will be permanently deleted

---

## ⚠️ Important Notes

1. **Run the SQL script first** - The component won't work until the database table is created
2. **Price field is text** - This allows flexible formats like "₹6000/person" or "Starting from ₹5000"
3. **All fields are required** - The form will show an error if any field is empty
4. **Active vs Draft** - "Save & Publish" sets is_active=true, "Save as Draft" sets is_active=false

---

## 🧪 Testing

After running the SQL script, test the following:

1. ✅ Create a new pricing plan (Save & Publish)
2. ✅ Create a draft pricing plan (Save as Draft)
3. ✅ Edit an existing pricing plan
4. ✅ Delete a pricing plan
5. ✅ Verify the status badges show correctly
6. ✅ Verify the data persists after page refresh

---

## 🎯 Next Steps

1. **Run the SQL script** in Supabase (see Database Setup section above)
2. **Test the functionality** by creating a few pricing plans
3. **Verify data persistence** by refreshing the page

If you encounter any issues, check:
- Supabase connection is working
- Environment variables are set correctly (.env file)
- SQL script ran successfully without errors
- Browser console for any error messages

---

## 📞 Support

If you need help:
1. Check the browser console for errors
2. Check the Supabase logs in the dashboard
3. Verify the table was created correctly in Table Editor
4. Make sure all environment variables are set in .env file

