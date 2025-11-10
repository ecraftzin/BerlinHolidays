# ⚡ Quick Start - Email Testing (5 Steps)

## 🎯 Goal
Test contact form with **meenakshy.ecraftz@gmail.com**, then switch to **berlinvayanad@gmail.com**

---

## 📝 Step 1: Set Up EmailJS (10 minutes)

1. **Go to**: https://www.emailjs.com/
2. **Sign up** with: meenakshy.ecraftz@gmail.com
3. **Add Gmail Service**:
   - Email Services → Add New Service → Gmail
   - Connect your Gmail account
   - **Copy Service ID**: `service_xxxxxxx`

4. **Create Template**:
   - Email Templates → Create New Template
   - Name: `contact_form_notification`
   - **Subject**: `New Contact Form Submission - {{subject}}`
   - **Body**: Copy from EMAILJS_SETUP_GUIDE.md (or use simple text)
   - **To Email**: `{{to_email}}`
   - **Reply To**: `{{from_email}}`
   - **Copy Template ID**: `template_xxxxxxx`

5. **Get Public Key**:
   - Account → General → Public Key
   - **Copy Public Key**: `xxxxxxxxxxxxxxx`

---

## 📝 Step 2: Add Credentials to `.env`

Open `.env` file and update these lines:

```env
VITE_EMAILJS_SERVICE_ID=service_xxxxxxx    # Your Service ID
VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx  # Your Template ID
VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxx    # Your Public Key
VITE_CONTACT_EMAIL=meenakshy.ecraftz@gmail.com
```

**Save the file!**

---

## 📝 Step 3: Create Database Table

1. **Go to**: https://app.supabase.com
2. **Select project**: egqexbjvccihrvcrrydi
3. **SQL Editor** → **New Query**
4. **Copy/paste** from: `create_contact_inquiries_table.sql`
5. **Click Run**

---

## 📝 Step 4: Restart Server

```bash
# Stop server (Ctrl+C in terminal)
npm run dev
```

---

## 📝 Step 5: Test the Form

1. **Open**: http://localhost:5173/contact
2. **Fill form**:
   - Name: Test User
   - Email: test@example.com
   - Subject: Adventure
   - Message: This is a test
3. **Click**: SEND MESSAGE
4. **Check**:
   - ✅ Success message appears
   - ✅ Form resets
   - ✅ Email arrives at **meenakshy.ecraftz@gmail.com** (check spam too!)
   - ✅ Data in Supabase table

---

## 🔄 Switch to Client Email (After Testing)

1. **Update `.env`**:
   ```env
   VITE_CONTACT_EMAIL=berlinvayanad@gmail.com
   ```

2. **Restart server**:
   ```bash
   npm run dev
   ```

3. **Done!** Emails now go to client.

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| No email received | Check spam folder, verify EmailJS credentials |
| "EmailJS not configured" | Restart server after updating `.env` |
| Dropdown not working | Clear cache (Ctrl+Shift+Delete), refresh |
| Form not submitting | Check browser console (F12) for errors |

---

## 📋 Your EmailJS Credentials

Fill this in after setup:

```
Service ID:  _______________________
Template ID: _______________________
Public Key:  _______________________
```

---

## ✅ Checklist

- [ ] EmailJS account created
- [ ] Gmail service connected
- [ ] Email template created
- [ ] Credentials added to `.env`
- [ ] Database table created
- [ ] Server restarted
- [ ] Form tested successfully
- [ ] Email received at meenakshy.ecraftz@gmail.com

---

## 📞 Ready to Test?

1. Complete Steps 1-4
2. Test the form (Step 5)
3. If email arrives → Success! ✅
4. If not → Check troubleshooting section

**Need detailed help?** See `EMAILJS_SETUP_GUIDE.md` and `CONTACT_FORM_TESTING_GUIDE.md`

