-- Translation Cache Table for BloxSmith Website
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS translation_cache (
    id SERIAL PRIMARY KEY,
    source_text TEXT NOT NULL,
    target_lang VARCHAR(10) NOT NULL,
    translated_text TEXT NOT NULL,
    source_lang VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Unique constraint for source text + target language
    UNIQUE(source_text, target_lang)
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_translation_lookup 
ON translation_cache(source_text, target_lang);

-- Enable Row Level Security (optional, for public access)
ALTER TABLE translation_cache ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read/write for translations (shared cache)
CREATE POLICY "Allow public read" ON translation_cache
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert" ON translation_cache
    FOR INSERT WITH CHECK (true);

-- Comment
COMMENT ON TABLE translation_cache IS 'Caches translations to avoid repeated API calls. Shared across all users.';
