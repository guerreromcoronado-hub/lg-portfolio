-- Create posts table for blog articles
CREATE TABLE IF NOT EXISTS posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT NOT NULL,
  content JSONB NOT NULL, -- Structured content for the article
  category TEXT NOT NULL,
  emoji TEXT DEFAULT '📝',
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE,
  author_id UUID REFERENCES auth.users(id),
  views INTEGER DEFAULT 0,
  read_time TEXT DEFAULT '5 min',
  cover_image TEXT
);

-- Create projects table for case studies
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT NOT NULL,
  content JSONB NOT NULL, -- Structured content for the case study
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  emoji TEXT DEFAULT '🚀',
  client TEXT,
  services TEXT,
  duration TEXT,
  year TEXT,
  tools TEXT[] DEFAULT '{}',
  metrics JSONB, -- Key metrics as JSON
  results JSONB, -- Results section as JSON (legacy, migrated to content.sections on edit)
  cover_image TEXT,
  published BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE,
  author_id UUID REFERENCES auth.users(id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS posts_slug_idx ON posts(slug);
CREATE INDEX IF NOT EXISTS posts_published_idx ON posts(published);
CREATE INDEX IF NOT EXISTS posts_category_idx ON posts(category);
CREATE INDEX IF NOT EXISTS projects_slug_idx ON projects(slug);
CREATE INDEX IF NOT EXISTS projects_published_idx ON projects(published);
CREATE INDEX IF NOT EXISTS projects_featured_idx ON projects(featured);

-- Enable Row Level Security
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create policies for posts
CREATE POLICY "Anyone can read published posts" ON posts
  FOR SELECT USING (published = true);

CREATE POLICY "Authenticated users can do everything with posts" ON posts
  FOR ALL USING (auth.role() = 'authenticated');

-- Create policies for projects
CREATE POLICY "Anyone can read published projects" ON projects
  FOR SELECT USING (published = true);

CREATE POLICY "Authenticated users can do everything with projects" ON projects
  FOR ALL USING (auth.role() = 'authenticated');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
