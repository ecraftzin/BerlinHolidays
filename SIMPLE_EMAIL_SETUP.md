# 📧 Simple Contact Form Email Setup

Your contact form is now configured to send emails **directly to Gmail** without storing any data in a database.

## ✅ What You Get

When a customer fills out the contact form and clicks "Send Message":
- ✉️ Email is sent **directly to your Gmail inbox**
- 📝 No database storage
- 🚀 Simple and straightforward

---

## 🔧 Setup Steps (15 minutes)

### Step 1: Create EmailJS Account (5 minutes)

1. **Go to EmailJS**: https://www.emailjs.com/
2. **Sign up** with your Gmail account (berlinvayanad@gmail.com)
3. **Verify your email** (check inbox for verification link)

---

### Step 2: Connect Gmail Service (3 minutes)

1. After logging in, click **"Add New Service"**
2. Select **"Gmail"**
3. Click **"Connect Account"**
4. Sign in with your Gmail (berlinvayanad@gmail.com)
5. Allow EmailJS to send emails on your behalf
6. **Copy the Service ID** (looks like: `service_abc1234`)

---

### Step 3: Create Email Template (5 minutes)

1. Go to **"Email Templates"** in EmailJS dashboard
2. Click **"Create New Template"**
3. **Template Name**: `Contact Form Notification`
4. **Template Content**:

```
Subject: New Contact Form Submission - {{subject}}

From: {{from_name}}
Email: {{from_email}}
Subject: {{subject}}
Date: {{submission_date}}

Message:
{{message}}

---
This email was sent from the Berlin Holidays contact form.
```

5. In the **"To Email"** field, enter: `{{to_email}}`
6. Click **"Save"**
7. **Copy the Template ID** (looks like: `template_xyz5678`)

---

### Step 4: Get Your Public Key (1 minute)

1. Go to **"Account"** → **"General"** in EmailJS dashboard
2. Find **"Public Key"** section
3. **Copy the Public Key** (looks like: `mK9pL3nR2qT5vW8x`)

---

### Step 5: Add Credentials to Your Website (2 minutes)

Open the `.env` file in your project and replace these lines:

```env
VITE_EMAILJS_SERVICE_ID=service_abc1234        # ← Paste your Service ID here
VITE_EMAILJS_TEMPLATE_ID=template_xyz5678      # ← Paste your Template ID here
VITE_EMAILJS_PUBLIC_KEY=mK9pL3nR2qT5vW8x      # ← Paste your Public Key here
VITE_CONTACT_EMAIL=berlinvayanad@gmail.com     # ← Your Gmail address
```

**Save the file!**

---

### Step 6: Test the Contact Form (2 minutes)

1. **Start your website** (if not already running)
2. **Go to the Contact page**
3. **Fill out the form** with test data:
   - Name: Test User
   - Email: test@example.com
   - Subject: General Inquiry
   - Message: This is a test message
4. **Click "SEND MESSAGE"**
5. **Check your Gmail inbox** (berlinvayanad@gmail.com)
6. You should receive the email within 1-2 minutes!

---

## 📋 What the Email Will Look Like

When a customer submits the form, you'll receive an email like this:

```
From: noreply@emailjs.com
To: berlinvayanad@gmail.com
Subject: New Contact Form Submission - General Inquiry

From: John Doe
Email: john@example.com
Subject: General Inquiry
Date: 1/10/2025, 3:45:00 PM

Message:
I would like to book a room for my honeymoon. Can you provide more details about your packages?

---
This email was sent from the Berlin Holidays contact form.
```

---

## 🎯 EmailJS Free Plan Limits

- ✅ **200 emails per month** (free)
- ✅ Perfect for small to medium contact forms
- ✅ No credit card required

If you need more emails, you can upgrade to a paid plan later.

---

## 🔒 Security Notes

- ✅ Your Gmail password is **never exposed**
- ✅ EmailJS uses OAuth2 for secure authentication
- ✅ All credentials are stored in `.env` file (not in code)
- ✅ The `.env` file is **not uploaded to GitHub** (protected)

---

## 🆘 Troubleshooting

### Not receiving emails?
1. Check your **Gmail spam folder**
2. Wait 2-3 minutes (sometimes delayed)
3. Verify the credentials in `.env` file are correct
4. Make sure you saved the `.env` file after editing

### "Email service is not configured" error?
1. Make sure all 4 variables in `.env` are filled in
2. Restart your development server after editing `.env`
3. Check for typos in the variable names

### Emails going to spam?
1. Mark the first email as "Not Spam" in Gmail
2. Add `noreply@emailjs.com` to your contacts
3. Future emails will go to your inbox

---

## 📞 Need Help?

If you encounter any issues during setup, please contact your developer with:
1. Screenshot of the error message
2. Which step you're stuck on
3. Your EmailJS Service ID and Template ID

---

## ✨ That's It!

Your contact form is now ready to send emails directly to your Gmail inbox. No database, no complications - just simple email delivery!

**Happy emailing! 🎉**

