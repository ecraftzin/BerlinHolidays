# ✅ EmailJS Setup Checklist

Follow this checklist to fix the "400 Bad Request" error.

---

## 📋 Setup Checklist

### 1. Create EmailJS Account
- [ ] Go to https://www.emailjs.com/
- [ ] Click "Sign Up"
- [ ] Sign up with Google (use any Gmail)
- [ ] Verify email if needed
- [ ] You should see the EmailJS dashboard

---

### 2. Connect Gmail Service
- [ ] Click "Email Services" in left menu
- [ ] Click "Add New Service"
- [ ] Select "Gmail"
- [ ] Click "Connect Account"
- [ ] Sign in with Gmail
- [ ] Click "Allow" to grant permissions
- [ ] **COPY the Service ID** (starts with `service_`)

**Your Service ID:** `_______________________`

---

### 3. Create Email Template
- [ ] Click "Email Templates" in left menu
- [ ] Click "Create New Template"
- [ ] Set Subject: `New Contact Form - {{subject}}`
- [ ] Set Body (copy from SETUP_NOW.md)
- [ ] **IMPORTANT:** Set "To Email" field to: `{{to_email}}`
- [ ] Click "Save"
- [ ] **COPY the Template ID** (starts with `template_`)

**Your Template ID:** `_______________________`

---

### 4. Get Public Key
- [ ] Click "Account" in left menu
- [ ] Click "General" tab
- [ ] Scroll to "API Keys" section
- [ ] **COPY the Public Key**

**Your Public Key:** `_______________________`

---

### 5. Update .env File
- [ ] Open `.env` file in your project
- [ ] Replace `VITE_EMAILJS_SERVICE_ID=your_service_id_here` with your Service ID
- [ ] Replace `VITE_EMAILJS_TEMPLATE_ID=your_template_id_here` with your Template ID
- [ ] Replace `VITE_EMAILJS_PUBLIC_KEY=your_public_key_here` with your Public Key
- [ ] **SAVE the file**

---

### 6. Restart Development Server
- [ ] Stop the server (Ctrl+C in terminal)
- [ ] Run: `npm run dev`
- [ ] Wait for server to start

---

### 7. Test the Form
- [ ] Go to Contact page
- [ ] Fill out the form
- [ ] Click "Send Message"
- [ ] Should see "Success!" message
- [ ] Check Gmail inbox for email

---

## 🎯 Expected Results

After completing all steps:

✅ No more "400 Bad Request" error
✅ Success message appears
✅ Form resets after submission
✅ Email arrives in Gmail inbox (1-2 minutes)

---

## 🆘 Troubleshooting

### Still getting "Public Key is invalid"?
- Double-check you copied the entire key
- No spaces before/after the key
- Save the `.env` file
- Restart dev server

### No email received?
- Check spam folder
- Wait 2-3 minutes
- Verify "To Email" in template is set to `{{to_email}}`

### Form shows "Setup Required"?
- One or more credentials is missing
- Check all 3 values in `.env` are filled in
- Restart dev server

---

## 📞 Need Help?

If stuck, share:
1. Which step you're on
2. What the screen shows
3. Any error messages

---

**Total Time: ~5 minutes** ⏱️

**Let's get it working!** 🚀

