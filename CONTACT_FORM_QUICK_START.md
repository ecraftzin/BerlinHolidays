# 🚀 Contact Form - Quick Start Guide

## ✅ What's Fixed

1. **Dropdown Select Field** - Now displays selected value correctly with proper styling
2. **Form Submission** - Saves all inquiries to Supabase database
3. **Form Validation** - Validates all fields before submission
4. **User Feedback** - Shows success/error messages using SweetAlert2
5. **Loading States** - Button shows "SENDING..." during submission

## 📝 Setup Steps (5 Minutes)

### Step 1: Create Database Table

1. Open Supabase Dashboard: https://app.supabase.com
2. Select your project: **egqexbjvccihrvcrrydi**
3. Go to **SQL Editor** → **New Query**
4. Copy and paste this SQL:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create contact_inquiries table
CREATE TABLE IF NOT EXISTS contact_inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_status ON contact_inquiries(status);
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_created_at ON contact_inquiries(created_at DESC);

-- Enable Row Level Security
ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit contact form
CREATE POLICY "Anyone can submit contact form" ON contact_inquiries
  FOR INSERT WITH CHECK (true);

-- Allow authenticated users to read (for admin)
CREATE POLICY "Authenticated users can read all inquiries" ON contact_inquiries
  FOR SELECT USING (auth.role() = 'authenticated');
```

5. Click **Run** (or press F5)
6. You should see "Success. No rows returned"

### Step 2: Test the Contact Form

1. Run your development server:
   ```bash
   npm run dev
   ```

2. Go to the Contact page: http://localhost:5173/contact

3. Fill out the form:
   - Name: Test User
   - Email: test@example.com
   - Subject: Select any option (dropdown should work now!)
   - Message: This is a test message

4. Click **SEND MESSAGE**

5. You should see:
   - Button changes to "SENDING..."
   - Success message appears
   - Form resets to empty

### Step 3: Verify Data in Supabase

1. Go to Supabase Dashboard
2. Click **Table Editor**
3. Select **contact_inquiries** table
4. You should see your test submission!

## 📧 Email Notifications (Optional)

The form now saves all inquiries to the database. To receive email notifications at **berlinvayanad@gmail.com**, choose one of these options:

### Option A: Zapier (Easiest - 5 minutes)

1. Sign up at https://zapier.com (free)
2. Create new Zap:
   - Trigger: **Webhooks** → **Catch Hook**
   - Copy webhook URL
3. In Supabase:
   - Go to **Database** → **Webhooks**
   - Create new hook:
     - Table: `contact_inquiries`
     - Events: Insert
     - Type: HTTP Request
     - URL: Your Zapier webhook URL
4. In Zapier:
   - Action: **Gmail** → **Send Email**
   - To: berlinvayanad@gmail.com
   - Subject: New Contact: {{name}}
   - Body: Include {{name}}, {{email}}, {{subject}}, {{message}}
5. Test and activate!

### Option B: Check Database Manually

Simply check the `contact_inquiries` table in Supabase regularly to see new submissions.

## 🎨 What Changed in the Code

### Files Created:
- `src/services/contactService.js` - Handles form submissions
- `create_contact_inquiries_table.sql` - Database setup
- `CONTACT_FORM_EMAIL_SETUP.md` - Detailed email setup guide

### Files Modified:
- `src/Pages/InnerPage/Contact.jsx` - Fixed dropdown and added form functionality

### Key Changes:
1. Added React state management for form fields
2. Fixed dropdown with proper `value` and `onChange` handlers
3. Added custom dropdown arrow styling (khaki color)
4. Implemented form validation
5. Connected to Supabase database
6. Added loading states and user feedback

## 🔍 Viewing Contact Inquiries

### In Supabase Dashboard:
1. Go to **Table Editor**
2. Select **contact_inquiries**
3. View all submissions with:
   - Name, Email, Subject, Message
   - Status (new, read, replied, archived)
   - Created date/time

### Filter by Status:
```sql
SELECT * FROM contact_inquiries WHERE status = 'new' ORDER BY created_at DESC;
```

### Export to CSV:
Click the **Export** button in Table Editor

## 🎯 Next Steps

1. ✅ Test the contact form
2. ✅ Verify data saves to Supabase
3. ⏳ Set up email notifications (optional)
4. ⏳ Create admin page to manage inquiries (optional)

## 🐛 Troubleshooting

### Dropdown not showing selected value?
- Clear browser cache and refresh
- Check browser console for errors

### Form not submitting?
- Check browser console for errors
- Verify Supabase credentials in `.env` file
- Make sure database table is created

### Email not received?
- Check spam folder
- Verify webhook is active in Supabase
- Test webhook URL manually

## 📞 Support

If you encounter any issues, check:
1. Browser console (F12) for error messages
2. Supabase logs in Dashboard
3. Network tab to see API requests

---

**All Done! 🎉** Your contact form is now fully functional and saving inquiries to the database.

