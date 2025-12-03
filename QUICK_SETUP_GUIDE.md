# Quick Setup Guide - Customer Authentication

## 🚀 Get Started in 3 Steps

### Step 1: Create Database Tables (5 minutes)

1. **Open Supabase Dashboard**
   - Go to https://supabase.com
   - Open your project: `berlinvayanad@gmail.com's Project`

2. **Run SQL Migration**
   - Click on **SQL Editor** in the left sidebar
   - Click **New Query**
   - Open the file `create_customer_auth_tables.sql` in your project
   - Copy ALL the SQL code
   - Paste it into the Supabase SQL Editor
   - Click **Run** button (or press Ctrl+Enter)

3. **Verify Tables Created**
   - Click on **Table Editor** in the left sidebar
   - You should see two new tables:
     - `customer_profiles`
     - `bookings`
   - If you see these tables, you're done! ✅

---

### Step 2: Test the Application (10 minutes)

1. **Start the Development Server**
   ```bash
   npm run dev
   ```

2. **Test Signup Flow**
   - Open the website in your browser
   - Click on the person icon in the header
   - Click "Don't have an account? Sign up"
   - Fill in the signup form:
     - Name: Test User
     - Email: test@example.com
     - Phone: 1234567890
     - Address: 123 Test Street (optional)
     - Password: test123
     - Confirm Password: test123
   - Click "Create Account"
   - You should see a success message!

3. **Test Login Flow**
   - You'll be redirected to the login page
   - Enter your credentials:
     - Email: test@example.com
     - Password: test123
   - Click "Sign In"
   - You should see "Welcome Back!" message
   - You'll be redirected to the home page

4. **Check Profile Icon**
   - Look at the header
   - You should see a green circle with the letter "T" (first letter of "Test")
   - Click on it
   - You should see a dropdown menu with:
     - Your name and email
     - "My Bookings" link
     - "My Profile" link
     - "Sign Out" button

5. **Test Sign Out**
   - Click "Sign Out" in the dropdown
   - Confirm the sign out
   - You should be signed out
   - The profile icon should change back to a login link

---

### Step 3: Verify Database (2 minutes)

1. **Check Customer Profile in Database**
   - Go back to Supabase Dashboard
   - Click on **Table Editor**
   - Click on `customer_profiles` table
   - You should see your test user's data:
     - Name: Test User
     - Email: test@example.com
     - Phone: 1234567890
     - Address: 123 Test Street

2. **Test Duplicate Email Prevention**
   - Try to sign up again with the same email (test@example.com)
   - You should see an error: "This email is already registered"
   - This confirms email uniqueness is working! ✅

---

## ✅ Success Checklist

After completing the setup, verify:

- [ ] Database tables created in Supabase
- [ ] Can sign up with new email
- [ ] Cannot sign up with duplicate email
- [ ] Can login with correct credentials
- [ ] Cannot login with wrong credentials
- [ ] Profile icon shows after login
- [ ] Profile dropdown works
- [ ] Can sign out successfully
- [ ] Customer data appears in database

---

## 🐛 Troubleshooting

### Issue: SQL Migration Fails
**Solution**: 
- Make sure you copied the ENTIRE SQL file
- Check for any syntax errors in the SQL Editor
- Try running the SQL in smaller chunks

### Issue: Login/Signup Not Working
**Solution**:
- Check browser console for errors (F12)
- Verify Supabase credentials in `src/config/supabaseClient.js`
- Make sure the database tables were created successfully

### Issue: Profile Icon Not Showing
**Solution**:
- Clear browser cache and refresh
- Check if you're actually logged in (check browser console)
- Verify AuthContext is properly wrapped in Main.jsx

### Issue: "Email already registered" on First Signup
**Solution**:
- Go to Supabase Dashboard → Authentication → Users
- Delete the test user
- Try signing up again

---

## 📞 Need Help?

If you encounter any issues:
1. Check the browser console for error messages (F12)
2. Check the Supabase logs in the dashboard
3. Verify all files were created correctly
4. Make sure you ran the SQL migration

---

## 🎉 You're All Set!

Once you've completed these steps, your customer authentication system is fully functional!

Customers can now:
- Sign up for an account
- Login securely
- See their profile in the header
- Book rooms (coming next!)

**Next Steps**: 
- Protect the booking form to require authentication
- Create "My Bookings" page
- Create "My Profile" page

See `CUSTOMER_AUTHENTICATION_IMPLEMENTATION.md` for more details!

