# 🎁 START HERE - Special Offers Setup

## ⚡ Quick Start (5 Minutes)

### Step 1: Update Database (2 minutes)
1. Open your **Supabase Dashboard**
2. Go to **SQL Editor**
3. Open the file `update_special_offers_table.sql`
4. Copy all the SQL code
5. Paste it in the SQL Editor
6. Click **RUN** button
7. ✅ You should see "Success. No rows returned"

### Step 2: Create Your First Offer (2 minutes)
1. Go to your **Admin Dashboard**
2. Click **Special Offers** in the sidebar
3. Click the green **Create Offer** button
4. Fill in the form:
   ```
   Offer Title: Summer Special 2024
   Description: Get 25% off on all summer bookings
   Discount (%): 25
   Apply to Room Type: All Rooms
   Valid From: 2024-06-01
   Valid To: 2024-08-31
   ```
5. Click **Save & Publish**
6. ✅ You should see "Offer created successfully!"

### Step 3: Verify on Website (1 minute)
1. Open your **website home page**
2. Scroll to **"BERLIN'S LIMITED PERIOD BEST OFFERS"** section
3. ✅ You should see your offer in the carousel!

---

## 🎯 What Changed?

### ❌ BEFORE:
- Admin panel had **dummy/fake data**
- Couldn't add real offers
- Website showed **hardcoded offers**
- Had to edit code to change offers

### ✅ AFTER:
- Admin panel is **empty** (no dummy data)
- Can **add real offers** through the form
- Website shows **real offers from database**
- **No coding needed** to manage offers

---

## 📋 How to Manage Offers

### ➕ Create New Offer
1. Click **Create Offer** button
2. Fill required fields (marked with *)
3. Click **Save & Publish**

### ✏️ Edit Existing Offer
1. Find the offer card
2. Click **Edit** button (bronze/gold color)
3. Update fields
4. Click **Update Offer**

### 🗑️ Delete Offer
1. Find the offer card
2. Click **Delete** button (red trash icon)
3. Confirm deletion

---

## 🎨 Offer Display on Website

### Where it Shows:
- **Home Page** → "BERLIN'S LIMITED PERIOD BEST OFFERS" section
- Displayed as a **carousel/slider**
- Shows **3 offers** on desktop, **2 on tablet**, **1 on mobile**

### What Visitors See:
- Beautiful card design (no images needed)
- Discount percentage badge (top right)
- Offer title
- Description
- Room type and valid dates
- "Book Now & Save X%" button
- Limited time offer message

### Important:
- Only **active** offers appear on website
- Offers are ordered by `display_order` field
- Carousel auto-loops through offers
- No images required - clean card design

---

## ⚠️ Important Notes

### Required Fields (Must Fill):
- ✅ Offer Title
- ✅ Discount (%)
- ✅ Valid From date
- ✅ Valid To date

### Optional Fields:
- Description
- Room Type (defaults to "All Rooms")

### Auto-Generated:
- **Slug**: Created from title automatically
  - Example: "Summer Special" → "summer-special"
- **Timestamps**: Created and updated dates

---

## 🐛 Troubleshooting

### "No offers showing on website"
**Check:**
- Is the offer status "active"?
- Are the dates valid (today is between valid_from and valid_to)?
- Did you run the database migration?

### "Cannot create offer"
**Check:**
- All required fields filled?
- Discount between 0-100?
- Valid To date is after Valid From?
- Supabase connection working?

### "Database error"
**Solution:**
1. Check `.env` file has correct Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_url
   VITE_SUPABASE_ANON_KEY=your_key
   ```
2. Verify database migration was run
3. Check browser console for error details

---

## 📊 Sample Offers to Create

### Offer 1: Summer Special
```
Title: Summer Special 2024
Description: Enjoy 25% off on all bookings this summer
Discount: 25
Room Type: All Rooms
Valid From: 2024-06-01
Valid To: 2024-08-31
```

### Offer 2: Weekend Getaway
```
Title: Weekend Getaway
Description: 15% off on weekend stays
Discount: 15
Room Type: Deluxe Suite
Valid From: 2024-01-01
Valid To: 2024-12-31
```

### Offer 3: Early Bird
```
Title: Early Bird Special
Description: Book 30 days in advance and save 30%
Discount: 30
Room Type: All Rooms
Valid From: 2024-01-01
Valid To: 2024-12-31
```

---

## ✅ Success Checklist

Before you're done, verify:
- [ ] Database migration completed
- [ ] Can access Special Offers in admin panel
- [ ] Can create a new offer
- [ ] Offer appears on website home page
- [ ] Can edit an offer
- [ ] Can delete an offer
- [ ] Only active offers show on website
- [ ] Carousel works on mobile and desktop

---

## 📚 More Help

- **Detailed Guide**: See `SPECIAL_OFFERS_SETUP_GUIDE.md`
- **Changes Summary**: See `SPECIAL_OFFERS_CHANGES_SUMMARY.md`
- **Database Migration**: See `update_special_offers_table.sql`

---

## 🎉 You're All Set!

The Special Offers feature is now ready to use. You can:
- ✅ Add unlimited offers
- ✅ Edit them anytime
- ✅ Delete old offers
- ✅ See them live on your website

**No coding required!** Just use the admin panel.

---

**Need Help?** Check the troubleshooting section above or review the detailed setup guide.

**Last Updated:** 2025-11-11

