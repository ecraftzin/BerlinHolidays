# EmailJS Setup Guide - Contact Form Email Notifications

## 🎯 Goal
Set up email notifications to **meenakshy.ecraftz@gmail.com** for testing, then switch to **berlinvayanad@gmail.com** for production.

---

## 📧 Step-by-Step Setup (10 Minutes)

### Step 1: Create EmailJS Account

1. Go to: **https://www.emailjs.com/**
2. Click **"Sign Up"** (top right)
3. Sign up with your email: **meenakshy.ecraftz@gmail.com**
4. Verify your email address
5. Log in to EmailJS Dashboard

---

### Step 2: Add Email Service

1. In EmailJS Dashboard, click **"Email Services"** (left sidebar)
2. Click **"Add New Service"**
3. Choose **"Gmail"**
4. Click **"Connect Account"**
5. Sign in with your Gmail account: **meenakshy.ecraftz@gmail.com**
6. Allow EmailJS to access your Gmail
7. **Copy the Service ID** (looks like: `service_xxxxxxx`)
   - Save this! You'll need it later
8. Click **"Create Service"**

---

### Step 3: Create Email Template

1. Click **"Email Templates"** (left sidebar)
2. Click **"Create New Template"**
3. **Template Name**: `contact_form_notification`
4. **Template Content**:

**Subject:**
```
New Contact Form Submission - {{subject}}
```

**Body (HTML):**
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f7f5f2;">
  <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
    
    <h2 style="color: #006938; margin-top: 0; border-bottom: 3px solid #c49e72; padding-bottom: 10px;">
      🏨 New Contact Form Submission
    </h2>
    
    <div style="margin: 20px 0;">
      <p style="margin: 10px 0;">
        <strong style="color: #c49e72;">Name:</strong><br>
        <span style="color: #333;">{{from_name}}</span>
      </p>
      
      <p style="margin: 10px 0;">
        <strong style="color: #c49e72;">Email:</strong><br>
        <span style="color: #333;">{{from_email}}</span>
      </p>
      
      <p style="margin: 10px 0;">
        <strong style="color: #c49e72;">Subject:</strong><br>
        <span style="color: #333;">{{subject}}</span>
      </p>
      
      <p style="margin: 10px 0;">
        <strong style="color: #c49e72;">Message:</strong><br>
        <span style="color: #333; white-space: pre-wrap;">{{message}}</span>
      </p>
      
      <p style="margin: 20px 0 10px 0; padding-top: 20px; border-top: 1px solid #e0e0e0;">
        <small style="color: #666;">
          Submitted on: {{submission_date}}<br>
          From: Berlin Holidays Contact Form
        </small>
      </p>
    </div>
    
    <div style="margin-top: 30px; padding: 15px; background-color: #f7f5f2; border-left: 4px solid #c49e72;">
      <p style="margin: 0; color: #666; font-size: 14px;">
        <strong>Reply to customer:</strong> {{from_email}}
      </p>
    </div>
    
  </div>
</div>
```

5. **Settings** (scroll down):
   - **To Email**: `{{to_email}}` (keep this as is - we'll set it dynamically)
   - **From Name**: `Berlin Holidays Contact Form`
   - **Reply To**: `{{from_email}}`

6. Click **"Save"**
7. **Copy the Template ID** (looks like: `template_xxxxxxx`)
   - Save this! You'll need it later

---

### Step 4: Get Your Public Key

1. Click **"Account"** (left sidebar)
2. Go to **"General"** tab
3. Find **"Public Key"** section
4. **Copy the Public Key** (looks like: `xxxxxxxxxxxxxxx`)
   - Save this! You'll need it later

---

### Step 5: Test the Template (Optional but Recommended)

1. Go back to **"Email Templates"**
2. Click on your template: `contact_form_notification`
3. Click **"Test It"** button
4. Fill in test values:
   - `from_name`: Test User
   - `from_email`: test@example.com
   - `subject`: Test Subject
   - `message`: This is a test message
   - `to_email`: meenakshy.ecraftz@gmail.com
   - `submission_date`: 2025-01-10
5. Click **"Send Test Email"**
6. Check your inbox: **meenakshy.ecraftz@gmail.com**
7. You should receive a beautifully formatted email! ✅

---

## 🔑 Your EmailJS Credentials

After completing the steps above, you should have these 3 values:

```
Service ID:  service_xxxxxxx
Template ID: template_xxxxxxx
Public Key:  xxxxxxxxxxxxxxx
```

**⚠️ IMPORTANT**: Keep these values safe! You'll add them to the `.env` file next.

---

## 📝 Next Steps

Once you have your credentials:

1. I'll update the `.env` file with your credentials
2. I'll update the Contact.jsx component to send emails
3. You'll test the form
4. Email will arrive at **meenakshy.ecraftz@gmail.com**
5. After testing, we'll switch to **berlinvayanad@gmail.com**

---

## 🎨 Email Preview

When someone submits the contact form, you'll receive an email that looks like this:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏨 New Contact Form Submission
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Name:
John Doe

Email:
john@example.com

Subject:
Honeymoon Package Inquiry

Message:
Hi, I'm interested in booking a honeymoon 
package for next month. Can you provide 
more details about your romantic getaway 
packages?

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Submitted on: 2025-01-10 14:30:00
From: Berlin Holidays Contact Form

Reply to customer: john@example.com
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 🔄 Switching to Client Email Later

When you're ready to switch from testing to production:

1. Update `.env` file:
   ```
   VITE_CONTACT_EMAIL=berlinvayanad@gmail.com
   ```

2. Restart the dev server:
   ```bash
   npm run dev
   ```

That's it! Emails will now go to the client's inbox.

---

## 📊 EmailJS Free Tier Limits

- **200 emails per month** (free)
- Perfect for small to medium businesses
- Upgrade to paid plan if you need more

---

## ✅ Checklist

- [ ] Created EmailJS account
- [ ] Connected Gmail service
- [ ] Created email template
- [ ] Copied Service ID
- [ ] Copied Template ID
- [ ] Copied Public Key
- [ ] Tested template (optional)
- [ ] Ready to add credentials to `.env`

---

## 🆘 Troubleshooting

### Can't connect Gmail?
- Make sure you're using the correct Gmail account
- Check if 2-factor authentication is enabled (it's okay if it is)
- Try using an app-specific password if needed

### Template not working?
- Make sure all variable names match: `{{from_name}}`, `{{from_email}}`, etc.
- Check that `{{to_email}}` is set in the "To Email" field

### Not receiving test emails?
- Check spam folder
- Verify the email address is correct
- Wait a few minutes (sometimes delayed)

---

## 📞 Ready?

Once you have your 3 credentials (Service ID, Template ID, Public Key), let me know and I'll:
1. Add them to the `.env` file
2. Update the Contact component
3. You can test immediately!

**Please provide your EmailJS credentials when ready:**
- Service ID: `service_???????`
- Template ID: `template_???????`
- Public Key: `???????????????`

