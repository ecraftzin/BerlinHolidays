# 🎁 Special Offers Feature - Complete Documentation

## 📖 Table of Contents
1. [Quick Start](#quick-start)
2. [What Changed](#what-changed)
3. [How to Use](#how-to-use)
4. [Technical Details](#technical-details)
5. [Troubleshooting](#troubleshooting)
6. [Files Modified](#files-modified)

---

## ⚡ Quick Start

### 3-Step Setup

#### Step 1: Run Database Migration
```bash
# Open Supabase Dashboard → SQL Editor
# Copy and run: update_special_offers_table.sql
```

#### Step 2: Create First Offer
```bash
# Admin Dashboard → Special Offers → Create Offer
# Fill form and click "Save & Publish"
```

#### Step 3: Verify
```bash
# Visit website home page
# Scroll to "BERLIN'S LIMITED PERIOD BEST OFFERS"
# Your offer should appear!
```

**📚 Detailed Guide:** See `START_HERE_SPECIAL_OFFERS.md`

---

## 🔄 What Changed

### Summary
- ❌ **Removed:** All dummy/hardcoded data
- ✅ **Added:** Full database integration
- ✅ **Added:** CRUD operations (Create, Read, Update, Delete)
- ✅ **Added:** Real-time data sync between admin and website

### Admin Panel
**Before:** Hardcoded dummy offers, no database connection  
**After:** Empty state, can add/edit/delete real offers from database

### Website
**Before:** Static hardcoded offers  
**After:** Dynamic offers fetched from database

**📊 Visual Comparison:** See `SPECIAL_OFFERS_BEFORE_AFTER.md`

---

## 📝 How to Use

### For Admin

#### Create New Offer
1. Navigate to **Special Offers** in admin panel
2. Click **Create Offer** button
3. Fill in the form:
   - **Title*** (required): e.g., "Summer Special 2024"
   - **Description**: Brief details about the offer
   - **Discount (%)*** (required): 0-100
   - **Room Type**: Which rooms this applies to
   - **Valid From*** (required): Start date
   - **Valid To*** (required): End date
4. Click **Save & Publish**

#### Edit Existing Offer
1. Find the offer card
2. Click **Edit** button (bronze/gold color)
3. Update fields
4. Click **Update Offer**

#### Delete Offer
1. Find the offer card
2. Click **Delete** button (red trash icon)
3. Confirm deletion

### For Website Visitors
- Offers automatically appear on home page
- Only **active** offers are shown
- Displayed in carousel format
- Shows discount percentage, title, and description

---

## 🔧 Technical Details

### Database Schema

**Table:** `special_offers`

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| title | TEXT | Offer name (required) |
| slug | TEXT | URL-friendly version of title |
| description | TEXT | Offer details |
| discount_type | TEXT | "percentage" or "fixed" |
| discount_value | DECIMAL | Percentage or amount |
| valid_from | DATE | Start date (required) |
| valid_to | DATE | End date (required) |
| room_type | TEXT | Which rooms apply |
| status | TEXT | active/scheduled/expired/inactive |
| featured_image | TEXT | Image URL |
| is_featured | BOOLEAN | Featured flag |
| display_order | INTEGER | Display order |
| created_at | TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | Last update time |

### API Functions

**Service:** `src/services/specialOffersService.js`

```javascript
// Get all offers (admin)
getAllSpecialOffers()

// Get active offers (website)
getActiveSpecialOffers()

// Create new offer
createSpecialOffer(offerData)

// Update existing offer
updateSpecialOffer(id, offerData)

// Delete offer
deleteSpecialOffer(id)
```

### Components Modified

1. **Admin Panel:** `src/Pages/AdminDashboard/SpecialOffers.jsx`
   - Removed dummy data
   - Added database integration
   - Added loading/empty states
   - Added form validation

2. **Website:** `src/Components/Offers/Offers.jsx`
   - Removed hardcoded offers
   - Added database fetching
   - Added loading/empty states
   - Dynamic carousel rendering

---

## 🐛 Troubleshooting

### Issue: Offers not showing on website

**Possible Causes:**
1. Offer status is not "active"
2. Current date is outside valid_from/valid_to range
3. Database migration not run
4. No offers created yet

**Solution:**
```bash
# Check offer status in admin panel
# Verify dates are correct
# Run database migration
# Create at least one active offer
```

### Issue: Cannot create offer

**Possible Causes:**
1. Required fields not filled
2. Discount value out of range (0-100)
3. Invalid date range
4. Database connection issue

**Solution:**
```bash
# Fill all required fields (marked with *)
# Check discount is 0-100
# Ensure Valid To > Valid From
# Verify Supabase credentials in .env
```

### Issue: Database error

**Solution:**
```bash
# Check .env file:
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key

# Verify database migration was run
# Check browser console for detailed error
```

---

## 📁 Files Modified

### Modified Files
1. `src/Pages/AdminDashboard/SpecialOffers.jsx` - Admin panel component
2. `src/Components/Offers/Offers.jsx` - Website offers section

### New Files Created
1. `update_special_offers_table.sql` - Database migration
2. `SPECIAL_OFFERS_SETUP_GUIDE.md` - Detailed setup guide
3. `SPECIAL_OFFERS_CHANGES_SUMMARY.md` - Changes summary
4. `SPECIAL_OFFERS_BEFORE_AFTER.md` - Visual comparison
5. `START_HERE_SPECIAL_OFFERS.md` - Quick start guide
6. `README_SPECIAL_OFFERS.md` - This file

### Existing Files Used
- `src/services/specialOffersService.js` - Database service (already existed)
- `src/config/supabaseClient.js` - Supabase client (already existed)

---

## 🎯 Key Features

### Admin Panel
- ✅ View all offers
- ✅ Create new offers
- ✅ Edit existing offers
- ✅ Delete offers
- ✅ Loading states
- ✅ Empty states
- ✅ Form validation
- ✅ Error handling
- ✅ Auto slug generation

### Website
- ✅ Display active offers
- ✅ Responsive carousel
- ✅ Loading states
- ✅ Empty states
- ✅ Dynamic content
- ✅ Real-time updates

---

## 🎨 Design

All components follow **Berlin Holidays brand guidelines**:
- Background: `#f7f5f2`
- Accents: `#c49e72`
- Actions: `#006938`
- Fonts: Garamond (headings), Lora (body)

---

## 📊 Data Flow

```
Admin Creates Offer
        ↓
Form Validation
        ↓
createSpecialOffer()
        ↓
Supabase Database
        ↓
Success Message
        ↓
Refresh Offer List
        ↓
Website Fetches Active Offers
        ↓
Display in Carousel
```

---

## ✅ Testing Checklist

Before going live:
- [ ] Database migration completed
- [ ] Can create offers in admin panel
- [ ] Can edit offers
- [ ] Can delete offers
- [ ] Offers appear on website
- [ ] Only active offers show
- [ ] Loading states work
- [ ] Empty states work
- [ ] Form validation works
- [ ] Carousel works on all devices

---

## 📞 Support

### Documentation Files
- **Quick Start:** `START_HERE_SPECIAL_OFFERS.md`
- **Detailed Guide:** `SPECIAL_OFFERS_SETUP_GUIDE.md`
- **Changes Summary:** `SPECIAL_OFFERS_CHANGES_SUMMARY.md`
- **Before/After:** `SPECIAL_OFFERS_BEFORE_AFTER.md`

### Common Issues
See **Troubleshooting** section above

### Database
- Migration file: `update_special_offers_table.sql`
- Service file: `src/services/specialOffersService.js`

---

## 🚀 Next Steps

1. ✅ Run database migration
2. ✅ Create your first offer
3. ✅ Verify on website
4. ✅ Add more offers as needed
5. ✅ Monitor and update regularly

---

## 📝 Notes

- Offers are automatically ordered by `display_order` field
- Only offers with `status = 'active'` appear on website
- Slug is auto-generated from title
- All dates are validated
- Images use fallback if not provided

---

**Status:** ✅ Production Ready  
**Version:** 1.0  
**Last Updated:** 2025-11-11  
**Author:** Berlin Holidays Development Team

