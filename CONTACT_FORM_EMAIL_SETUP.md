# Contact Form Email Notification Setup

This guide explains how to set up email notifications for the Berlin Holidays contact form.

## 📋 What's Been Implemented

### ✅ Completed Features

1. **Contact Form with State Management**
   - Fixed dropdown select field display issue
   - Added proper form validation
   - Implemented form submission to Supabase database
   - Added loading states and user feedback

2. **Database Table**
   - Created `contact_inquiries` table in Supabase
   - Stores all customer inquiries with name, email, subject, and message
   - Includes status tracking (new, read, replied, archived)

3. **Contact Service**
   - Created `src/services/contactService.js`
   - Handles form submissions to Supabase
   - Provides admin functions to manage inquiries

## 🔧 Setup Instructions

### Step 1: Create the Database Table

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your project: **egqexbjvccihrvcrrydi**
3. Click on **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy and paste the contents of `create_contact_inquiries_table.sql`
6. Click **Run** to execute the SQL

### Step 2: Set Up Email Notifications

You have **3 options** for email notifications:

---

## Option 1: Supabase Database Webhooks (Recommended - Free)

This option sends an HTTP request to a service like Zapier or Make.com when a new inquiry is submitted.

### Using Zapier (Free tier available)

1. **Create a Zapier Account**: https://zapier.com
2. **Create a New Zap**:
   - Trigger: **Webhooks by Zapier** → **Catch Hook**
   - Copy the webhook URL provided
3. **Set up Supabase Webhook**:
   - Go to Supabase Dashboard → Database → Webhooks
   - Click **Create a new hook**
   - Name: `contact_form_notification`
   - Table: `contact_inquiries`
   - Events: Check **Insert**
   - Type: **HTTP Request**
   - Method: **POST**
   - URL: Paste your Zapier webhook URL
   - HTTP Headers: `Content-Type: application/json`
4. **Complete Zapier Setup**:
   - Action: **Gmail** → **Send Email**
   - To: `berlinvayanad@gmail.com`
   - Subject: `New Contact Form Submission - {{name}}`
   - Body:
     ```
     New contact form submission received!
     
     Name: {{name}}
     Email: {{email}}
     Subject: {{subject}}
     Message: {{message}}
     
     Submitted at: {{created_at}}
     ```
5. **Test the Zap** and turn it on

### Using Make.com (Free tier available)

1. **Create a Make.com Account**: https://make.com
2. **Create a New Scenario**:
   - Add **Webhooks** → **Custom Webhook**
   - Copy the webhook URL
3. **Set up Supabase Webhook** (same as Zapier above)
4. **Add Email Module**:
   - Add **Email** → **Send an Email**
   - Configure with your email settings
5. **Activate the scenario**

---

## Option 2: Supabase Edge Functions (Advanced)

Create a serverless function that sends emails using a service like SendGrid or Resend.

### Using Resend (Recommended - Free tier: 100 emails/day)

1. **Install Supabase CLI**:
   ```bash
   npm install -g supabase
   ```

2. **Create Edge Function**:
   ```bash
   supabase functions new send-contact-email
   ```

3. **Install Resend**:
   - Sign up at https://resend.com
   - Get your API key
   - Add to Supabase secrets:
     ```bash
     supabase secrets set RESEND_API_KEY=your_api_key
     ```

4. **Function Code** (`supabase/functions/send-contact-email/index.ts`):
   ```typescript
   import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
   
   const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
   
   serve(async (req) => {
     const { record } = await req.json()
     
     const res = await fetch('https://api.resend.com/emails', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
         'Authorization': `Bearer ${RESEND_API_KEY}`
       },
       body: JSON.stringify({
         from: 'Berlin Holidays <noreply@yourdomain.com>',
         to: ['berlinvayanad@gmail.com'],
         subject: `New Contact Form: ${record.subject}`,
         html: `
           <h2>New Contact Form Submission</h2>
           <p><strong>Name:</strong> ${record.name}</p>
           <p><strong>Email:</strong> ${record.email}</p>
           <p><strong>Subject:</strong> ${record.subject}</p>
           <p><strong>Message:</strong></p>
           <p>${record.message}</p>
         `
       })
     })
     
     return new Response(JSON.stringify({ success: true }), {
       headers: { 'Content-Type': 'application/json' }
     })
   })
   ```

