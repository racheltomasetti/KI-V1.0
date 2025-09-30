-- ================================================================
-- Supabase Database Setup for KI Platform
-- ================================================================
-- Run this SQL in your Supabase SQL Editor (Dashboard > SQL Editor)
-- ================================================================

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  onboarding_completed BOOLEAN DEFAULT false,

  -- Onboarding data (populated by agents)
  personality_profile JSONB,
  life_timeline JSONB,
  learning_preferences JSONB,
  content_goals JSONB,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);

-- ================================================================
-- Row Level Security (RLS) Policies
-- ================================================================

-- Enable RLS on user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON user_profiles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  USING (auth.uid() = user_id);

-- ================================================================
-- Auto-create profile on user signup
-- ================================================================

-- Function to create user profile automatically
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call function on new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ================================================================
-- Updated_at trigger
-- ================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on profile changes
DROP TRIGGER IF EXISTS on_user_profile_updated ON user_profiles;
CREATE TRIGGER on_user_profile_updated
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ================================================================
-- Verification Query
-- ================================================================

-- Run this to verify the setup worked
SELECT
  'user_profiles table' as check_name,
  COUNT(*) as record_count
FROM user_profiles;
