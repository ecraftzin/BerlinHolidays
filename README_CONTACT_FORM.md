# 📧 Berlin Holidays - Contact Form Setup

## 🎯 Overview

Your contact form sends emails **directly to Gmail** without storing data in a database.

**Simple. Direct. No complications.**

---

## 📚 Documentation Files

We've created several guides to help you:

### 🚀 Start Here
- **QUICK_START.md** - 3-step quick reference (5 min read)
- **SIMPLE_EMAIL_SETUP.md** - Complete step-by-step guide (15 min setup)

### 📖 Detailed Guides
- **EMAILJS_CREDENTIALS_GUIDE.md** - Where to find your 3 credentials
- **CONTACT_FORM_SUMMARY.md** - Technical overview and features

---

## ⚡ Quick Setup (3 Steps)

### 1. Create EmailJS Account
- Go to: https://www.emailjs.com/
- Sign up with: **berlinvayanad@gmail.com**
- Connect Gmail service

### 2. Get Your Credentials
You need 3 things from EmailJS:
- **Service ID** (from Gmail service)
- **Template ID** (from email template)
- **Public Key** (from account settings)

📖 See `EMAILJS_CREDENTIALS_GUIDE.md` for exact locations

### 3. Add to `.env` File
```env
VITE_EMAILJS_SERVICE_ID=your_service_id_here
VITE_EMAILJS_TEMPLATE_ID=your_template_id_here
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
VITE_CONTACT_EMAIL=berlinvayanad@gmail.com
```

**Save and restart your website!**

---

## ✅ How It Works

```
Customer → Fills Form → Clicks Send → Email to berlinvayanad@gmail.com
```

**No database. Just email.**

---

## 📧 What You'll Receive

When a customer submits the form, you get an email like this:

```
From: noreply@emailjs.com
To: berlinvayanad@gmail.com
Subject: New Contact Form Submission - General Inquiry

From: John Doe
Email: john@example.com
Subject: General Inquiry
Date: 1/10/2025, 3:45:00 PM

Message:
I would like to book a room for my honeymoon.
Can you provide more details about your packages?

---
This email was sent from the Berlin Holidays contact form.
```

---

## 🎨 Form Fields

The contact form includes:
- **Name** (required)
- **Email** (required, validated)
- **Subject** (dropdown):
  - Adventure
  - Honeymoon
  - Family Trip
  - General Inquiry
  - Booking Inquiry
- **Message** (required)

---

## 💰 Cost

**FREE** with EmailJS:
- 200 emails/month
- No credit card required
- Perfect for contact forms

---

## 🔒 Security

- ✅ No Gmail password exposed
- ✅ OAuth2 secure authentication
- ✅ Credentials in `.env` (not in code)
- ✅ `.env` is git-ignored (safe)

---

## 🧪 Testing

After setup:
1. Go to your Contact page
2. Fill out the form with test data
3. Click "Send Message"
4. Check your Gmail inbox (berlinvayanad@gmail.com)
5. Email should arrive within 1-2 minutes

---

## 🆘 Troubleshooting

### Not receiving emails?
- Check Gmail spam folder
- Wait 2-3 minutes
- Verify credentials in `.env` are correct
- Make sure you saved the `.env` file

### "Email service is not configured" error?
- Ensure all 3 credentials are in `.env`
- Restart your development server
- Check for typos in variable names

### Emails going to spam?
- Mark first email as "Not Spam"
- Add `noreply@emailjs.com` to contacts
- Future emails will go to inbox

---

## 📁 Project Structure

```
berlinnew/
├── src/
│   └── Pages/
│       └── InnerPage/
│           └── Contact.jsx          # Contact form component
├── .env                              # Your credentials go here
├── QUICK_START.md                    # Quick reference
├── SIMPLE_EMAIL_SETUP.md             # Detailed setup guide
├── EMAILJS_CREDENTIALS_GUIDE.md      # Where to find credentials
├── CONTACT_FORM_SUMMARY.md           # Technical overview
└── README_CONTACT_FORM.md            # This file
```

---

## 🎯 Features

✅ **Simple Setup** - 15 minutes to configure
✅ **Direct Email** - No database complexity
✅ **Form Validation** - Prevents invalid submissions
✅ **Loading States** - Shows "SENDING..." while processing
✅ **Success/Error Messages** - Clear user feedback
✅ **Auto-Reset** - Form clears after successful submission
✅ **Mobile Responsive** - Works on all devices
✅ **Brand Colors** - Matches Berlin Holidays theme

---

## 🔧 Technical Details

### Technology Stack
- **Frontend**: React + Vite
- **Email Service**: EmailJS
- **Styling**: Tailwind CSS
- **Alerts**: SweetAlert2
- **Icons**: React Icons

### Environment Variables
```env
VITE_EMAILJS_SERVICE_ID     # EmailJS Service ID
VITE_EMAILJS_TEMPLATE_ID    # EmailJS Template ID
VITE_EMAILJS_PUBLIC_KEY     # EmailJS Public Key
VITE_CONTACT_EMAIL          # Recipient email address
```

---

## 📞 Support

### For Setup Help
1. Read `SIMPLE_EMAIL_SETUP.md`
2. Check `EMAILJS_CREDENTIALS_GUIDE.md`
3. Contact EmailJS support: https://www.emailjs.com/docs/

### For Technical Issues
- Check browser console for errors
- Verify all credentials are correct
- Ensure development server is running
- Try clearing browser cache

---

## ✨ Next Steps

1. **Read** `QUICK_START.md` for overview
2. **Follow** `SIMPLE_EMAIL_SETUP.md` for setup
3. **Get** credentials from EmailJS
4. **Add** credentials to `.env` file
5. **Test** the contact form
6. **Done!** 🎉

---

## 📊 EmailJS Dashboard

After setup, you can monitor your emails at:
- https://www.emailjs.com/
- View sent emails
- Check delivery status
- Monitor monthly quota
- Update templates

---

## 🎉 That's It!

Your contact form is ready to send emails directly to your Gmail inbox.

**Simple. Direct. Effective.**

For detailed setup instructions, see **SIMPLE_EMAIL_SETUP.md**

---

**Happy emailing! 📧**

