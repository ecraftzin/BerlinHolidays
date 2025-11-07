# Supabase Integration Guide - Berlin Holidays

This document explains how Supabase has been integrated into the Berlin Holidays project and how to use it.

## 🎯 What's Been Set Up

Your Berlin Holidays project is now connected to Supabase with the following configuration:

- **Supabase URL**: `https://egqexbjvccihrvcrrydi.supabase.co`
- **Environment**: Production-ready with secure credential management
- **Features**: Authentication, Database, Real-time subscriptions ready

## 📁 Files Created

### 1. Environment Configuration
- **`.env`** - Contains your Supabase credentials (DO NOT commit to git)
- **`.env.example`** - Template for other developers
- **`.gitignore`** - Updated to exclude `.env` files

### 2. Supabase Client
- **`src/config/supabaseClient.js`** - Main Supabase client configuration with helper functions

### 3. Testing Utilities
- **`src/utils/testSupabaseConnection.js`** - Connection testing utilities
- **`src/Pages/SupabaseTest/SupabaseTest.jsx`** - Visual test page

## 🚀 Quick Start

### 1. Test the Connection

Visit the test page to verify everything is working:
```
http://localhost:5173/supabase-test
```

Or run the dev server:
```bash
npm run dev
```

### 2. Check Browser Console

Open the browser console (F12) to see detailed connection test results.

## 💻 How to Use Supabase in Your Code

### Import the Client

```javascript
import { supabase, auth, db } from '../config/supabaseClient';
```

### Authentication Examples

#### Sign Up a New User
```javascript
import { auth } from '../config/supabaseClient';

const handleSignUp = async (email, password, userData) => {
  const { data, error } = await auth.signUp(email, password, {
    name: userData.name,
    phone: userData.phone,
  });
  
  if (error) {
    console.error('Sign up error:', error.message);
    return;
  }
  
  console.log('User created:', data.user);
};
```

#### Sign In
```javascript
import { auth } from '../config/supabaseClient';

const handleSignIn = async (email, password) => {
  const { data, error } = await auth.signIn(email, password);
  
  if (error) {
    console.error('Sign in error:', error.message);
    return;
  }
  
  console.log('User signed in:', data.user);
};
```

#### Sign Out
```javascript
import { auth } from '../config/supabaseClient';

const handleSignOut = async () => {
  const { error } = await auth.signOut();
  
  if (error) {
    console.error('Sign out error:', error.message);
    return;
  }
  
  console.log('User signed out');
};
```

#### Get Current User
```javascript
import { auth } from '../config/supabaseClient';

const getCurrentUser = async () => {
  const { user, error } = await auth.getCurrentUser();
  
  if (error) {
    console.error('Error getting user:', error.message);
    return null;
  }
  
  return user;
};
```

### Database Examples

#### Fetch Data
```javascript
import { db } from '../config/supabaseClient';

// Get all rooms
const getRooms = async () => {
  const { data, error } = await db.select('rooms');
  
  if (error) {
    console.error('Error fetching rooms:', error.message);
    return [];
  }
  
  return data;
};

// Get rooms with filters
const getAvailableRooms = async () => {
  const { data, error } = await db
    .select('rooms')
    .eq('available', true)
    .order('price', { ascending: true });
  
  if (error) {
    console.error('Error:', error.message);
    return [];
  }
  
  return data;
};
```

#### Insert Data
```javascript
import { db } from '../config/supabaseClient';

const createBooking = async (bookingData) => {
  const { data, error } = await db.insert('bookings', {
    user_id: bookingData.userId,
    room_id: bookingData.roomId,
    check_in: bookingData.checkIn,
    check_out: bookingData.checkOut,
    total_price: bookingData.totalPrice,
  });
  
  if (error) {
    console.error('Error creating booking:', error.message);
    return null;
  }
  
  return data;
};
```

#### Update Data
```javascript
import { db } from '../config/supabaseClient';

const updateBooking = async (bookingId, updates) => {
  const { data, error } = await db
    .update('bookings', updates)
    .eq('id', bookingId);
  
  if (error) {
    console.error('Error updating booking:', error.message);
    return null;
  }
  
  return data;
};
```

#### Delete Data
```javascript
import { db } from '../config/supabaseClient';

const cancelBooking = async (bookingId) => {
  const { error } = await db
    .delete('bookings')
    .eq('id', bookingId);
  
  if (error) {
    console.error('Error canceling booking:', error.message);
    return false;
  }
  
  return true;
};
```

## 🗄️ Next Steps: Setting Up Your Database

### 1. Go to Supabase Dashboard
Visit: https://app.supabase.com/project/egqexbjvccihrvcrrydi

### 2. Create Tables

Example table structure for Berlin Holidays:

#### Users Table (if not using Supabase Auth)
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Rooms Table
```sql
CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  capacity INTEGER,
  available BOOLEAN DEFAULT true,
  images TEXT[],
  amenities TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Bookings Table
```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  room_id UUID REFERENCES rooms(id),
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. Set Up Row Level Security (RLS)

Enable RLS on your tables and create policies:

```sql
-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own bookings
CREATE POLICY "Users can view own bookings"
  ON bookings FOR SELECT
  USING (auth.uid() = user_id);

-- Allow users to create bookings
CREATE POLICY "Users can create bookings"
  ON bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

## 🔐 Security Best Practices

1. **Never commit `.env` file** - It's already in `.gitignore`
2. **Use Row Level Security (RLS)** - Always enable RLS on tables
3. **Validate data** - Always validate user input before sending to database
4. **Use the anon key** - The key in `.env` is the public anon key (safe for client-side)
5. **Service role key** - Never expose your service role key in client-side code

## 🔄 Real-time Subscriptions

Listen to database changes in real-time:

```javascript
import { supabase } from '../config/supabaseClient';

// Subscribe to new bookings
const subscription = supabase
  .channel('bookings-channel')
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'bookings' },
    (payload) => {
      console.log('New booking:', payload.new);
    }
  )
  .subscribe();

// Unsubscribe when component unmounts
return () => {
  subscription.unsubscribe();
};
```

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Authentication Guide](https://supabase.com/docs/guides/auth)
- [Database Guide](https://supabase.com/docs/guides/database)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

## 🆘 Troubleshooting

### Connection Issues
1. Check that `.env` file exists and has correct values
2. Verify Supabase project is active in dashboard
3. Check browser console for detailed error messages

### Authentication Issues
1. Verify email confirmation is disabled (or handle email verification)
2. Check RLS policies aren't blocking access
3. Ensure user is properly signed in before accessing protected data

### Database Issues
1. Verify tables exist in Supabase dashboard
2. Check RLS policies allow the operation
3. Validate data types match table schema

## 📞 Support

For Supabase-specific issues, check:
- [Supabase Discord](https://discord.supabase.com)
- [Supabase GitHub Discussions](https://github.com/supabase/supabase/discussions)

