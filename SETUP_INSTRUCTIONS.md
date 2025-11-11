# 🎁 Special Offers - Setup Instructions

## ⚠️ Current Error

```
Could not find the table 'public.special_offers' in the schema cache
```

**Why?** The database table doesn't exist yet.

---

## ✅ Fix (One-Time Setup - 2 Minutes)

### Step 1: Create the Database Table (ONE TIME ONLY)

1. **Supabase SQL Editor is already open** in your browser
2. **Copy ALL the code** from `create_special_offers_table.sql`
3. **Paste** it into the SQL Editor
4. **Click RUN**

You should see:
```
✅ special_offers table created successfully!
✅ Table is empty - ready for admin to add offers through admin panel!
```

**That's it!** You only do this ONCE to create the table structure.

---

### Step 2: Add Offers Through Admin Panel (ALWAYS)

Now you can add offers through the admin panel:

1. **Refresh your admin dashboard** (F5)
2. Go to **Special Offers** section
3. You'll see **empty state** (no offers yet)
4. Click **"Create Offer"** button
5. Fill in the form:
   ```
   Title: Summer Special 2024
   Description: Get 25% off on all summer bookings
   Discount (%): 25
   Room Type: All Rooms
   Valid From: 2024-06-01
   Valid To: 2024-08-31
   ```
6. Click **"Save & Publish"**
7. ✅ Your offer is now saved to database!
8. ✅ It will appear on your website automatically!

---

## 🎯 Important Understanding

### What the SQL Does (ONE TIME):
- ✅ Creates the **empty table structure** in database
- ✅ Sets up security and permissions
- ❌ Does NOT add any offers
- ❌ Does NOT add sample data

### What the Admin Panel Does (ALWAYS):
- ✅ Add new offers
- ✅ Edit existing offers
- ✅ Delete offers
- ✅ All data saved to database
- ✅ All changes appear on website automatically

---

## 📋 Workflow

```
ONE TIME:
Run SQL → Creates empty table → Done!

ALWAYS:
Admin Panel → Create/Edit/Delete Offers → Saved to Database → Shows on Website
```

---

## ✅ After Setup

### Admin Panel Will Show:
- Empty state with "Create Offer" button
- All offers you create through the form
- Edit and Delete buttons for each offer

### Website Will Show:
- Empty state (until you add offers)
- All active offers you create
- Updates automatically when you add/edit/delete

---

## 🎉 Summary

1. **Run SQL once** → Creates table structure
2. **Use admin panel always** → Add/manage all offers
3. **No more SQL needed** → Everything through admin panel
4. **Website updates automatically** → No code changes needed

---

**You will NEVER need to use SQL again after the initial setup!**  
**All offers are managed through the admin panel!**

