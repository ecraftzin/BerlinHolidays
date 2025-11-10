# 🧪 Contact Form Testing Guide

## 📋 Overview

This guide will help you test the contact form with your personal email (**meenakshy.ecraftz@gmail.com**) before switching to the client email (**berlinvayanad@gmail.com**).

---

## ✅ Prerequisites Checklist

Before testing, make sure you have:

- [x] EmailJS package installed (`@emailjs/browser`)
- [ ] EmailJS account created at https://www.emailjs.com
- [ ] Gmail service connected to EmailJS
- [ ] Email template created in EmailJS
- [ ] Service ID, Template ID, and Public Key from EmailJS
- [ ] Credentials added to `.env` file
- [ ] Supabase database table created (`contact_inquiries`)

---

## 🔧 Setup Steps

### Step 1: Complete EmailJS Setup

Follow the **EMAILJS_SETUP_GUIDE.md** to:
1. Create EmailJS account
2. Connect Gmail service
3. Create email template
4. Get your credentials

### Step 2: Add Credentials to `.env` File

Open the `.env` file and replace the placeholders with your actual EmailJS credentials:

```env
# EmailJS Configuration (for Contact Form)
VITE_EMAILJS_SERVICE_ID=service_xxxxxxx    # Replace with your Service ID
VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx  # Replace with your Template ID
VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxx    # Replace with your Public Key

# Contact Form Email (Testing)
VITE_CONTACT_EMAIL=meenakshy.ecraftz@gmail.com
```

**Example with real values:**
```env
VITE_EMAILJS_SERVICE_ID=service_abc123
VITE_EMAILJS_TEMPLATE_ID=template_xyz789
VITE_EMAILJS_PUBLIC_KEY=mK9pL3nR2qT5vW8x
VITE_CONTACT_EMAIL=meenakshy.ecraftz@gmail.com
```

### Step 3: Create Supabase Database Table

1. Go to Supabase Dashboard: https://app.supabase.com
2. Select your project: **egqexbjvccihrvcrrydi**
3. Go to **SQL Editor** → **New Query**
4. Copy and paste the contents of `create_contact_inquiries_table.sql`
5. Click **Run**

### Step 4: Restart Development Server

After updating `.env`, restart your dev server:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

---

## 🧪 Testing Procedure

### Test 1: Basic Form Submission

1. **Open the contact page**: http://localhost:5173/contact

2. **Fill out the form**:
   - Name: `Test User`
   - Email: `test@example.com`
   - Subject: Select `Adventure`
   - Message: `This is a test message from the contact form.`

3. **Click "SEND MESSAGE"**

4. **Expected Results**:
   - ✅ Button changes to "SENDING..."
   - ✅ Button is disabled during submission
   - ✅ Success message appears: "Your message has been sent successfully..."
   - ✅ Form resets to empty
   - ✅ Email arrives at **meenakshy.ecraftz@gmail.com** within 1-2 minutes
   - ✅ Data appears in Supabase `contact_inquiries` table

### Test 2: Dropdown Selection

1. **Open the contact page**

2. **Click the Subject dropdown**

3. **Select "Honeymoon"**

4. **Expected Results**:
   - ✅ Dropdown displays "Honeymoon" (not "Select Subject")
   - ✅ Dropdown has khaki-colored arrow
   - ✅ Selection is visible and clear

### Test 3: Form Validation

**Test 3a: Empty Name**
1. Leave Name field empty
2. Fill other fields
3. Click "SEND MESSAGE"
4. **Expected**: Error message "Please enter your name"

**Test 3b: Invalid Email**
1. Name: `Test User`
2. Email: `invalid-email` (no @ symbol)
3. Fill other fields
4. Click "SEND MESSAGE"
5. **Expected**: Error message "Please enter a valid email address"

**Test 3c: No Subject Selected**
1. Fill Name and Email
2. Leave Subject as "Select Subject"
3. Fill Message
4. Click "SEND MESSAGE"
5. **Expected**: Error message "Please select a subject"

**Test 3d: Empty Message**
1. Fill Name, Email, and Subject
2. Leave Message empty
3. Click "SEND MESSAGE"
4. **Expected**: Error message "Please enter your message"

### Test 4: Multiple Submissions

1. Submit the form successfully
2. Wait for success message and form reset
3. Fill and submit the form again
4. **Expected**: Both submissions work correctly

### Test 5: Email Content Verification

Check the email received at **meenakshy.ecraftz@gmail.com**:

**Email should contain**:
- ✅ Subject line: "New Contact Form Submission - [Subject]"
- ✅ Customer name
- ✅ Customer email
- ✅ Selected subject
- ✅ Message content
- ✅ Submission date/time
- ✅ Professional formatting with Berlin Holidays branding
- ✅ Reply-to address set to customer's email

