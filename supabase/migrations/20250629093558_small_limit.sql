/*
  # Fix RLS policies for profiles table

  1. Security Updates
    - Drop existing policies that use incorrect uid() function
    - Create new policies using correct auth.uid() function
    - Ensure authenticated users can manage their own profiles

  2. Policy Changes
    - INSERT: Allow authenticated users to create their own profile
    - SELECT: Allow authenticated users to read their own profile  
    - UPDATE: Allow authenticated users to update their own profile
    - DELETE: Allow authenticated users to delete their own profile

  This fixes the "new row violates row-level security policy" error by using the correct Supabase auth function.
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Create new policies with correct auth.uid() function
CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete own profile"
  ON profiles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = id);