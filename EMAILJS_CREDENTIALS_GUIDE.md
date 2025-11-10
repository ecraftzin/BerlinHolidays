# 📧 EmailJS Credentials - Where to Find Them

This guide shows you **exactly where** to find the 3 credentials you need.

---

## 🔑 The 3 Credentials You Need

1. **Service ID** - From Gmail service connection
2. **Template ID** - From email template
3. **Public Key** - From account settings

---

## 📍 Step-by-Step: Where to Find Each One

### 1️⃣ Service ID

**Where to find it:**
1. Go to https://www.emailjs.com/
2. Log in to your account
3. Click **"Email Services"** in the left menu
4. You'll see your Gmail service listed
5. The **Service ID** is shown next to the Gmail icon
   - Example: `service_abc1234`

**Copy this Service ID** ✅

---

### 2️⃣ Template ID

**Where to find it:**
1. In EmailJS dashboard, click **"Email Templates"** in the left menu
2. You'll see your template listed (e.g., "Contact Form Notification")
3. The **Template ID** is shown below the template name
   - Example: `template_xyz5678`

**Copy this Template ID** ✅

---

### 3️⃣ Public Key

**Where to find it:**
1. In EmailJS dashboard, click **"Account"** in the left menu
2. Click **"General"** tab
3. Scroll down to **"API Keys"** section
4. You'll see **"Public Key"**
   - Example: `mK9pL3nR2qT5vW8x`

**Copy this Public Key** ✅

---

## 📝 What to Do With These Credentials

Once you have all 3 credentials, open the `.env` file in your project and replace:

```env
VITE_EMAILJS_SERVICE_ID=service_abc1234        # ← Your Service ID
VITE_EMAILJS_TEMPLATE_ID=template_xyz5678      # ← Your Template ID
VITE_EMAILJS_PUBLIC_KEY=mK9pL3nR2qT5vW8x      # ← Your Public Key
```

**Important:**
- Remove `your_service_id_here` and paste your actual Service ID
- Remove `your_template_id_here` and paste your actual Template ID
- Remove `your_public_key_here` and paste your actual Public Key

---

## ✅ Example (Before and After)

### ❌ Before (Default):
```env
VITE_EMAILJS_SERVICE_ID=your_service_id_here
VITE_EMAILJS_TEMPLATE_ID=your_template_id_here
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
```

### ✅ After (With Your Credentials):
```env
VITE_EMAILJS_SERVICE_ID=service_abc1234
VITE_EMAILJS_TEMPLATE_ID=template_xyz5678
VITE_EMAILJS_PUBLIC_KEY=mK9pL3nR2qT5vW8x
```

---

## 🎯 Quick Checklist

- [ ] Created EmailJS account
- [ ] Connected Gmail service
- [ ] Copied Service ID
- [ ] Created email template
- [ ] Copied Template ID
- [ ] Found Public Key in Account settings
- [ ] Copied Public Key
- [ ] Pasted all 3 credentials into `.env` file
- [ ] Saved the `.env` file
- [ ] Restarted the website

---

## 🆘 Troubleshooting

### Can't find Service ID?
- Make sure you've connected Gmail service first
- Go to "Email Services" menu
- If no service exists, click "Add New Service" → "Gmail"

### Can't find Template ID?
- Make sure you've created a template first
- Go to "Email Templates" menu
- If no template exists, click "Create New Template"

### Can't find Public Key?
- Go to "Account" → "General"
- Scroll down to "API Keys" section
- The Public Key is always there (auto-generated)

---

## 📞 Still Stuck?

If you can't find the credentials:
1. Make sure you're logged into EmailJS
2. Check you're on the correct EmailJS account
3. Try refreshing the page
4. Contact EmailJS support: https://www.emailjs.com/docs/

---

## ✨ That's It!

Once you have all 3 credentials in the `.env` file, your contact form will work perfectly!

**Happy emailing! 🎉**