5. **Deploy Function**:
   ```bash
   supabase functions deploy send-contact-email
   ```

6. **Create Database Trigger**:
   ```sql
   CREATE OR REPLACE FUNCTION notify_new_contact()
   RETURNS TRIGGER AS $$
   BEGIN
     PERFORM net.http_post(
       url := 'https://your-project.supabase.co/functions/v1/send-contact-email',
       headers := '{"Content-Type": "application/json", "Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb,
       body := json_build_object('record', row_to_json(NEW))::jsonb
     );
     RETURN NEW;
   END;
   $$ LANGUAGE plpgsql;
   
   CREATE TRIGGER on_contact_inquiry_created
     AFTER INSERT ON contact_inquiries
     FOR EACH ROW
     EXECUTE FUNCTION notify_new_contact();
   ```

---

## Option 3: Third-Party Email Service (Simplest)

Use a service like EmailJS to send emails directly from the frontend.

### Using EmailJS (Free tier: 200 emails/month)

1. **Sign up at EmailJS**: https://emailjs.com
2. **Create Email Service**:
   - Connect your Gmail account
3. **Create Email Template**:
   - Template ID: `contact_form`
   - Template content:
     ```
     New contact form submission from {{from_name}}
     
     Email: {{from_email}}
     Subject: {{subject}}
     Message: {{message}}
     ```
4. **Install EmailJS**:
   ```bash
   npm install @emailjs/browser
   ```

5. **Update Contact.jsx**:
   ```javascript
   import emailjs from '@emailjs/browser';
   
   // In handleSubmit, after successful database save:
   try {
     await emailjs.send(
       'YOUR_SERVICE_ID',
       'contact_form',
       {
         from_name: formData.name,
         from_email: formData.email,
         subject: formData.subject,
         message: formData.message,
         to_email: 'berlinvayanad@gmail.com'
       },
       'YOUR_PUBLIC_KEY'
     );
   } catch (emailError) {
     console.error('Email notification failed:', emailError);
     // Don't show error to user since form was saved
   }
   ```

---

## 📊 Viewing Contact Inquiries

All contact form submissions are stored in the `contact_inquiries` table in Supabase.

### View in Supabase Dashboard

1. Go to Supabase Dashboard
2. Click **Table Editor**
3. Select **contact_inquiries** table
4. View all submissions with filters and search

### Create Admin Dashboard Page (Optional)

You can create an admin page to view and manage contact inquiries:

```javascript
// src/Pages/AdminDashboard/ContactInquiries.jsx
import { useState, useEffect } from 'react';
import { getAllContactInquiries, updateContactInquiryStatus } from '../../services/contactService';

const ContactInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  
  useEffect(() => {
    fetchInquiries();
  }, []);
  
  const fetchInquiries = async () => {
    const { data } = await getAllContactInquiries();
    setInquiries(data || []);
  };
  
  // ... render table with inquiries
};
```

---

## 🎯 Recommendation

For **Berlin Holidays**, I recommend:

1. **Start with Option 1 (Zapier/Make.com)**:
   - Easiest to set up (no coding required)
   - Free tier is sufficient for most small businesses
   - Can be set up in 10 minutes
   - Reliable and tested

2. **Later upgrade to Option 2 (Edge Functions)** if:
   - You need more than 100 emails/day
   - You want more control over email templates
   - You want to add custom logic (auto-replies, etc.)

---

## ✅ Testing

1. Go to your contact page
2. Fill out the form with test data
3. Click "Send Message"
4. Check:
   - Success message appears
   - Form resets
   - Data appears in Supabase `contact_inquiries` table
   - Email arrives at berlinvayanad@gmail.com (if notifications set up)

---

## 🔒 Security Notes

- The contact form uses Supabase Row Level Security (RLS)
- Anyone can submit the form (INSERT policy)
- Only authenticated users can view inquiries (SELECT policy)
- Form includes validation and sanitization
- Rate limiting should be added for production (see Supabase docs)

---

## 📞 Support

If you need help setting up email notifications, please let me know which option you'd like to use!

