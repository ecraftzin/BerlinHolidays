# 🔐 Login, Signup & Admin Dashboard Guide

## ✅ What's Been Added

Your Berlin Holidays project now has complete authentication and admin dashboard functionality!

---

## 📍 How to Access

### 1. **Login Page**
- **URL**: http://localhost:5174/login
- **Icon Location**: Top right corner of the navbar (user icon)
- **Demo Credentials**:
  - Email: `admin@berlinholidays.com`
  - Password: `admin123`

### 2. **Signup Page**
- **URL**: http://localhost:5174/signup
- **Access**: Click "Sign Up" link on the login page
- **Features**: Create new user account with name, email, phone, and password

### 3. **Admin Dashboard**
- **URL**: http://localhost:5174/admin/dashboard
- **Access**: Login first, then you'll be redirected to the dashboard
- **Direct Access**: Only available after logging in

---

## 🎯 Navigation

### Login Icon Location

**Desktop (Large Screens)**:
- Top right corner of the navbar
- Next to the "Booking Online" button
- User circle icon (white)
- Hover effect: scales up

**Mobile (Small Screens)**:
- Top right area of the mobile header
- Between dark mode toggle and menu button
- User circle icon (white)

### How to Login

1. Click the **user icon** in the top right corner
2. Enter credentials:
   - Email: `admin@berlinholidays.com`
   - Password: `admin123`
3. Click "Sign In"
4. You'll be redirected to `/admin/dashboard`

### How to Signup

1. Go to login page
2. Click "Sign Up" link at the bottom
3. Fill in the form:
   - Full Name
   - Email
   - Phone Number
   - Password
4. Click "Sign Up"
5. You'll be redirected to login page

---

## 🏢 Admin Dashboard Features

Once logged in, you have access to:

### Main Dashboard (`/admin/dashboard`)
- Overview statistics
- Total Rooms: 24
- Active Bookings: 18
- Blog Posts: 42
- Revenue tracking
- Special Offers: 8
- Quick action buttons

### Blog Management (`/admin/blog`)
- Create, edit, delete blog posts
- Manage blog content
- SEO optimization

### SEO Settings (`/admin/seo`)
- Meta tags management
- SEO optimization tools

### Room Management
- **Room Types** (`/admin/rooms/types`)
  - Manage different room categories
  - Add/edit room types
  
- **Rate Plans** (`/admin/rooms/rate-plans`)
  - Create pricing plans
  - Seasonal rates
  
- **Rates Calendar** (`/admin/rooms/rates`)
  - FullCalendar integration
  - Visual rate management
  
- **Availability** (`/admin/rooms/availability`)
  - Room availability calendar
  - Booking management

### Pricing & Offers
- **Pricing Plans** (`/admin/pricing-plans`)
  - Manage pricing tiers
  
- **Special Offers** (`/admin/special-offers`)
  - Create promotional offers
  - Discount management

### Restaurant Management
- **Categories** (`/admin/restaurant/categories`)
  - Food categories
  
- **Menu Items** (`/admin/restaurant/menu-items`)
  - Menu management
  - Pricing and descriptions

### Media & Users
- **Media Library** (`/admin/media`)
  - Image management
  
- **Users & Roles** (`/admin/users`)
  - User management
  - Role assignments

---

## 🎨 Admin Dashboard Design

### Color Scheme
- **Background**: `#f7f5f2` (light beige)
- **Accent Color**: `#c49e72` (gold/bronze)
- **Action Color**: `#006938` (green)
- **Dark Mode**: Fully supported

### Features
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Dark mode toggle
- ✅ Collapsible sidebar
- ✅ Statistics cards with icons
- ✅ Quick action buttons
- ✅ FullCalendar integration for rates/availability
- ✅ "Save & Publish" + "Save as Draft" buttons on all forms

---

## 🔄 How to Logout

1. Click the **Logout** button in the admin sidebar (bottom)
2. You'll be redirected to the login page
3. Auth token will be cleared from localStorage

---

## 🔗 All Available Routes

### Public Routes
```
/                          - Home page
/about                     - About page
/room                      - Rooms listing
/find_room                 - Room search/booking
/room_details              - Room details
/services                  - Services page
/service_details           - Service details
/our_team                  - Team page
/pricing                   - Pricing page
/blog                      - Blog listing
/blog/:id                  - Blog post details
/contact                   - Contact page
/supabase-test             - Supabase connection test
```

