CREATE TABLE user_profiles (
 owner_id TEXT PRIMARY KEY NOT NULL,
 display_name TEXT NOT NULL,
 avatar TEXT NOT NULL,
 revision INTEGER NOT NULL DEFAULT 1,
 updated_at TEXT NOT NULL
);
