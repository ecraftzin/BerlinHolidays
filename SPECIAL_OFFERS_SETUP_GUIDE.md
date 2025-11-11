# 🎁 Special Offers Setup Guide

## Overview
The Special Offers feature allows you to create and manage promotional offers that will be displayed on your website's home page under "BERLIN'S LIMITED PERIOD BEST OFFERS" section.

---

## 🚀 Quick Setup (3 Steps)

### Step 1: Update Database Table
Run the SQL migration to add missing fields to the `special_offers` table:

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `update_special_offers_table.sql`
4. Click **Run**

### Step 2: Verify Table Structure
After running the migration, verify the table has these columns:
- `id` (UUID)
- `title` (TEXT)
- `slug` (TEXT)
- `description` (TEXT)
- `discount_type` (TEXT)
- `discount_value` (DECIMAL)
- `valid_from` (DATE)
- `valid_to` (DATE)
- `room_type` (TEXT)
- `status` (TEXT)
- `featured_image` (TEXT)
- `is_featured` (BOOLEAN)
- `display_order` (INTEGER)
- `min_stay` (INTEGER)
- `max_bookings` (INTEGER)
- `current_bookings` (INTEGER)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Step 3: Test the Feature
1. Log in to your admin dashboard
2. Navigate to **Special Offers** section
3. Click **Create Offer** button
4. Fill in the form and save
5. Check the website home page to see the offer displayed

---

## 📝 How to Use

### Creating a New Offer

1. **Access Admin Panel**
   - Go to your admin dashboard
   - Click on "Special Offers" in the sidebar

2. **Click "Create Offer"**
   - A modal form will appear

3. **Fill in the Details**
   - **Offer Title*** (Required): e.g., "Summer Special 2024"
   - **Description**: Brief description of the offer
   - **Discount (%)*** (Required): Enter percentage (0-100)
   - **Apply to Room Type**: Select which rooms this applies to
   - **Valid From*** (Required): Start date of the offer
   - **Valid To*** (Required): End date of the offer

4. **Save & Publish**
   - Click "Save & Publish" to make it live immediately
   - The offer will appear on the website if status is "active"

### Editing an Offer

1. Find the offer card in the grid
2. Click the **Edit** button (bronze/gold color)
3. Update the fields as needed
4. Click **Update Offer**

### Deleting an Offer

1. Find the offer card in the grid
2. Click the **Delete** button (red trash icon)
3. Confirm the deletion

---

## 🎨 How Offers Appear on Website

### Location
- **Home Page**: "BERLIN'S LIMITED PERIOD BEST OFFERS" section
- Displayed as a carousel/slider
- Shows only **active** offers

### Display Information
Each offer card shows:
- Discount percentage badge (top-left corner)
- Offer title
- Description (if provided)
- Links to room booking page

### Carousel Features
- Responsive design (1-4 slides depending on screen size)
- Swipe/drag functionality
- Auto-loop enabled

---

## 🔧 Technical Details

### Database Fields Explained

| Field | Type | Description |
|-------|------|-------------|
| `title` | TEXT | Offer name (e.g., "Summer Special") |
| `slug` | TEXT | Auto-generated URL-friendly version of title |
| `description` | TEXT | Optional description of the offer |
| `discount_type` | TEXT | Currently "percentage" (future: "fixed") |
| `discount_value` | DECIMAL | Percentage or fixed amount |
| `valid_from` | DATE | Start date of offer validity |
| `valid_to` | DATE | End date of offer validity |
| `room_type` | TEXT | Which rooms this applies to |
| `status` | TEXT | "active", "scheduled", "expired", "inactive" |
| `featured_image` | TEXT | URL to offer image (optional) |
| `is_featured` | BOOLEAN | Whether to feature this offer |
| `display_order` | INTEGER | Order in which to display (lower = first) |

### Status Values
- **active**: Offer is live and visible on website
- **scheduled**: Offer is created but not yet active
- **expired**: Offer validity period has passed
- **inactive**: Offer is disabled by admin

### Auto-Generated Fields
- **slug**: Automatically created from title (e.g., "Summer Special" → "summer-special")
- **created_at**: Timestamp when offer was created
- **updated_at**: Timestamp when offer was last modified

---

## 🎯 Best Practices

### 1. Offer Titles
- Keep them short and catchy
- Include the benefit (e.g., "25% Off Weekend Stays")
- Avoid special characters

### 2. Descriptions
- Be clear and concise
- Mention any restrictions
- Highlight the value proposition

### 3. Discount Values
- Use whole numbers for clarity (e.g., 25, not 25.5)
- Common values: 10%, 15%, 20%, 25%, 30%

### 4. Validity Periods
- Set realistic date ranges
- Consider seasonal patterns
- Update or remove expired offers

### 5. Room Types
- "All Rooms" for general promotions
- Specific room types for targeted offers
- Match with your actual room inventory

---

## 🐛 Troubleshooting

### Offers Not Showing on Website
**Check:**
1. Is the offer status "active"?
2. Are the dates valid (current date between valid_from and valid_to)?
3. Is there at least one active offer in the database?
4. Check browser console for errors

### Cannot Create Offer
**Check:**
1. All required fields are filled (marked with *)
2. Discount value is between 0-100
3. Valid To date is after Valid From date
4. Database connection is working

### Slug Conflicts
**Issue:** "Slug already exists" error
**Solution:** 
- Change the offer title slightly
- Or manually edit the slug field (if exposed)

---

## 📊 Sample Data

Here's some sample data you can use for testing:

```sql
INSERT INTO special_offers (title, slug, description, discount_type, discount_value, valid_from, valid_to, room_type, status) VALUES
('Summer Special 2024', 'summer-special-2024', 'Get 25% off on all bookings during summer', 'percentage', 25, '2024-06-01', '2024-08-31', 'All Rooms', 'active'),
('Weekend Getaway', 'weekend-getaway', 'Enjoy 15% off on weekend stays', 'percentage', 15, '2024-01-01', '2024-12-31', 'Deluxe Suite', 'active'),
('Early Bird Special', 'early-bird-special', 'Book 30 days in advance and save 30%', 'percentage', 30, '2024-01-01', '2024-12-31', 'All Rooms', 'active');
```

---

## 🔐 Security Notes

### Row Level Security (RLS)
The table has RLS policies that:
- Allow **public read access** to active offers only
- Require **authentication** for create/update/delete operations

### Admin Access
- Only authenticated admin users can manage offers
- Public users can only view active offers on the website

---

## 📞 Support

If you encounter any issues:
1. Check the browser console for error messages
2. Verify Supabase connection in `.env` file
3. Ensure all required environment variables are set
4. Check that the database migration was run successfully

---

## ✅ Checklist

Before going live, ensure:
- [ ] Database migration completed (`update_special_offers_table.sql`)
- [ ] At least one test offer created
- [ ] Offer appears on website home page
- [ ] Edit functionality works
- [ ] Delete functionality works
- [ ] Dates are validated correctly
- [ ] Only active offers show on website
- [ ] Responsive design works on mobile

---

**Last Updated:** 2025-11-11
**Version:** 1.0

