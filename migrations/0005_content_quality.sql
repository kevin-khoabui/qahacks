ALTER TABLE posts ADD COLUMN status TEXT NOT NULL DEFAULT 'published';
ALTER TABLE posts ADD COLUMN quality_score INTEGER;
ALTER TABLE posts ADD COLUMN question_fingerprint TEXT;
ALTER TABLE posts ADD COLUMN duplicate_of TEXT;
ALTER TABLE posts ADD COLUMN reviewed_at TEXT;

CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_quality_score ON posts(quality_score);
CREATE INDEX IF NOT EXISTS idx_posts_fingerprint ON posts(question_fingerprint);
