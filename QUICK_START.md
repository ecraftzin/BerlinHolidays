# 🚀 Quick Start - Contact Form Email Setup

## What You Need to Do

Your contact form will send emails **directly to your Gmail inbox** (berlinvayanad@gmail.com).

### ⏱️ Time Required: 15 minutes

---

## 📝 3 Simple Steps

### 1️⃣ Create EmailJS Account
- Go to: https://www.emailjs.com/
- Sign up with Gmail: **berlinvayanad@gmail.com**
- Verify your email

### 2️⃣ Get Your 3 Credentials
You need to get these 3 things from EmailJS:

1. **Service ID** (from Gmail service connection)
2. **Template ID** (from email template creation)
3. **Public Key** (from Account settings)

📖 **Detailed instructions**: See `SIMPLE_EMAIL_SETUP.md`

### 3️⃣ Add Credentials to `.env` File

Open the `.env` file and replace these 3 lines:

```env
VITE_EMAILJS_SERVICE_ID=your_service_id_here    # ← Paste Service ID
VITE_EMAILJS_TEMPLATE_ID=your_template_id_here  # ← Paste Template ID
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here    # ← Paste Public Key
```

**Save the file and restart your website!**

---

## ✅ Test It

1. Go to your Contact page
2. Fill out the form
3. Click "Send Message"
4. Check your Gmail inbox!

---

## 📧 What Happens

When a customer submits the form:
- ✉️ Email goes **directly to berlinvayanad@gmail.com**
- 📝 **No database** - just email
- 🚀 Simple and fast

---

## 🆘 Need Help?

Read the full guide: **SIMPLE_EMAIL_SETUP.md**

---

**That's it! Simple email delivery for your contact form. 🎉**

