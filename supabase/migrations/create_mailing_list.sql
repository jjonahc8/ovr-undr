-- Create mailing_list table
CREATE TABLE IF NOT EXISTS mailing_list (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_mailing_list_email ON mailing_list(email);

-- Enable Row Level Security
ALTER TABLE mailing_list ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts (for signups)
CREATE POLICY "Allow public inserts" ON mailing_list
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create policy to allow select only for authenticated users
CREATE POLICY "Allow authenticated users to read" ON mailing_list
  FOR SELECT
  TO authenticated
  USING (true);