### Test 6: Database Verification

1. Go to Supabase Dashboard
2. Click **Table Editor**
3. Select **contact_inquiries** table
4. **Expected**: All test submissions are visible with:
   - ✅ Correct name, email, subject, message
   - ✅ Status: "new"
   - ✅ Created timestamp

---

## 🐛 Troubleshooting

### Issue: "EmailJS not configured" in console

**Solution**:
1. Check `.env` file has all EmailJS credentials
2. Make sure there are no typos in variable names
3. Restart dev server after updating `.env`
4. Clear browser cache

### Issue: Form submits but no email received

**Checklist**:
- [ ] Check spam/junk folder in meenakshy.ecraftz@gmail.com
- [ ] Verify EmailJS credentials are correct
- [ ] Check EmailJS dashboard for delivery status
- [ ] Verify Gmail service is connected in EmailJS
- [ ] Check browser console for errors
- [ ] Test the template directly in EmailJS dashboard

**Debug Steps**:
1. Open browser console (F12)
2. Submit the form
3. Look for "Email notification sent successfully!" message
4. If you see an error, copy it and check EmailJS docs

### Issue: Dropdown not showing selection

**Solution**:
1. Clear browser cache (Ctrl+Shift+Delete)
2. Hard refresh the page (Ctrl+F5)
3. Check browser console for errors

### Issue: Form not saving to database

**Solution**:
1. Verify Supabase credentials in `.env`
2. Check if `contact_inquiries` table exists
3. Check browser console for errors
4. Verify Supabase project is active

### Issue: "Failed to send your message" error

**Possible Causes**:
1. Supabase database error
2. Network connection issue
3. Invalid form data

**Debug Steps**:
1. Open browser console
2. Look for error messages
3. Check Supabase logs in dashboard
4. Verify internet connection

---

## 📊 Test Results Checklist

After completing all tests, verify:

- [ ] Form submits successfully
- [ ] Dropdown shows selected value
- [ ] All validation works correctly
- [ ] Email arrives at meenakshy.ecraftz@gmail.com
- [ ] Email content is correct and well-formatted
- [ ] Data saves to Supabase database
- [ ] Form resets after submission
- [ ] Loading states work correctly
- [ ] Success/error messages display properly
- [ ] Multiple submissions work

---

## 🔄 Switching to Client Email

Once testing is complete and everything works:

### Step 1: Update `.env` File

Change the contact email from your testing email to the client's email:

```env
# Contact Form Email (Production)
VITE_CONTACT_EMAIL=berlinvayanad@gmail.com
```

### Step 2: Restart Server

```bash
# Stop the server (Ctrl+C)
# Restart:
npm run dev
```

### Step 3: Test One More Time

Submit a test form to verify emails now go to **berlinvayanad@gmail.com**

### Step 4: Deploy to Production

When deploying to Vercel or other hosting:

1. Add environment variables in hosting dashboard:
   ```
   VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
   VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
   VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxx
   VITE_CONTACT_EMAIL=berlinvayanad@gmail.com
   ```

2. Redeploy the application

---

## 📧 Email Template Variables

The email template uses these variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `{{from_name}}` | Customer's name | John Doe |
| `{{from_email}}` | Customer's email | john@example.com |
| `{{subject}}` | Selected subject | Honeymoon |
| `{{message}}` | Customer's message | I would like to book... |
| `{{to_email}}` | Recipient email | meenakshy.ecraftz@gmail.com |
| `{{submission_date}}` | Submission timestamp | 1/10/2025, 2:30:00 PM |

---

## 🎯 Success Criteria

The contact form is working correctly when:

1. ✅ Dropdown displays selected value
2. ✅ All form validations work
3. ✅ Form submits without errors
4. ✅ Email arrives within 1-2 minutes
5. ✅ Email content is correct and formatted
6. ✅ Data saves to Supabase database
7. ✅ Form resets after successful submission
8. ✅ User receives clear success/error messages

---

## 📞 Next Steps

After successful testing:

1. ✅ Switch email to berlinvayanad@gmail.com
2. ✅ Test one more time with client email
3. ✅ Deploy to production
4. ✅ Add environment variables to hosting platform
5. ✅ Inform client that contact form is live
6. ✅ Monitor Supabase for incoming inquiries

---

## 🆘 Need Help?

If you encounter any issues:

1. Check browser console (F12) for errors
2. Check EmailJS dashboard for delivery logs
3. Check Supabase logs for database errors
4. Review this guide's troubleshooting section
5. Verify all credentials are correct

---

**Ready to test? Follow the steps above and let me know if you encounter any issues!** 🚀

