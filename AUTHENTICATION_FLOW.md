# Customer Authentication Flow

## 📊 Visual Flow Diagrams

### 1. New Customer Signup Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     NEW CUSTOMER JOURNEY                         │
└─────────────────────────────────────────────────────────────────┘

    Customer visits website
            │
            ▼
    Clicks person icon in header
            │
            ▼
    Redirected to /login page
            │
            ▼
    Clicks "Don't have an account? Sign up"
            │
            ▼
    Redirected to /signup page
            │
            ▼
    Fills signup form:
    ┌─────────────────────────┐
    │ • Name                  │
    │ • Email (validated)     │
    │ • Phone (10-15 digits)  │
    │ • Address (optional)    │
    │ • Password (min 6 char) │
    │ • Confirm Password      │
    └─────────────────────────┘
            │
            ▼
    Clicks "Create Account"
            │
            ▼
    ┌─────────────────────────────────────┐
    │  System Validates:                  │
    │  ✓ Email format valid?              │
    │  ✓ Email not already registered?    │
    │  ✓ Phone number valid?              │
    │  ✓ Passwords match?                 │
    └─────────────────────────────────────┘
            │
            ├─── ❌ Validation Failed
            │         │
            │         ▼
            │    Show error message
            │         │
            │         └──> Stay on signup page
            │
            └─── ✅ Validation Passed
                      │
                      ▼
            Create user in Supabase Auth
                      │
                      ▼
            Create customer profile in database
                      │
                      ▼
            Show success message
                      │
                      ▼
            Redirect to /login page
                      │
                      ▼
            Customer logs in
                      │
                      ▼
            ✅ READY TO BOOK ROOMS!
```

---

### 2. Returning Customer Login Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                  RETURNING CUSTOMER JOURNEY                      │
└─────────────────────────────────────────────────────────────────┘

    Customer visits website
            │
            ▼
    Clicks person icon in header
            │
            ▼
    Redirected to /login page
            │
            ▼
    Fills login form:
    ┌─────────────────────────┐
    │ • Email                 │
    │ • Password              │
    └─────────────────────────┘
            │
            ▼
    Clicks "Sign In"
            │
            ▼
    ┌─────────────────────────────────────┐
    │  System Checks:                     │
    │  ✓ Email exists in database?        │
    │  ✓ Password correct?                │
    └─────────────────────────────────────┘
            │
            ├─── ❌ Login Failed
            │         │
            │         ▼
            │    Show error message
            │         │
            │         └──> Stay on login page
            │
            └─── ✅ Login Successful
                      │
                      ▼
            Load user session
                      │
                      ▼
            Load customer profile from database
                      │
                      ▼
            Show "Welcome Back!" message
                      │
                      ▼
            Redirect to home page (or previous page)
                      │
                      ▼
            Header shows profile icon
                      │
                      ▼
            ✅ READY TO BOOK ROOMS!
```

---

### 3. Profile Icon & Dropdown Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    PROFILE ICON DISPLAY                          │
└─────────────────────────────────────────────────────────────────┘

    User logged in?
            │
            ├─── ❌ NO
            │         │
            │         ▼
            │    Show login icon (FaUserCircle)
            │         │
            │         ▼
            │    Click → Redirect to /login
            │
            └─── ✅ YES
                      │
                      ▼
            Has Google profile photo?
                      │
                      ├─── ✅ YES
                      │         │
                      │         ▼
                      │    Show Google photo in circle
                      │
                      └─── ❌ NO
                                │
                                ▼
                        Show first letter of name
                        in green circle (#006938)
                                │
                                ▼
                        Click on profile icon
                                │
                                ▼
                        Show dropdown menu:
                        ┌─────────────────────────┐
                        │ 👤 User Name            │
                        │    user@email.com       │
                        │ ─────────────────────── │
                        │ 📅 My Bookings          │
                        │ 👤 My Profile           │
                        │ 🚪 Sign Out             │
                        └─────────────────────────┘
```

---

### 4. Booking Flow (After Authentication)

```
┌─────────────────────────────────────────────────────────────────┐
│                      BOOKING FLOW                                │
└─────────────────────────────────────────────────────────────────┘

    Customer browses rooms
            │
            ▼
    Clicks "Book Now" on a room
            │
            ▼
    System checks: User logged in?
            │
            ├─── ❌ NO
            │         │
            │         ▼
            │    Show "Please login to book" message
            │         │
            │         ▼
            │    Redirect to /login
            │         │
            │         └──> After login, return to room page
            │
            └─── ✅ YES
                      │
                      ▼
            Show booking form
                      │
                      ▼
            Customer fills form:
            ┌─────────────────────────┐
            │ • Check-in date         │
            │ • Check-out date        │
            │ • Number of rooms       │
            │ • Number of adults      │
            │ • Number of children    │
            │ • Special requests      │
            └─────────────────────────┘
                      │
                      ▼
            Clicks "Confirm Booking"
                      │
                      ▼
            Create booking in database:
            ┌─────────────────────────┐
            │ • User ID (from auth)   │
            │ • Customer details      │
            │ • Room details          │
            │ • Booking dates         │
            │ • Guest counts          │
            │ • Status: pending       │
            └─────────────────────────┘
                      │
                      ▼
            Show success message
                      │
                      ▼
            ✅ BOOKING CONFIRMED!
                      │
                      ▼
            Customer can view in "My Bookings"
```

---

## 🔐 Security Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                               │
└─────────────────────────────────────────────────────────────────┘

    1. Frontend Validation
       ├─ Email format check
       ├─ Phone number format check
       ├─ Password length check
       └─ Password match check

    2. Supabase Auth
       ├─ Email uniqueness check
       ├─ Password hashing
       ├─ Session token generation
       └─ Token refresh

    3. Database Security (RLS)
       ├─ Users can only view their own data
       ├─ Users can only edit their own data
       ├─ Users can only create bookings for themselves
       └─ Automatic user_id validation

    4. Session Management
       ├─ Secure token storage
       ├─ Automatic session refresh
       ├─ Session expiration handling
       └─ Logout clears all tokens
```

---

## 📱 Responsive Design

```
┌─────────────────────────────────────────────────────────────────┐
│                  MOBILE vs DESKTOP                               │
└─────────────────────────────────────────────────────────────────┘

    MOBILE (isMobile={true})
    ├─ Smaller profile icon (w-8 h-8)
    ├─ Dropdown positioned: right-0 top-10
    └─ Compact menu items

    DESKTOP (isMobile={false})
    ├─ Larger profile icon (w-10 h-10)
    ├─ Dropdown positioned: right-0 top-12
    ├─ Hover effects (scale, color change)
    └─ Larger menu items
```

---

## 🎨 Brand Colors Used

```
Primary Action:   #006938 (Green)
Hover State:      #004d27 (Darker Green)
Accent:           #c49e72 (Khaki/Gold)
Background:       #f7f5f2 (Light Beige)
Text:             #000000 (Black)
```

---

This flow ensures a smooth, secure, and user-friendly authentication experience!