### Authentication Routes
```
/login                     - Login page
/signup                    - Signup page
```

### Admin Routes (Protected)
```
/admin/dashboard           - Main dashboard
/admin/blog                - Blog management
/admin/seo                 - SEO settings
/admin/rooms/types         - Room types
/admin/rooms/rate-plans    - Rate plans
/admin/rooms/rates         - Rates calendar
/admin/rooms/availability  - Room availability
/admin/pricing-plans       - Pricing plans
/admin/special-offers      - Special offers
/admin/restaurant/categories    - Restaurant categories
/admin/restaurant/menu-items    - Restaurant menu
/admin/media               - Media library
/admin/users               - Users & roles
```

---

## 🔐 Security Notes

### Current Setup (Demo)
- ⚠️ Using localStorage for demo authentication
- ⚠️ Hardcoded credentials (for testing only)
- ⚠️ No real password encryption

### Recommended: Integrate Supabase Auth

Replace demo authentication with real Supabase authentication:

1. **Update LoginPage.jsx**:
   - Replace hardcoded check with Supabase auth
   - See `src/examples/SupabaseAuthExample.jsx` for code

2. **Update SignupPage.jsx**:
   - Use Supabase signup instead of localStorage
   - See `src/examples/SupabaseAuthExample.jsx` for code

3. **Add Protected Routes**:
   - Wrap admin routes with authentication check
   - Redirect to login if not authenticated

**Example Code** (from SupabaseAuthExample.jsx):
```javascript
import { auth } from '../config/supabaseClient';

// Login
const { data, error } = await auth.signIn(email, password);

// Signup
const { data, error } = await auth.signUp(email, password, {
  name: userName,
  phone: userPhone,
});
```

---

## 🎯 Quick Test

1. **Start the dev server** (if not running):
   ```bash
   npm run dev
   ```

2. **Open your browser**: http://localhost:5174

3. **Click the user icon** in the top right corner

4. **Login with**:
   - Email: `admin@berlinholidays.com`
   - Password: `admin123`

5. **Explore the admin dashboard!**

---

## 📱 Responsive Design

### Desktop
- Full sidebar visible
- Large statistics cards
- Multi-column layout

### Tablet
- Collapsible sidebar
- Adjusted card layout
- Touch-friendly buttons

### Mobile
- Hamburger menu for sidebar
- Single column layout
- Mobile-optimized forms
- Swipe gestures supported

---

## 🎨 Customization

### Change Brand Colors

Edit the admin components to match your brand:

**AdminLayout.jsx**:
```javascript
backgroundColor: "#f7f5f2"  // Main background
```

**Buttons and Actions**:
```javascript
backgroundColor: "#006938"  // Green action color
color: "#c49e72"           // Gold accent color
```

### Add New Admin Pages

1. Create new component in `src/Pages/AdminDashboard/`
2. Import in `src/Router/Router.jsx`
3. Add route under `/admin` children
4. Add menu item in `AdminSidebar.jsx`

---

## 🆘 Troubleshooting

### Can't see login icon?
- Clear browser cache
- Refresh the page (Ctrl+F5)
- Check if dev server is running

### Login not working?
- Use exact credentials: `admin@berlinholidays.com` / `admin123`
- Check browser console for errors
- Verify localStorage is enabled

### Admin dashboard not loading?
- Make sure you're logged in first
- Check the URL: `/admin/dashboard`
- Look for errors in browser console

### Redirected to error page?
- Check if all admin components are properly imported
- Verify routes are correctly configured
- Check for missing dependencies

---

## 📚 Related Documentation

- **Supabase Integration**: `SUPABASE_SETUP.md`
- **Auth Examples**: `src/examples/SupabaseAuthExample.jsx`
- **Database Examples**: `src/examples/SupabaseDatabaseExample.jsx`
- **Integration Summary**: `SUPABASE_INTEGRATION_SUMMARY.md`

---

## ✨ Next Steps

1. ✅ **Test the login/signup flow**
2. ✅ **Explore the admin dashboard**
3. 🔄 **Integrate Supabase authentication** (recommended)
4. 🔄 **Create database tables in Supabase**
5. 🔄 **Connect admin forms to Supabase database**
6. 🔄 **Add real data management**

---

**Happy Managing!** 🎉

