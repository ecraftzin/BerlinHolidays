-- Berlin Holidays - Contact Inquiries Table
-- Run this script in your Supabase SQL Editor to create the contact inquiries table

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CONTACT INQUIRIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS contact_inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new', -- 'new', 'read', 'replied', 'archived'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_status ON contact_inquiries(status);
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_created_at ON contact_inquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_email ON contact_inquiries(email);

-- Enable Row Level Security (RLS)
ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert (submit contact form)
CREATE POLICY "Anyone can submit contact form" ON contact_inquiries
  FOR INSERT
  WITH CHECK (true);

-- Create policy to allow authenticated users to read all inquiries (for admin dashboard)
CREATE POLICY "Authenticated users can read all inquiries" ON contact_inquiries
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Create policy to allow authenticated users to update inquiries (for admin dashboard)
CREATE POLICY "Authenticated users can update inquiries" ON contact_inquiries
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Add comment to table
COMMENT ON TABLE contact_inquiries IS 'Stores customer contact form submissions from the Berlin Holidays website';

