-- BloxSmith AI Database Schema
-- Run this SQL in Supabase SQL Editor (supabase.com > SQL Editor > New Query)

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    plan VARCHAR(50) DEFAULT 'Free',
    status VARCHAR(20) DEFAULT 'active',
    avatar TEXT,
    roblox_id BIGINT,
    joined TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Access keys table
CREATE TABLE IF NOT EXISTS access_keys (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    key_type VARCHAR(50) NOT NULL,
    notes TEXT,
    used_by UUID REFERENCES users(id),
    used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activity logs table
CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_type VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    user_id UUID REFERENCES users(id),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Security violations table
CREATE TABLE IF NOT EXISTS violations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_name VARCHAR(255) NOT NULL,
    reason TEXT NOT NULL,
    severity VARCHAR(20) DEFAULT 'medium',
    content TEXT,
    resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE violations ENABLE ROW LEVEL SECURITY;

-- Policies for public read access (admin panel uses anon key)
CREATE POLICY "Allow public read" ON users FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON users FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON users FOR DELETE USING (true);

CREATE POLICY "Allow public read" ON access_keys FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON access_keys FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON access_keys FOR UPDATE USING (true);

CREATE POLICY "Allow public read" ON activity_logs FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON activity_logs FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read" ON violations FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON violations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON violations FOR UPDATE USING (true);

-- Insert some sample data
INSERT INTO users (name, email, plan, status, avatar) VALUES
('LilNug', 'lilnug@example.com', 'Lifetime', 'active', 'https://tr.rbxcdn.com/30DAY-AvatarHeadshot-8846059345789345-Png/150/150/AvatarHeadshot/Png'),
('Noone12', 'noone12@example.com', 'Annual Pro', 'active', 'https://tr.rbxcdn.com/30DAY-AvatarHeadshot-8846059345789345-Png/150/150/AvatarHeadshot/Png');

INSERT INTO access_keys (code, key_type, notes) VALUES
('PRO-A8X2-9K4M', 'Monthly Pro', 'Demo key'),
('LIFE-ZQ7W-BN3P', 'Lifetime', 'Founder key');

INSERT INTO activity_logs (event_type, description) VALUES
('signup', 'LilNug created an account'),
('key', 'Key PRO-A8X2-9K4M generated');

-- =============================================
-- FORUM POSTS TABLE (with moderation)
-- =============================================
CREATE TABLE IF NOT EXISTS forum_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    author_id UUID REFERENCES users(id) ON DELETE CASCADE,
    author_name VARCHAR(255) NOT NULL,
    author_avatar TEXT,
    category VARCHAR(50) NOT NULL DEFAULT 'general',
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    likes INTEGER DEFAULT 0,
    liked_by UUID[] DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- FORUM COMMENTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS forum_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE,
    author_id UUID REFERENCES users(id) ON DELETE CASCADE,
    author_name VARCHAR(255) NOT NULL,
    author_avatar TEXT,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- NOTIFICATIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'comment', 'like', 'post_approved', 'post_rejected'
    message TEXT NOT NULL,
    link TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for new tables
ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Forum posts policies
CREATE POLICY "Allow public read approved posts" ON forum_posts FOR SELECT USING (status = 'approved');
CREATE POLICY "Allow admin read all posts" ON forum_posts FOR SELECT USING (true);
CREATE POLICY "Allow public insert posts" ON forum_posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update own posts" ON forum_posts FOR UPDATE USING (true);
CREATE POLICY "Allow public delete own posts" ON forum_posts FOR DELETE USING (true);

-- Forum comments policies  
CREATE POLICY "Allow public read comments" ON forum_comments FOR SELECT USING (true);
CREATE POLICY "Allow public insert comments" ON forum_comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public delete own comments" ON forum_comments FOR DELETE USING (true);

-- Notifications policies
CREATE POLICY "Allow public read own notifications" ON notifications FOR SELECT USING (true);
CREATE POLICY "Allow public insert notifications" ON notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update own notifications" ON notifications FOR UPDATE USING (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_forum_posts_status ON forum_posts(status);
CREATE INDEX IF NOT EXISTS idx_forum_posts_created ON forum_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_forum_comments_post ON forum_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, is_read);
