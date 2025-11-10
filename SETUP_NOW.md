# 🚀 Setup EmailJS Right Now (5 Minutes)

## The Error You're Seeing

```
The Public Key is invalid
```

This means the `.env` file still has placeholder values. Let's fix it!

---

## ⚡ Quick Setup Steps

### Step 1: Create EmailJS Account (2 minutes)

1. **Open this link**: https://www.emailjs.com/
2. Click **"Sign Up"**
3. Choose **"Sign up with Google"**
4. Use your Gmail account (any Gmail will work for testing)
5. Verify your email if prompted

---

### Step 2: Connect Gmail Service (1 minute)

1. After logging in, you'll see the dashboard
2. Click **"Email Services"** in the left menu
3. Click **"Add New Service"**
4. Select **"Gmail"**
5. Click **"Connect Account"**
6. Sign in with your Gmail
7. Click **"Allow"** to grant permissions
8. **COPY THE SERVICE ID** that appears (looks like: `service_abc1234`)

📝 **Save this Service ID somewhere!**

---

### Step 3: Create Email Template (1 minute)

1. Click **"Email Templates"** in the left menu
2. Click **"Create New Template"**
3. You'll see a template editor

**Replace the template content with this:**

**Subject line:**
```
New Contact Form - {{subject}}
```

**Content (Body):**
```
New contact form submission from Berlin Holidays website:

From: {{from_name}}
Email: {{from_email}}
Subject: {{subject}}
Date: {{submission_date}}

Message:
{{message}}

---
Sent from Berlin Holidays Contact Form
```

**To Email field (important!):**
```
{{to_email}}
```

4. Click **"Save"**
5. **COPY THE TEMPLATE ID** (looks like: `template_xyz5678`)

📝 **Save this Template ID somewhere!**

---

### Step 4: Get Public Key (30 seconds)

1. Click **"Account"** in the left menu
2. Click **"General"** tab
3. Scroll down to **"API Keys"** section
4. You'll see **"Public Key"** (looks like: `mK9pL3nR2qT5vW8x`)
5. **COPY THE PUBLIC KEY**

📝 **Save this Public Key somewhere!**

---

### Step 5: Update .env File (1 minute)

Now you have all 3 credentials. Open your `.env` file and replace:

```env
VITE_EMAILJS_SERVICE_ID=service_abc1234        # ← Paste YOUR Service ID
VITE_EMAILJS_TEMPLATE_ID=template_xyz5678      # ← Paste YOUR Template ID
VITE_EMAILJS_PUBLIC_KEY=mK9pL3nR2qT5vW8x      # ← Paste YOUR Public Key
VITE_CONTACT_EMAIL=berlinvayanad@gmail.com     # ← Already set!
```

**Example (with real credentials):**
```env
VITE_EMAILJS_SERVICE_ID=service_8h3k2j1
VITE_EMAILJS_TEMPLATE_ID=template_9m4n5p6
VITE_EMAILJS_PUBLIC_KEY=xY7zW3vU2tS1rQ0
VITE_CONTACT_EMAIL=berlinvayanad@gmail.com
```

**SAVE THE FILE!**

---

### Step 6: Restart Your Dev Server (30 seconds)

1. Stop your development server (Ctrl+C in terminal)
2. Start it again:
   ```bash
   npm run dev
   ```

---

### Step 7: Test! (1 minute)

1. Go to your Contact page
2. Fill out the form:
   - Name: Test User
   - Email: test@example.com
   - Subject: General Inquiry
   - Message: This is a test
3. Click **"SEND MESSAGE"**
4. You should see: **"Success! Your message has been sent..."**
5. Check the Gmail inbox you used for EmailJS setup

---

## ✅ What to Expect

- ✅ No more "400 Bad Request" error
- ✅ Success message appears
- ✅ Form resets
- ✅ Email arrives in your Gmail inbox within 1-2 minutes

---

## 🆘 Still Getting Errors?

### Error: "The Public Key is invalid"
- Make sure you copied the ENTIRE Public Key
- No extra spaces before or after
- Save the `.env` file
- Restart dev server

### Error: "The Service ID is invalid"
- Double-check you copied the correct Service ID
- It should start with `service_`

### Error: "The Template ID is invalid"
- Double-check you copied the correct Template ID
- It should start with `template_`

### No email received?
- Check spam folder
- Wait 2-3 minutes
- Make sure you set `{{to_email}}` in the template's "To Email" field

---

## 📞 Need Help?

If you're stuck on any step, let me know:
1. Which step you're on
2. What you see on the screen
3. Any error messages

I'll help you get it working! 🚀

